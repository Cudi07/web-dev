import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { fileUploads } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    // Allow uploads without authentication for the inquiry form
    const user = await currentUser();
    const { userId } = await auth();
    
    console.log('Upload request received:', {
      isAuthenticated: !!userId,
      userId: userId || 'anonymous'
    });

    let formData;
    try {
      formData = await req.formData();
      console.log('Form data keys:', [...formData.keys()]);
    } catch (error) {
      console.error('Failed to parse form data:', error);
      return NextResponse.json(
        { error: "Invalid form data" },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File;
    const fullName = formData.get("fullName") as string;
    const address = formData.get("address") as string;
    const documentType = formData.get("documentType") as string;
    const purpose = formData.get("purpose") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    if (!file || !fullName || !address || !documentType || !purpose) {
      console.error('Missing required fields:', {
        hasFile: !!file,
        hasFullName: !!fullName,
        hasAddress: !!address,
        hasDocumentType: !!documentType,
        hasPurpose: !!purpose
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log file details
    console.log('File received:', {
      name: file.name,
      size: file.size,
      type: file.type,
      fullName,
      documentType,
      purpose
    });

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload JPEG, PNG, or PDF" },
        { status: 400 }
      );
    }

    let buffer;
    try {
      buffer = await file.arrayBuffer();
    } catch (error) {
      console.error('Failed to read file buffer:', error);
      return NextResponse.json(
        { error: "Failed to process file" },
        { status: 500 }
      );
    }

    const base64Data = Buffer.from(buffer).toString('base64');
    console.log('File converted to base64, size:', base64Data.length);

    try {
      // Insert file data into database
      const result = await db.insert(fileUploads).values({
        fileName: file.name,
        fileSize: Number(file.size),
        mimeType: file.type,
        fileData: base64Data,
        uploadedBy: userId || 'anonymous',
        status: 'pending',
        fullName,
        address,
        documentType,
        purpose,
        requestType: 'request',
        email: email || null,
        phone: phone || null
      }).returning();

      const uploadedFile = result[0];
      if (!uploadedFile) {
        throw new Error("No result returned from database insert");
      }

      console.log('File uploaded successfully:', {
        id: uploadedFile.id,
        fileName: uploadedFile.fileName,
        status: uploadedFile.status,
        uploadedBy: uploadedFile.uploadedBy,
        fullName: uploadedFile.fullName,
        documentType: uploadedFile.documentType
      });

      // Revalidate both the admin requests page and the user's page
      revalidatePath('/admin/requests');
      revalidatePath('/inquiry');

      return NextResponse.json({ 
        message: 'File uploaded successfully',
        file: {
          id: uploadedFile.id,
          fileName: uploadedFile.fileName,
          status: uploadedFile.status
        }
      });

    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return NextResponse.json(
        { error: "Failed to save file to database" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Unhandled error during upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process upload' },
      { status: 500 }
    );
  }
} 