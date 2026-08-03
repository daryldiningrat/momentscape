import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, guests } from "@momentscape/database";
import { eq, and, isNull } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: { invitationId: string; guestId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, email, phone, guestGroup } = body;

  const [updated] = await db
    .update(guests)
    .set({
      name: name ?? undefined,
      email: email ?? undefined,
      phone,
      guestGroup,
    })
    .where(
      and(eq(guests.id, params.guestId), eq(guests.invitationId, params.invitationId), isNull(guests.deletedAt))
    )
    .returning();

  if (!updated) return NextResponse.json({ error: "Guest not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { invitationId: string; guestId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db
    .update(guests)
    .set({ deletedAt: new Date() })
    .where(
      and(eq(guests.id, params.guestId), eq(guests.invitationId, params.invitationId), isNull(guests.deletedAt))
    );

  return NextResponse.json({ message: "Guest deleted" });
}
