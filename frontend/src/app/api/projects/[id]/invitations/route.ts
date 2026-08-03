import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, invitations } from "@momentscape/database";
import { eq, and, isNull, sql } from "drizzle-orm";
import { validateInvitation, generateSlug } from "@momentscape/database";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db
    .select()
    .from(invitations)
    .where(
      and(
        eq(invitations.projectId, params.id),
        eq(invitations.userId, session.user.id),
        isNull(invitations.deletedAt)
      )
    )
    .orderBy(invitations.createdAt);

  return NextResponse.json(result);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = body.name || "Untitled Invitation";
  const slug = body.slug || generateSlug(name) + "-" + Date.now().toString(36);

  const validation = validateInvitation({ name, slug });
  if (!validation.valid) {
    return NextResponse.json({ error: validation.errors }, { status: 400 });
  }

  const [invitation] = await db
    .insert(invitations)
    .values({
      projectId: params.id,
      userId: session.user.id,
      name,
      slug,
      status: "draft",
      version: 1,
      sections: body.sections || [],
      design: body.design || {},
      message: body.message || null,
      templateId: body.templateId || null,
    })
    .returning();

  return NextResponse.json(invitation, { status: 201 });
}
