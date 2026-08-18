import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  getAdminDashboardSummary,
  getClientDashboardSummary,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.use(protect);

router.get("/admin", restrictTo("admin"), getAdminDashboardSummary);
router.get("/client", restrictTo("client"), getClientDashboardSummary);

export default router;
