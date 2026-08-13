import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  phase: {
    type: String,
    enum: [
      "discovery",
      "design",
      "development",
      "testing",
      "review",
      "delivered",
      "maintenance",
      "archived",
    ],
    default: "discovery",
  },
  description: {
    type: String,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  files: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Project =
  mongoose.models.project || mongoose.model("project", projectSchema);

export default Project;
