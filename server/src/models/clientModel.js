import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  billingEmail: {
    type: String,
    unique: true,
  },
  industry: {
    type: String,
  },
  primaryContactName: {
    type: String,
  },
  notes: {
    type: String,
  },
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
