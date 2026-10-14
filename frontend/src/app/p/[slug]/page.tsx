import type { Metadata } from "next";
import { db, invitations, guests, rsvps } from "@momentscape/database";
import { eq, and, isNull, desc } from "drizzle-orm";
import TemplateRenderer from "@/components/TemplateRenderer";
import type { CmsData } from "@momentscape/database";
import GuestRsvpForm from "./GuestRsvpForm";
import WishesFeed from "./WishesFeed";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const [inv] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.slug, params.slug))
    .limit(1);

  if (!inv) return { title: "Invitation" };

  const cms = (inv.cmsData as CmsData) || {};
  const wedding = (cms as any).wedding || {};
  const event = (cms as any).event || {};

  const couple =
    wedding.bride?.nickname && wedding.groom?.nickname
      ? `${wedding.bride.nickname} & ${wedding.groom.nickname}`
      : event.eventName || inv.name;

  const title = `The Wedding of ${couple}`;
  const description = wedding.akad?.date
    ? `${new Date(wedding.akad.date).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })} — ${wedding.akad.venue || ""}`
    : inv.message || "You're invited!";

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function PublicInvitationPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { to?: string };
}) {
  const [inv] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.slug, params.slug))
    .limit(1);

  if (!inv) {
    return (
      <main style={{ padding: "4rem", textAlign: "center", fontFamily: "system-ui" }}>
        <h1>Invitation Not Found</h1>
      </main>
    );
  }

  const rawName = searchParams?.to ? decodeURIComponent(searchParams.to) : undefined;
  let guest = null;

  if (rawName) {
    const [found] = await db
      .select()
      .from(guests)
      .where(and(eq(guests.invitationId, inv.id), eq(guests.name, rawName)))
      .limit(1);
    guest = found ?? null;

    if (guest) {
      await db
        .update(guests)
        .set({
          viewCount: (guest.viewCount || 0) + 1,
          lastViewedAt: new Date(),
        })
        .where(eq(guests.id, guest.id));
    }
  }

  const guestName = guest?.name || rawName;

  const wishes = await db
    .select({
      id: rsvps.id,
      name: guests.name,
      status: rsvps.status,
      message: rsvps.message,
      createdAt: rsvps.createdAt,
    })
    .from(rsvps)
    .innerJoin(guests, eq(rsvps.guestId, guests.id))
    .where(and(eq(guests.invitationId, inv.id), isNull(rsvps.deletedAt)))
    .orderBy(desc(rsvps.createdAt));

  return (
    <div>
      <TemplateRenderer
        invitation={inv}
        templateId={(inv.design as any)?.templateId}
        guestName={guestName}
        guest={
          guest
            ? {
                session: guest.session,
                guestLimit: guest.guestLimit,
                personalizedLink: guest.personalizedLink,
              }
            : undefined
        }
      />
      <GuestRsvpForm
        invitationId={inv.id}
        guestId={guest?.id || undefined}
        guestName={guestName}
        guestEmail={guest?.email || undefined}
        rsvpQuestions={(inv.metadata as any)?.rsvpQuestions || []}
      />
      <WishesFeed wishes={wishes} />
    </div>
  );
}
