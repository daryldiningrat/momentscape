import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getInvitation } from "@/lib/invitations";
import InvitationEditor from "./InvitationEditor";

export default async function InvitationPage({
  params,
}: {
  params: { invitationId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const invitation = await getInvitation(params.invitationId, session.user!.id);
  if (!invitation) {
    return <p style={{ color: "#aaa", padding: "2rem" }}>Invitation not found.</p>;
  }

  return <InvitationEditor invitation={invitation} />;
}
