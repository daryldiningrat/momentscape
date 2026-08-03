import "server-only";
import { db, invitations } from "@momentscape/database";
import { eq, and, isNull, sql } from "drizzle-orm";

export type Invitation = typeof invitations.$inferSelect;

export async function getInvitations(projectId: string, userId: string) {
  return db
    .select()
    .from(invitations)
    .where(
      and(
        eq(invitations.projectId, projectId),
        eq(invitations.userId, userId),
        isNull(invitations.deletedAt)
      )
    )
    .orderBy(invitations.createdAt);
}

export async function getInvitation(id: string, userId: string) {
  const [invitation] = await db
    .select()
    .from(invitations)
    .where(
      and(
        eq(invitations.id, id),
        eq(invitations.userId, userId),
        isNull(invitations.deletedAt)
      )
    )
    .limit(1);
  return invitation ?? null;
}
