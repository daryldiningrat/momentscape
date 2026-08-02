import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health";
import { projectsRouter } from "./routes/projects";

const app = express();
const port = process.env.API_PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);
app.use("/api/projects", projectsRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Momentscape API" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend API running on http://0.0.0.0:${port}`);
});
