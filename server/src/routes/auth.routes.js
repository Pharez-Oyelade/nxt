import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import { login, logout, me } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.get("/me", protect, me);
authRouter.post("/logout", protect, logout);

export default authRouter;
