import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { fileUploads } from "~/server/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Fetch the latest activities (uploads and requests)
    const activities = await db
      .select({
        id: fileUploads.id,
        type: fileUploads.requestType,
        documentType: fileUploads.documentType,
        purpose: fileUploads.purpose,
        status: fileUploads.status,
        createdAt: fileUploads.createdAt,
        fullName: fileUploads.fullName,
      })
      .from(fileUploads)
      .orderBy(desc(fileUploads.createdAt))
      .limit(5);

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 