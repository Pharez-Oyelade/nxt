import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import { env } from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";
import { StatusCodes } from "http-status-codes";

// login user
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
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
