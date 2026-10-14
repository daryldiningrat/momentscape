import { NextResponse } from "next/server";
import { db, guests, rsvps } from "@momentscape/database";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  const body = await request.json();
  const { invitationId, guestId, name, email, attending, answers, message } = body || {};

  if (!invitationId || typeof attending !== "boolean") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const status = attending ? "CONFIRMED" : "DECLINED";
    let guest: { id: string } | undefined;

    if (guestId) {
      const [found] = await db
        .select({ id: guests.id })
        .from(guests)
        .where(and(eq(guests.id, guestId), eq(guests.invitationId, invitationId)))
        .limit(1);
      guest = found;
    } else if (name && email) {
      const [existing] = await db
        .select({ id: guests.id })
        .from(guests)
        .where(and(eq(guests.invitationId, invitationId), eq(guests.email, email)))
        .limit(1);

      if (existing) {
        guest = existing;
      } else {
        const code = Math.random().toString(36).substring(2, 10);
        const [created] = await db
          .insert(guests)
          .values({
            invitationId,
            name,
            email,
            personalizedLink: `${invitationId}-${code}`,
          })
          .returning({ id: guests.id });
        guest = created;
      }
    }

    if (!guest) {
      return NextResponse.json({ error: "Guest is required" }, { status: 400 });
    }

    await db
      .update(guests)
      .set({ rsvpStatus: status })
      .where(eq(guests.id, guest.id));

    const [existingRsvp] = await db
      .select({ id: rsvps.id })
      .from(rsvps)
      .where(eq(rsvps.guestId, guest.id))
      .limit(1);

    if (existingRsvp) {
      await db
        .update(rsvps)
        .set({
          status,
          answers: answers ?? {},
          message: message || null,
          updatedAt: new Date(),
        })
        .where(eq(rsvps.id, existingRsvp.id));
    } else {
      await db.insert(rsvps).values({
        guestId: guest.id,
        status,
        answers: answers ?? {},
        message: message || null,
      });
    }

    return NextResponse.json({ message: "RSVP recorded" });
  } catch (err) {
    console.error("RSVP error:", err);
    return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
  }
}
