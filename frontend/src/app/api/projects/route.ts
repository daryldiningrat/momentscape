import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, projects } from "@momentscape/database";
import { eq, and, isNull } from "drizzle-orm";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db
    .select()
    .from(projects)
    .where(and(eq(projects.userId, session.user.id), isNull(projects.deletedAt)))
    .orderBy(projects.createdAt);

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, type, eventDate, location } = await request.json();

  if (!title || !type) {
    return NextResponse.json({ error: "Title and type are required" }, { status: 400 });
  }

  const [project] = await db
    .insert(projects)
    .values({
      userId: session.user.id,
      title,
      description: description || null,
      type,
      eventDate: eventDate ? new Date(eventDate) : null,
      location: location || null,
    })
    .returning();

  return NextResponse.json(project, { status: 201 });
}
