import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, invitations } from "@momentscape/database";
import { eq, and, isNull } from "drizzle-orm";
import { validateInvitation, generateSlug } from "@momentscape/database";

export async function GET(
  _request: Request,
  { params }: { params: { invitationId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [invitation] = await db
    .select()
    .from(invitations)
    .where(
      and(
        eq(invitations.id, params.invitationId),
        eq(invitations.userId, session.user.id),
        isNull(invitations.deletedAt)
      )
    )
    .limit(1);

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  return NextResponse.json(invitation);
}

export async function PUT(
  request: Request,
  { params }: { params: { invitationId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [existing] = await db
    .select()
    .from(invitations)
    .where(
      and(
        eq(invitations.id, params.invitationId),
        eq(invitations.userId, session.user.id),
        isNull(invitations.deletedAt)
      )
    )
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  const body = await request.json();

  if (body.slug && body.slug !== existing.slug) {
    const validation = validateInvitation({ slug: body.slug });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors }, { status: 400 });
    }
  }

  if (body.sections) {
    const validation = validateInvitation({ sections: body.sections });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors }, { status: 400 });
    }
  }

  const newVersion = existing.version + 1;

  const [updated] = await db
    .update(invitations)
    .set({
      name: body.name ?? existing.name,
      slug: body.slug ?? existing.slug,
      message: body.message !== undefined ? body.message : existing.message,
      status: body.status ?? existing.status,
      version: newVersion,
      sections: body.sections ?? existing.sections,
      design: body.design ?? existing.design,
      cmsData: body.cmsData ?? existing.cmsData,
    })
    .where(eq(invitations.id, params.invitationId))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { invitationId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [existing] = await db
    .select()
    .from(invitations)
    .where(
      and(
        eq(invitations.id, params.invitationId),
        eq(invitations.userId, session.user.id),
        isNull(invitations.deletedAt)
      )
    )
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  await db
    .update(invitations)
    .set({ deletedAt: new Date() })
    .where(eq(invitations.id, params.invitationId));

  return NextResponse.json({ message: "Invitation deleted" });
}
