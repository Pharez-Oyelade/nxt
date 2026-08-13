import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    default: null,
  },
  inviteToken: { type: String, default: null },
  inviteTokenExpires: { type: Date, default: null },
  role: {
    type: String,
    enum: ["client", "admin"],
    default: "client",
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;
