import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import { login, logout, me, getAdmins, acceptInvite } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/invite/:token", acceptInvite);
authRouter.get("/me", protect, me);
authRouter.post("/logout", protect, logout);
authRouter.get("/admins", protect, restrictTo("admin"), getAdmins);

export default authRouter;
