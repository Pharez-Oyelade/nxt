import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dueDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["pending", "in progress", "completed"],
    default: "pending",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.models.task || mongoose.model("task", taskSchema);

export default Task;
