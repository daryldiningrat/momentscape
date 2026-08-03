import { db, invitations, guests } from "@momentscape/database";
import { eq, and } from "drizzle-orm";
import WeddingTemplate from "@/templates/Wedding";
import { buildWeddingTemplateData } from "@/templates/buildWeddingTemplateData";
import GuestRsvpForm from "./GuestRsvpForm";

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
      .where(
        and(eq(guests.invitationId, inv.id), eq(guests.name, rawName))
      )
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

  const weddingData = buildWeddingTemplateData(inv, guest?.name);

  return (
    <div>
      <WeddingTemplate data={weddingData} />
      <GuestRsvpForm
        invitationId={inv.id}
        guestId={guest?.id || undefined}
        guestName={guest?.name || rawName}
        guestEmail={guest?.email || undefined}
        rsvpQuestions={(inv.metadata as any)?.rsvpQuestions || []}
      />
    </div>
  );
}
