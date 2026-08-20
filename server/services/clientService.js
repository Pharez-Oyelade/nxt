import User from "../src/models/userModel.js";
import Client from "../src/models/clientModel.js";
import { AppError } from "../src/middleware/errorHandler.js";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import { sendInviteEmail } from "./emailService.js";

export async function createClientAndInviteUser({
  companyName,
  contactName,
  email,
  billingEmail,
  industry,
  notes,
}) {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", StatusCodes.BAD_REQUEST);
  }

  const client = await Client.create({
    companyName,
    email,
    industry,
    primaryContactName: contactName,
    billingEmail: billingEmail || email,
    notes,
    status: "active",
  });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const user = await User.create({
    name: contactName,
    email,
    role: "client",
    clientId: client._id,
    inviteToken: crypto.createHash("sha256").update(rawToken).digest("hex"),
    inviteTokenExpires: Date.now() + 1000 * 60 * 60 * 24,
  });

  let emailSent = true;
  try {
    await sendInviteEmail({ to: email, token: rawToken });
  } catch (error) {
    console.error(error);
    emailSent = false;
  }

  return { client, user, emailSent };
}
