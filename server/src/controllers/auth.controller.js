import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import { env } from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";
import { StatusCodes } from "http-status-codes";

// login user
export const login = asyncHandler(async (req, res, next) => {
  const { email, password, expectedRole } = req.body;

  // check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
  }

  // Enforce portal separation if expectedRole is provided
  if (expectedRole && user.role !== expectedRole) {
    throw new AppError("Invalid credentials for this portal", StatusCodes.UNAUTHORIZED);
  }

  if (!user.password) {
    throw new AppError(
      "Account not activated. Check your invite email",
      StatusCodes.UNAUTHORIZED,
    );
  }

  // check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
  }

  // generate token
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      clientId: user.clientId || null,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(StatusCodes.OK).json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      clientId: user.clientId || null,
      settings: user.settings || { currency: "NGN" },
    },
  });
});

// accept invite and set password
export const acceptInvite = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    throw new AppError("Password is required", StatusCodes.BAD_REQUEST);
  }

  // Hash the incoming raw token to compare with the DB
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    inviteToken: hashedToken,
    inviteTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Token is invalid or has expired", StatusCodes.BAD_REQUEST);
  }

  // Hash and set new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  
  // Clear invite token fields
  user.inviteToken = undefined;
  user.inviteTokenExpires = undefined;

  await user.save();

  // generate token
  const jwtToken = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      clientId: user.clientId || null,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );

  res.cookie("token", jwtToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(StatusCodes.OK).json({
    message: "Password set successfully. You are now logged in.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      clientId: user.clientId || null,
      settings: user.settings || { currency: "NGN" },
    },
  });
});

// logout user
export const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("token");
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Logout successful" });
});

// get current user
export const me = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json({ user });
});

// get all admin users for task assignment etc
export const getAdmins = asyncHandler(async (req, res, next) => {
  const admins = await User.find({ role: "admin" }).select("name email");
  res.json({ admins });
});

// update user settings
export const updateSettings = asyncHandler(async (req, res, next) => {
  const { currency } = req.body;

  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  if (currency && ["NGN", "USD"].includes(currency)) {
    user.settings = { ...user.settings, currency };
    await user.save();
  }

  res.json({ settings: user.settings, message: "Settings updated successfully" });
});
