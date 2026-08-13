import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  company: {
    type: String,
  },
  projectType: {
    type: String,
  },
  budgetRange: {
    type: String,
  },
  message: {
    type: String,
  },
  status: {
    type: String,
    enum: ["new", "contacted", "qualified", "lost"],
    default: "new",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lead = mongoose.models.lead || mongoose.model("lead", leadSchema);

export default Lead;
