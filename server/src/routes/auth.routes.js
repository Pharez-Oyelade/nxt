import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import { login, logout, me, getAdmins, acceptInvite, updateSettings } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/invite/:token", acceptInvite);
authRouter.get("/me", protect, me);
authRouter.post("/logout", protect, logout);
authRouter.get("/admins", protect, restrictTo("admin"), getAdmins);
authRouter.patch("/settings", protect, updateSettings);

export default authRouter;
