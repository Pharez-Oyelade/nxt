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
    default: null,
  },
  projectType: {
    type: String,
    default: null,
  },
  budgetRange: {
    type: String,
    default: null,
  },
  messages: [
    {
      type: String,
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ["new", "contacted", "qualified", "lost"],
    default: "new",
  },
  archived: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lead = mongoose.models.lead || mongoose.model("lead", leadSchema);

export default Lead;
