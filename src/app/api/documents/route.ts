import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { fileUploads } from "~/server/db/schema";
import { desc, and, eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    console.log('Fetching documents for user:', userId); // Debug log
    
    const documents = await db
      .select()
      .from(fileUploads)
      .where(
        and(
          eq(fileUploads.requestType, 'document'),
          eq(fileUploads.status, 'approved')
        )
      )
      .orderBy(desc(fileUploads.createdAt));

    console.log('Found documents:', documents); // Debug log

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 