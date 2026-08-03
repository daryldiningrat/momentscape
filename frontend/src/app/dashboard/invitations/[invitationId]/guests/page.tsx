import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getInvitation } from "@/lib/invitations";
import GuestManager from "@/components/GuestManager";

export default async function GuestsPage({
  params,
}: {
  params: { invitationId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const invitation = await getInvitation(params.invitationId, session.user!.id);
  if (!invitation) return <p style={{ color: "#aaa", padding: "2rem" }}>Invitation not found.</p>;

  return (
    <GuestManager
      invitationId={params.invitationId}
      invitationName={invitation.name}
      invitationSlug={invitation.slug}
      backHref={`/dashboard/projects/${invitation.projectId}/invitations`}
    />
  );
}
