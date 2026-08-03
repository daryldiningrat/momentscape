import { db, invitations } from "@momentscape/database";
import { eq } from "drizzle-orm";
import TemplateRenderer from "@/components/TemplateRenderer";

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { to?: string; guestName?: string };
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

  const guestName = searchParams?.to || searchParams?.guestName || undefined;

  return (
    <TemplateRenderer
      invitation={inv}
      templateId={(inv.design as any)?.templateId}
      guestName={guestName ? decodeURIComponent(guestName) : undefined}
    />
  );
}
