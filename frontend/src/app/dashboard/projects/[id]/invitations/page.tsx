import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getProject } from "@/lib/projects";
import { getInvitations } from "@/lib/invitations";
import Link from "next/link";
import CreateInvitationButton from "./CreateInvitationButton";

export default async function ProjectInvitationsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const project = await getProject(params.id, session.user!.id);
  if (!project) {
    return <p style={{ color: "#aaa", padding: "2rem" }}>Project not found.</p>;
  }

  const invitationList = await getInvitations(params.id, session.user!.id);

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: 960, margin: "0 auto" }}>
      <Link href={`/dashboard/projects/${params.id}`} style={{ color: "#60a5fa", fontSize: "0.875rem", textDecoration: "none" }}>
        ← Back to Project
      </Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
        <h1>{project.title} — Invitations</h1>
        <CreateInvitationButton projectId={params.id} />
      </div>

      {invitationList.length === 0 ? (
        <div style={emptyStyle}>
          <p>No invitations yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" }}>
          {invitationList.map((inv) => (
            <Link
              key={inv.id}
              href={`/dashboard/invitations/${inv.id}`}
              style={itemStyle}
            >
              <div>
                <strong>{inv.name}</strong>
                <span style={{ color: "#888", marginLeft: "0.75rem", fontSize: "0.875rem" }}>
                  /{inv.slug}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={statusBadgeStyle(inv.status)}>{inv.status}</span>
                <span style={{ color: "#666", fontSize: "0.75rem" }}>v{inv.version}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function statusBadgeStyle(status: string): React.CSSProperties {
  const colors: Record<string, string> = {
    draft: "#6b7280",
    published: "#10b981",
    archived: "#f59e0b",
  };
  return {
    backgroundColor: colors[status] || "#6b7280",
    color: "#fff",
    padding: "0.125rem 0.5rem",
    borderRadius: 9999,
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "capitalize",
  };
}

const itemStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 1.25rem",
  backgroundColor: "#1a1a1a",
  border: "1px solid #333",
  borderRadius: 8,
  textDecoration: "none",
  color: "#fafafa",
};

const emptyStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "4rem 2rem",
  backgroundColor: "#1a1a1a",
  borderRadius: 8,
  border: "1px dashed #444",
  color: "#aaa",
};
