import { Router } from "express";
import rateLimit from "express-rate-limit";
import { protect, restrictTo } from "../middleware/auth.js";
import { login, logout, me, getAdmins, acceptInvite, updateSettings, updateProfile, updatePassword } from "../controllers/auth.controller.js";

const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { message: "Too many login attempts, please try again after 15 minutes" },
});

authRouter.post("/login", loginLimiter, login);
authRouter.post("/invite/:token", loginLimiter, acceptInvite);
authRouter.get("/me", protect, me);
authRouter.post("/logout", logout); // No auth required — must always clear the cookie
authRouter.get("/admins", protect, restrictTo("admin"), getAdmins);
authRouter.patch("/settings", protect, updateSettings);
authRouter.patch("/profile", protect, updateProfile);
authRouter.patch("/password", protect, updatePassword);

export default authRouter;
