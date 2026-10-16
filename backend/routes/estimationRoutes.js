import express from "express";

import {
  getEstimationsByProject,
  createEstimation,
  updateEstimation,
  deleteEstimation,
} from "../controllers/estimationController.js";

const router = express.Router();

// Project-specific estimation operations
router.get("/projects/:projectId/estimations", getEstimationsByProject);

router.post("/projects/:projectId/estimations", createEstimation);

// Individual estimation item operations
router.put("/estimations/:id", updateEstimation);
router.delete("/estimations/:id", deleteEstimation);

export default router;
