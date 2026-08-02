import { db, projects } from "@momentscape/database";
import { eq, and, isNull } from "drizzle-orm";

export type Project = typeof projects.$inferSelect;

export async function getProjects(userId: string) {
  return db
    .select()
    .from(projects)
    .where(and(eq(projects.userId, userId), isNull(projects.deletedAt)))
    .orderBy(projects.createdAt);
}

export async function getProject(id: string, userId: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId), isNull(projects.deletedAt)))
    .limit(1);
  return project ?? null;
}

export async function updateProject(id: string, data: Partial<typeof projects.$inferInsert>) {
  const [project] = await db
    .update(projects)
    .set(data)
    .where(eq(projects.id, id))
    .returning();
  return project;
}

export async function deleteProject(id: string) {
  await db
    .update(projects)
    .set({ deletedAt: new Date() })
    .where(eq(projects.id, id));
}
