import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  getClients,
  getClient,
  createClient,
  updateClient,
} from "../controllers/client.controller.js";

const clientRouter = express.Router();

clientRouter
  .route("/")
  .get(protect, restrictTo("admin"), getClients)
  .post(protect, restrictTo("admin"), createClient);

clientRouter
  .route("/:id")
  .get(protect, restrictTo("admin"), getClient)
  .put(protect, restrictTo("admin"), updateClient);

export default clientRouter;
