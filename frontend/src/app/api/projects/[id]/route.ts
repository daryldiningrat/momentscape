import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, projects } from "@momentscape/database";
import { eq, and, isNull } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.id, params.id),
        eq(projects.userId, session.user.id),
        isNull(projects.deletedAt)
      )
    )
    .limit(1);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [existing] = await db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.id, params.id),
        eq(projects.userId, session.user.id),
        isNull(projects.deletedAt)
      )
    )
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const { title, description, type, eventDate, location } = await request.json();

  const [updated] = await db
    .update(projects)
    .set({
      title: title ?? existing.title,
      description: description !== undefined ? description : existing.description,
      type: type ?? existing.type,
      eventDate:
        eventDate !== undefined ? (eventDate ? new Date(eventDate) : null) : existing.eventDate,
      location: location !== undefined ? location : existing.location,
    })
    .where(eq(projects.id, params.id))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [existing] = await db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.id, params.id),
        eq(projects.userId, session.user.id),
        isNull(projects.deletedAt)
      )
    )
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  await db
    .update(projects)
    .set({ deletedAt: new Date() })
    .where(eq(projects.id, params.id));

  return NextResponse.json({ message: "Project deleted" });
}
