import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { announcements } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db.select().from(announcements).orderBy(desc(announcements.date));
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { title, description, date, link } = data;
    console.log("Received announcement POST:", data);
    if (!title || !description || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date received:", date);
      return NextResponse.json({ error: "Invalid date format. Please use YYYY-MM-DD." }, { status: 400 });
    }
    const result = await db.insert(announcements).values({
      title,
      description,
      date: parsedDate,
      link: link || null,
    }).returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await db.delete(announcements).where(eq(announcements.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
} 