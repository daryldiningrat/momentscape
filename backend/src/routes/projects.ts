import { Router } from "express";
import { db } from "../db";
import { projects } from "@momentscape/database";
import { eq, and, isNull } from "drizzle-orm";
import { getServerSession } from "../middleware/auth";

const router = Router();

function requireAuth(req: Parameters<Parameters<typeof router.get>[1]>[0], res: Parameters<Parameters<typeof router.get>[1]>[1], next: () => void) {
  const session = (req as any).session;
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

function sessionMiddleware(req: any, _res: any, next: () => void) {
  req.session = { user: { id: "session-from-header" } };
  next();
}

router.use((req, _res, next) => {
  const userId = req.headers["x-user-id"] as string;
  if (userId) {
    (req as any).session = { user: { id: userId } };
  }
  next();
});

router.get("/", async (req, res) => {
  const userId = (req as any).session?.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const result = await db
    .select()
    .from(projects)
    .where(and(eq(projects.userId, userId), isNull(projects.deletedAt)))
    .orderBy(projects.createdAt);

  res.json(result);
});

router.get("/:id", async (req, res) => {
  const userId = (req as any).session?.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, req.params.id), eq(projects.userId, userId), isNull(projects.deletedAt)))
    .limit(1);

  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

router.post("/", async (req, res) => {
  const userId = (req as any).session?.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { title, description, type, eventDate, location } = req.body;

  if (!title || !type) {
    return res.status(400).json({ error: "Title and type are required" });
  }

  const [project] = await db
    .insert(projects)
    .values({
      userId,
      title,
      description: description || null,
      type,
      eventDate: eventDate ? new Date(eventDate) : null,
      location: location || null,
    })
    .returning();

  res.status(201).json(project);
});

router.put("/:id", async (req, res) => {
  const userId = (req as any).session?.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const [existing] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, req.params.id), eq(projects.userId, userId), isNull(projects.deletedAt)))
    .limit(1);

  if (!existing) return res.status(404).json({ error: "Project not found" });

  const { title, description, type, eventDate, location } = req.body;

  const [updated] = await db
    .update(projects)
    .set({
      title: title ?? existing.title,
      description: description !== undefined ? description : existing.description,
      type: type ?? existing.type,
      eventDate: eventDate !== undefined ? (eventDate ? new Date(eventDate) : null) : existing.eventDate,
      location: location !== undefined ? location : existing.location,
    })
    .where(eq(projects.id, req.params.id))
    .returning();

  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const userId = (req as any).session?.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const [existing] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, req.params.id), eq(projects.userId, userId), isNull(projects.deletedAt)))
    .limit(1);

  if (!existing) return res.status(404).json({ error: "Project not found" });

  await db
    .update(projects)
    .set({ deletedAt: new Date() })
    .where(eq(projects.id, req.params.id));

  res.json({ message: "Project deleted" });
});

export { router as projectsRouter };
