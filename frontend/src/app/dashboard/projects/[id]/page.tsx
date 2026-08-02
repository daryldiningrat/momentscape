import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getProject } from "@/lib/projects";
import EditProjectForm from "./EditProjectForm";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const project = await getProject(params.id, session.user!.id);
  if (!project) {
    return <p style={{ color: "#aaa" }}>Project not found.</p>;
  }

  return <EditProjectForm project={project} />;
}
