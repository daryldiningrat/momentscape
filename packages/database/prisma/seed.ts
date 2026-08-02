import { PrismaClient, RSVPStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 12);

  const user = await prisma.user.create({
    data: {
      email: "demo@momentscape.test",
      name: "Demo User",
      password,
    },
  });

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      title: "Summer Wedding",
      description: "A beautiful beach wedding ceremony.",
      eventDate: new Date("2026-09-15T16:00:00Z"),
      location: "Bali, Indonesia",
    },
  });

  const template = await prisma.template.create({
    data: {
      userId: user.id,
      name: "Classic Invitation",
      content:
        "Dear {{name}}, you are invited to {{event}}. Please RSVP at {{link}}.",
    },
  });

  const invitation = await prisma.invitation.create({
    data: {
      projectId: project.id,
      templateId: template.id,
      message: "We would love to celebrate with you!",
      status: "sent",
      sentAt: new Date(),
    },
  });

  const guestsData = [
    {
      name: "Alice Smith",
      email: "alice@example.com",
      phone: "+1234567890",
      rsvpStatus: RSVPStatus.CONFIRMED,
    },
    {
      name: "Bob Jones",
      email: "bob@example.com",
      rsvpStatus: RSVPStatus.PENDING,
    },
    {
      name: "Carol White",
      email: "carol@example.com",
      rsvpStatus: RSVPStatus.DECLINED,
    },
  ];

  for (const guestData of guestsData) {
    const guest = await prisma.guest.create({
      data: {
        invitationId: invitation.id,
        name: guestData.name,
        email: guestData.email,
        phone: guestData.phone,
        personalizedLink: `https://momentscape.test/rsvp/${guestData.email.split("@")[0]}`,
        rsvpStatus: guestData.rsvpStatus,
        viewCount: 0,
      },
    });

    if (guestData.rsvpStatus === RSVPStatus.CONFIRMED) {
      await prisma.rsvp.create({
        data: {
          guestId: guest.id,
          status: RSVPStatus.CONFIRMED,
          dietaryRestrictions: "Vegetarian",
          plusOnes: 1,
          message: "Looking forward to it!",
        },
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
  .finally(async () => {
    await prisma.$disconnect();
  });
