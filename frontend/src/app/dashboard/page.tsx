import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getProjects } from "@/lib/projects";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const projects = await getProjects(session.user!.id);

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem" }}>My Projects</h1>

      {projects.length === 0 ? (
        <div style={emptyStyle}>
          <p>No projects yet.</p>
          <Link href="/dashboard/new" style={{ color: "#60a5fa", marginTop: "0.5rem", display: "inline-block" }}>
            Create your first project
          </Link>
        </div>
      ) : (
        <div style={gridStyle}>
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              style={cardStyle}
            >
              <span style={badgeStyle(project.type)}>{project.type}</span>
              <h3 style={{ margin: "0.5rem 0" }}>{project.title}</h3>
              {project.eventDate && (
                <p style={{ color: "#aaa", fontSize: "0.875rem" }}>
                  {new Date(project.eventDate).toLocaleDateString()}
                </p>
              )}
              {project.location && (
                <p style={{ color: "#888", fontSize: "0.875rem" }}>{project.location}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function badgeStyle(type: string): React.CSSProperties {
  const colors: Record<string, string> = {
    wedding: "#f59e0b",
    birthday: "#ec4899",
    corporate: "#3b82f6",
  };
  return {
    backgroundColor: colors[type] || "#6b7280",
    color: "#fff",
    padding: "0.125rem 0.5rem",
    borderRadius: 9999,
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "capitalize",
  };
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "1rem",
};

const cardStyle: React.CSSProperties = {
  display: "block",
  padding: "1.25rem",
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
