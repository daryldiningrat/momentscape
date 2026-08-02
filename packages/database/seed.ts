import * as bcrypt from "bcryptjs";
import { db } from "./src/db";
import { users, projects, templates, invitations, guests, rsvps } from "./src/schema";

async function main() {
  const password = await bcrypt.hash("password123", 12);

  const [user] = await db
    .insert(users)
    .values({
      email: "demo@momentscape.test",
      name: "Demo User",
      password,
    })
    .returning();

  const [project] = await db
    .insert(projects)
    .values({
      userId: user.id,
      title: "Summer Wedding",
      description: "A beautiful beach wedding ceremony.",
      eventDate: new Date("2026-09-15T16:00:00Z"),
      location: "Bali, Indonesia",
    })
    .returning();

  const [template] = await db
    .insert(templates)
    .values({
      userId: user.id,
      name: "Classic Invitation",
      content:
        "Dear {{name}}, you are invited to {{event}}. Please RSVP at {{link}}.",
    })
    .returning();

  const [invitation] = await db
    .insert(invitations)
    .values({
      projectId: project.id,
      templateId: template.id,
      message: "We would love to celebrate with you!",
      status: "sent",
      sentAt: new Date(),
    })
    .returning();

  const guestsData = [
    {
      name: "Alice Smith",
      email: "alice@example.com",
      phone: "+1234567890",
      rsvpStatus: "CONFIRMED" as const,
    },
    {
      name: "Bob Jones",
      email: "bob@example.com",
      rsvpStatus: "PENDING" as const,
    },
    {
      name: "Carol White",
      email: "carol@example.com",
      rsvpStatus: "DECLINED" as const,
    },
  ];

  for (const guestData of guestsData) {
    const [guest] = await db
      .insert(guests)
      .values({
        invitationId: invitation.id,
        name: guestData.name,
        email: guestData.email,
        phone: guestData.phone,
        personalizedLink: `https://momentscape.test/rsvp/${guestData.email.split("@")[0]}`,
        rsvpStatus: guestData.rsvpStatus,
        viewCount: 0,
      })
      .returning();

    if (guestData.rsvpStatus === "CONFIRMED") {
      await db.insert(rsvps).values({
        guestId: guest.id,
        status: "CONFIRMED",
        dietaryRestrictions: "Vegetarian",
        plusOnes: 1,
        message: "Looking forward to it!",
      });
    }
  }

  console.log("Seed data created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
