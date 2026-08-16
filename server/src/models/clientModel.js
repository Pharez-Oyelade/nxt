import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  billingEmail: {
    type: String,
    // unique: true,
    default: null,
  },
  industry: {
    type: String,
    default: null,
  },
  primaryContactName: {
    type: String,
  },
  projectType: {
    type: String,
    default: null,
  },
  budgetRange: {
    type: String,
    default: null,
  },
  notes: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    enum: ["prospect", "active", "past"],
    default: "prospect",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Client = mongoose.models.client || mongoose.model("client", clientSchema);

export default Client;
