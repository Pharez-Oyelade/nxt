import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoice,
  getClientInvoices,
  sendInvoice,
} from "../controllers/invoice.controller.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// Admin routes
router.post("/", protect, restrictTo("admin"), createInvoice);
router.get("/admin", protect, restrictTo("admin"), getInvoices);
router.post("/:id/send", protect, restrictTo("admin"), sendInvoice);

// Client routes
router.get("/client", protect, restrictTo("client"), getClientInvoices);

// Shared route
router.get("/:id", protect, getInvoice);

export default router;
