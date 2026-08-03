import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, guests } from "@momentscape/database";
import { eq, and, isNull, like, or, sql, count } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { invitationId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const search = url.searchParams.get("search") || "";
  const group = url.searchParams.get("group") || "";
  const status = url.searchParams.get("status") || "";
  const offset = (page - 1) * limit;

  const conditions = [
    eq(guests.invitationId, params.invitationId),
    isNull(guests.deletedAt),
  ];

  if (search) {
    conditions.push(
      or(like(guests.name, `%${search}%`), like(guests.email, `%${search}%`))
    );
  }

  if (group) conditions.push(eq(guests.guestGroup, group));
  if (status) conditions.push(eq(guests.rsvpStatus, status));

  const where = and(...conditions);

  const [totalResult] = await db.select({ count: count() }).from(guests).where(where);
  const total = totalResult?.count || 0;

  const rows = await db
    .select()
    .from(guests)
    .where(where)
    .orderBy(guests.createdAt)
    .limit(limit)
    .offset(offset);

  return NextResponse.json({ guests: rows, total, page, limit });
}

export async function POST(
  request: Request,
  { params }: { params: { invitationId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email, phone, guestGroup } = await request.json();
  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const code = Math.random().toString(36).substring(2, 10);

  const [guest] = await db
    .insert(guests)
    .values({
      invitationId: params.invitationId,
      name,
      email,
      phone: phone || null,
      guestGroup: guestGroup || "Family",
      personalizedLink: `${params.invitationId}-${code}`,
    })
    .returning();

  return NextResponse.json(guest, { status: 201 });
}
