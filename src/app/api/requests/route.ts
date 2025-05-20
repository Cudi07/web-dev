import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { fileUploads } from "~/server/db/schema";
import { desc, eq, or } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all requests (document or contact) ordered by most recent first
    const requests = await db.select()
      .from(fileUploads)
      .where(
        or(
          eq(fileUploads.requestType, 'request'),
          eq(fileUploads.requestType, 'contact')
        )
      )
      .orderBy(desc(fileUploads.createdAt));

    // Transform dates to ISO strings for JSON serialization
    const serializedRequests = requests.map(request => ({
      ...request,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString(),
    }));

    return NextResponse.json({ requests: serializedRequests });

  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle approve/reject actions
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, status } = await req.json();

    if (!id || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const result = await db.update(fileUploads)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(fileUploads.id, id))
      .returning();

    const updatedRequest = result[0];
    if (!updatedRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Transform dates for JSON serialization
    const serializedRequest = {
      ...updatedRequest,
      createdAt: updatedRequest.createdAt.toISOString(),
      updatedAt: updatedRequest.updatedAt.toISOString(),
    };

    return NextResponse.json({ 
      message: `Request ${status} successfully`,
      request: serializedRequest
    });

  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 