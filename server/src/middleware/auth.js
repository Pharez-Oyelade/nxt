import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "./errorHandler.js";
import { StatusCodes } from "http-status-codes";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) throw new AppError("Not authorized", StatusCodes.UNAUTHORIZED);

  const decoded = jwt.verify(token, env.JWT_SECRET);
  req.user = decoded;
  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError("Access denied", StatusCodes.FORBIDDEN);
    }
    next();
  };

// scope client id
// export const scopeClientId = asyncHandler(async (req, res, next) => {

// })
