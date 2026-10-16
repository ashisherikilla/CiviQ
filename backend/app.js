
import express from "express";
import cors from "cors";

import healthRoutes from "./routes/healthRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import estimationRoutes from "./routes/estimationRoutes.js";

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://civi-q-xi.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as Postman.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
  })
);


app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/projects", projectRoutes);

// Register estimation routes under /api
app.use("/api", estimationRoutes);

export default app;
