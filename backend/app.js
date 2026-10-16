
import express from "express";
import cors from "cors";

import healthRoutes from "./routes/healthRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import estimationRoutes from "./routes/estimationRoutes.js";

const app = express();

app.use(
  cors({
    origin: "https://civi-q-xi.vercel.app/",
  })
);

app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/projects", projectRoutes);

// Register estimation routes under /api
app.use("/api", estimationRoutes);

export default app;
