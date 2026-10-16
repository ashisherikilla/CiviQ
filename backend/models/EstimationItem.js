
import mongoose from "mongoose";

const { Schema } = mongoose;

const DIMENSION_FIELDS = {
  length: {
    type: Number,
    default: 0,
    min: [0, "Length cannot be negative"],
  },
  width: {
    type: Number,
    default: 0,
    min: [0, "Width cannot be negative"],
  },
  depth: {
    type: Number,
    default: 0,
    min: [0, "Depth cannot be negative"],
  },
};

const dimensionsSchema = new Schema(DIMENSION_FIELDS, {
  _id: false,
});

const estimationItemSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project reference is required"],
      index: true,
    },

    category: {
      type: String,
      required: [true, "Work category is required"],
      enum: [
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
      ],
    },

    description: {
      type: String,
      required: [true, "Work item description is required"],
      trim: true,
      maxlength: [
        500,
        "Description cannot exceed 500 characters",
      ],
    },

    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: ["m3", "m2", "m", "kg", "nos", "ls"],
    },

    dimensions: {
      type: dimensionsSchema,
      default: () => ({}),
    },

    manualQuantity: {
      type: Number,
      default: 0,
      min: [0, "Manual quantity cannot be negative"],
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Quantity cannot be negative"],
    },

    rate: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Rate cannot be negative"],
    },

    amount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Amount cannot be negative"],
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Optimize retrieval of a project's estimation items.
estimationItemSchema.index({
  projectId: 1,
  createdAt: 1,
});

const EstimationItem = mongoose.model(
  "EstimationItem",
  estimationItemSchema
);

export default EstimationItem;
