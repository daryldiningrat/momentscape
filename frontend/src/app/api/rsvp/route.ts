import { NextResponse } from "next/server";
import { db, guests } from "@momentscape/database";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  const { invitationId, guestId, name, email, attending, answers } = await request.json();

  if (!invitationId || !attending === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    if (guestId) {
      await db
        .update(guests)
        .set({
          rsvpStatus: attending ? "CONFIRMED" : "DECLINED",
        })
        .where(eq(guests.id, guestId));
    } else if (name && email) {
      const [existing] = await db
        .select()
        .from(guests)
        .where(and(eq(guests.invitationId, invitationId), eq(guests.email, email)))
        .limit(1);

      if (existing) {
        await db
          .update(guests)
          .set({ rsvpStatus: attending ? "CONFIRMED" : "DECLINED" })
          .where(eq(guests.id, existing.id));
      }
    }

    return NextResponse.json({ message: "RSVP recorded" });
  } catch (err) {
    console.error("RSVP error:", err);
    return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
  }
}
