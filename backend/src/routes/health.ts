import { Router } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  let dbStatus = "unknown";
  try {
    await db.execute(sql`SELECT 1`);
    dbStatus = "connected";
  } catch {
    dbStatus = "disconnected";
  }

  res.json({
    status: "ok",
    service: "momentscape-backend",
    database: dbStatus,
  });
});

export { router as healthRouter };
