import { db, invitations } from "@momentscape/database";
import { eq } from "drizzle-orm";
import type { CmsData } from "@momentscape/database";

export default async function PreviewPage({
  params,
}: {
  params: { slug: string };
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

  const cms = (inv.cmsData as CmsData) || {};
  const event = cms.event || {} as any;
  const venue = cms.venue || {} as any;
  const host = cms.host || {} as any;

  return (
    <main style={{ minHeight: "100vh", fontFamily: "system-ui, sans-serif", backgroundColor: "#0a0a0a", color: "#fafafa" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "4rem 2rem", textAlign: "center" }}>
        {event.tagline && (
          <p style={{ fontSize: "0.875rem", color: "#aaa", letterSpacing: 2, textTransform: "uppercase" }}>
            {event.tagline}
          </p>
        )}
        <h1 style={{ fontSize: "2.5rem", marginTop: "0.5rem" }}>
          {event.title || inv.name}
        </h1>
        {event.eventName && (
          <p style={{ fontSize: "1.25rem", color: "#ccc", marginTop: "0.5rem" }}>{event.eventName}</p>
        )}

        {event.eventDate && (
          <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "#1a1a1a", borderRadius: 8 }}>
            <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>
              {new Date(event.eventDate + (event.eventTime ? "T" + event.eventTime : "")).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {event.eventTime && (
              <p style={{ color: "#aaa", marginTop: "0.25rem" }}>
                {event.eventTime} {event.timezone || ""}
              </p>
            )}
          </div>
        )}

        {venue.name && (
          <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "#1a1a1a", borderRadius: 8 }}>
            <h2 style={{ fontSize: "1.25rem" }}>Venue</h2>
            <p style={{ marginTop: "0.5rem", color: "#ccc" }}>{venue.name}</p>
            {venue.address && <p style={{ color: "#888", marginTop: "0.25rem" }}>{venue.address}</p>}
            {venue.note && <p style={{ color: "#666", marginTop: "0.5rem", fontStyle: "italic" }}>{venue.note}</p>}
          </div>
        )}

        {host.primaryName && (
          <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "#1a1a1a", borderRadius: 8 }}>
            <h2 style={{ fontSize: "1.25rem" }}>Hosted by</h2>
            <p style={{ marginTop: "0.5rem", color: "#ccc" }}>
              {host.primaryName}
              {host.partnerName && <> &amp; {host.partnerName}</>}
            </p>
          </div>
        )}

        {inv.message && (
          <p style={{ marginTop: "2rem", color: "#aaa", fontStyle: "italic" }}>{inv.message}</p>
        )}
      </div>
    </main>
  );
}
