
import mongoose from "mongoose";
import Project from "../models/Project.js";
import EstimationItem from "../models/EstimationItem.js";

const isValidId = (id) => mongoose.isValidObjectId(id);

const handleError = (res, error) => {
  console.error("Project API error:", error);

  const status =
    error.name === "ValidationError" ||
    error.name === "CastError"
      ? 400
      : 500;

  return res.status(status).json({
    success: false,
    message:
      status === 400
        ? error.message
        : "An internal server error occurred",
  });
};

// GET /api/projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// GET /api/projects/:id
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { name, clientName, location, description, status } = req.body;

    const project = await Project.create({
      name,
      clientName,
      location,
      description,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    // Only allow fields defined for project updates.
    const allowedFields = [
      "name",
      "clientName",
      "location",
      "description",
      "status",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid project ID",
    });
  }

  let session;

  try {
    session = await mongoose.startSession();

    let deletedProject = null;

    // Delete the project and its estimation items atomically.
    await session.withTransaction(async () => {
      const project = await Project.findById(id).session(session);

      if (!project) {
        return;
      }

      await EstimationItem.deleteMany({ projectId: id }).session(session);

      await Project.deleteOne({ _id: id }).session(session);

      deletedProject = project;
    });

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project and associated estimation items deleted",
    });
  } catch (error) {
    return handleError(res, error);
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};
