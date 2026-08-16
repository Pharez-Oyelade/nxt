import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  getLeads,
  getLead,
  createLead,
  createAdminLead,
  updateLeadStatus,
  updateLead,
} from "../controllers/lead.controller.js";

const leadRouter = express.Router();

leadRouter
  .route("/admin")
  .get(protect, restrictTo("admin"), getLeads)
  .post(protect, restrictTo("admin"), createAdminLead);

leadRouter.get("/:id", protect, restrictTo("admin"), getLead);

leadRouter.put(
  "/admin/:id/status",
  protect,
  restrictTo("admin"),
  updateLeadStatus
);

leadRouter.put(
  "/admin/:id",
  protect,
  restrictTo("admin"),
  updateLead
);

leadRouter.post("/", createLead);

export default leadRouter;
