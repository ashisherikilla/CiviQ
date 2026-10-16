
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [150, "Project name cannot exceed 150 characters"],
    },

    clientName: {
      type: String,
      trim: true,
      maxlength: [150, "Client name cannot exceed 150 characters"],
      default: "",
    },

    location: {
      type: String,
      trim: true,
      maxlength: [250, "Location cannot exceed 250 characters"],
      default: "",
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: ["Draft", "Planning", "In Progress", "Completed"],
        message: "Invalid project status",
      },
      default: "Draft",
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
