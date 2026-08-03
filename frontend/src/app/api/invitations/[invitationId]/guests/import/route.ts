import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, guests } from "@momentscape/database";
import { eq } from "drizzle-orm";

function generateLink(invitationId: string): string {
  return `${invitationId}-${Math.random().toString(36).substring(2, 10)}`;
}

export async function POST(
  request: Request,
  { params }: { params: { invitationId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rows } = await request.json();

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "No rows provided" }, { status: 400 });
  }

  const errors: { row: number; error: string }[] = [];
  const inserted: { name: string; email: string }[] = [];
  let imported = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1;

    if (!row.name || !row.email) {
      errors.push({ row: rowNum, error: "Name and email are required" });
      continue;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push({ row: rowNum, error: `Invalid email: ${row.email}` });
      continue;
    }

    const existing = await db
      .select({ id: guests.id })
      .from(guests)
      .where(eq(guests.email, row.email))
      .limit(1);

    if (existing.length > 0) {
      errors.push({ row: rowNum, error: `Duplicate email: ${row.email}` });
      continue;
    }

    try {
      await db.insert(guests).values({
        invitationId: params.invitationId,
        name: row.name.trim(),
        email: row.email.trim(),
        phone: row.phone?.trim() || null,
        guestGroup: row.guestGroup?.trim() || "Family",
        personalizedLink: generateLink(params.invitationId),
      });

      inserted.push({ name: row.name, email: row.email });
      imported++;
    } catch (err) {
      errors.push({ row: rowNum, error: "Database error" });
    }
  }

  return NextResponse.json({ imported, errors, inserted });
}
