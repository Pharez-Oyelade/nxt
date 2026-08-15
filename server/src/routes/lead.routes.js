import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  getLeads,
  getLead,
  createLead,
  createAdminLead,
} from "../controllers/lead.controller.js";

const leadRouter = express.Router();

leadRouter
  .route("/admin")
  .get(protect, restrictTo("admin"), getLeads)
  .post(protect, restrictTo("admin"), createAdminLead);

leadRouter.get("/:id", protect, restrictTo("admin"), getLead);

leadRouter.post("/", createLead);

export default leadRouter;
