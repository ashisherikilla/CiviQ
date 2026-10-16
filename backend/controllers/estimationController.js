
import mongoose from "mongoose";

import Project from "../models/Project.js";
import EstimationItem from "../models/EstimationItem.js";

import {
  calculateQuantity,
  calculateAmount,
} from "../utils/estimationCalculations.js";

const isValidId = (id) => mongoose.isValidObjectId(id);

const validUnits = ["m3", "m2", "m", "kg", "nos", "ls"];

const validCategories = [
  "Earthwork",
  "PCC",
  "RCC",
  "Reinforcement",
  "Brickwork",
  "Plastering",
  "Flooring",
  "Painting",
  "Doors & Windows",
  "Plumbing",
  "Electrical",
  "Miscellaneous",
];

const allowedFields = [
  "category",
  "description",
  "unit",
  "dimensions",
  "manualQuantity",
  "rate",
  // quantity and amount are intentionally excluded.
];

const dimensionFields = ["length", "width", "depth"];

const requiredDimensionsByUnit = {
  m3: ["length", "width", "depth"],
  m2: ["length", "width"],
  m: ["length"],
};

const sendError = (res, status, message) =>
  res.status(status).json({
    success: false,
    message,
  });

const handleError = (res, error) => {
  console.error("Estimation API error:", error);

  if (
    error.name === "ValidationError" ||
    error.name === "CastError" ||
    error instanceof RangeError
  ) {
    return sendError(res, 400, error.message);
  }

  if (error.message === "Unsupported estimation unit") {
    return sendError(res, 400, error.message);
  }

  return sendError(
    res,
    500,
    "An internal server error occurred"
  );
};

/**
 * Validate request shape, supported fields, and numeric inputs.
 * Derived quantity and amount must never come from the client.
 */
const validateBody = (body) => {
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return "Request body must be a JSON object";
  }

  if (
    body.quantity !== undefined ||
    body.amount !== undefined
  ) {
    return "Do not send quantity or amount; the server calculates them";
  }

  const unknownFields = Object.keys(body).filter(
    (field) => !allowedFields.includes(field)
  );

  if (unknownFields.length > 0) {
    return `Unsupported field(s): ${unknownFields.join(", ")}`;
  }

  if (
    body.dimensions !== undefined &&
    (
      body.dimensions === null ||
      typeof body.dimensions !== "object" ||
      Array.isArray(body.dimensions)
    )
  ) {
    return "Dimensions must be a JSON object";
  }

  if (body.dimensions !== undefined) {
    const unknownDimensions = Object.keys(
      body.dimensions
    ).filter(
      (field) => !dimensionFields.includes(field)
    );

    if (unknownDimensions.length > 0) {
      return `Unsupported dimension field(s): ${unknownDimensions.join(", ")}`;
    }
  }

  for (const field of dimensionFields) {
    const value = body.dimensions?.[field];

    if (value === undefined) continue;

    if (
      typeof value !== "number" ||
      !Number.isFinite(value)
    ) {
      return `${field} must be a finite number`;
    }

    if (value < 0) {
      return `${field} cannot be negative`;
    }
  }

  for (const field of ["manualQuantity", "rate"]) {
    const value = body[field];

    if (value === undefined) continue;

    if (
      typeof value !== "number" ||
      !Number.isFinite(value)
    ) {
      return `${field} must be a finite number`;
    }

    if (value < 0) {
      return `${field} cannot be negative`;
    }
  }

  return null;
};

/**
 * Validate the full effective item, including values retained
 * from an existing item during a partial update.
 */
const validateEstimationInputs = ({
  category,
  description,
  unit,
  dimensions = {},
  manualQuantity,
  rate,
}) => {
  if (
    typeof category !== "string" ||
    !validCategories.includes(category.trim())
  ) {
    return "Invalid work category";
  }

  if (
    typeof description !== "string" ||
    !description.trim()
  ) {
    return "Work item description is required";
  }

  if (description.trim().length > 500) {
    return "Description cannot exceed 500 characters";
  }

  if (!validUnits.includes(unit)) {
    return "Invalid estimation unit";
  }

  if (
    typeof rate !== "number" ||
    !Number.isFinite(rate) ||
    rate < 0
  ) {
    return "Rate must be a finite, non-negative number";
  }

  const requiredDimensions =
    requiredDimensionsByUnit[unit] ?? [];

  for (const field of requiredDimensions) {
    const value = dimensions[field];

    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value <= 0
    ) {
      return `${field} must be greater than zero for unit ${unit}`;
    }
  }

  if (["kg", "nos", "ls"].includes(unit)) {
    if (
      typeof manualQuantity !== "number" ||
      !Number.isFinite(manualQuantity) ||
      manualQuantity < 0
    ) {
      return `Manual quantity must be a finite, non-negative number for unit ${unit}`;
    }
  }

  return null;
};

/**
 * Calculate authoritative values on the server.
 */
const buildCalculatedValues = (input) => {
  const dimensions = {
    length: input.dimensions?.length ?? 0,
    width: input.dimensions?.width ?? 0,
    depth: input.dimensions?.depth ?? 0,
  };

  const manualQuantity = input.manualQuantity ?? 0;
  const rate = input.rate;

  const quantity = calculateQuantity({
    unit: input.unit,
    dimensions,
    manualQuantity,
  });

  const amount = calculateAmount(quantity, rate);

  if (
    !Number.isFinite(quantity) ||
    !Number.isFinite(amount)
  ) {
    throw new RangeError(
      "Calculated quantity or amount is outside the supported range"
    );
  }

  return {
    dimensions,
    manualQuantity,
    quantity,
    rate,
    amount,
  };
};

// GET /api/projects/:projectId/estimations
export const getEstimationsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!isValidId(projectId)) {
      return sendError(res, 400, "Invalid project ID");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return sendError(res, 404, "Project not found");
    }

    const items = await EstimationItem.find({
      projectId,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// POST /api/projects/:projectId/estimations
export const createEstimation = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!isValidId(projectId)) {
      return sendError(res, 400, "Invalid project ID");
    }

    const bodyError = validateBody(req.body);

    if (bodyError) {
      return sendError(res, 400, bodyError);
    }

    const {
      category,
      description,
      unit,
    } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return sendError(res, 404, "Project not found");
    }

    const inputError = validateEstimationInputs({
      ...req.body,
      category,
      description,
      unit,
    });

    if (inputError) {
      return sendError(res, 400, inputError);
    }

    const calculated = buildCalculatedValues(req.body);

    const item = await EstimationItem.create({
      projectId,
      category: category.trim(),
      description: description.trim(),
      unit,
      ...calculated,
    });

    return res.status(201).json({
      success: true,
      message: "Estimation item created successfully",
      data: item,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// PUT /api/estimations/:id
export const updateEstimation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return sendError(
        res,
        400,
        "Invalid estimation item ID"
      );
    }

    const bodyError = validateBody(req.body);

    if (bodyError) {
      return sendError(res, 400, bodyError);
    }

    const item = await EstimationItem.findById(id);

    if (!item) {
      return sendError(
        res,
        404,
        "Estimation item not found"
      );
    }

    const nextUnit = req.body.unit ?? item.unit;
    const nextCategory =
      req.body.category ?? item.category;
    const nextDescription =
      req.body.description ?? item.description;

    const nextDimensions = {
      length:
        req.body.dimensions?.length ??
        item.dimensions?.length ??
        0,
      width:
        req.body.dimensions?.width ??
        item.dimensions?.width ??
        0,
      depth:
        req.body.dimensions?.depth ??
        item.dimensions?.depth ??
        0,
    };

    const isManualUnit = ["kg", "nos", "ls"].includes(
      nextUnit
    );

    const isChangingToManualUnit =
      nextUnit !== item.unit && isManualUnit;

    if (
      isChangingToManualUnit &&
      req.body.manualQuantity === undefined
    ) {
      return sendError(
        res,
        400,
        "Provide manualQuantity when changing to a manual-quantity unit"
      );
    }

    const nextManualQuantity =
      req.body.manualQuantity ??
      item.manualQuantity ??
      0;

    const nextRate = req.body.rate ?? item.rate;

    const inputError = validateEstimationInputs({
      category: nextCategory,
      description: nextDescription,
      unit: nextUnit,
      dimensions: nextDimensions,
      manualQuantity: nextManualQuantity,
      rate: nextRate,
    });

    if (inputError) {
      return sendError(res, 400, inputError);
    }

    const calculated = buildCalculatedValues({
      unit: nextUnit,
      dimensions: nextDimensions,
      manualQuantity: nextManualQuantity,
      rate: nextRate,
    });

    item.category = nextCategory.trim();
    item.description = nextDescription.trim();
    item.unit = nextUnit;

    Object.assign(item, calculated);

    await item.save();

    return res.status(200).json({
      success: true,
      message: "Estimation item updated successfully",
      data: item,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// DELETE /api/estimations/:id
export const deleteEstimation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return sendError(
        res,
        400,
        "Invalid estimation item ID"
      );
    }

    const item = await EstimationItem.findByIdAndDelete(id);

    if (!item) {
      return sendError(
        res,
        404,
        "Estimation item not found"
      );
    }

    return res.status(200).json({
      success: true,
      message: "Estimation item deleted successfully",
    });
  } catch (error) {
    return handleError(res, error);
  }
};
