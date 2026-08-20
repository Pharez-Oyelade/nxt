import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  updateTask,
  deleteTask,
  getAllTasks,
} from "../controllers/task.controller.js";

const taskRouter = express.Router();

taskRouter.use(protect);
taskRouter.use(restrictTo("admin"));

taskRouter.route("/").get(getAllTasks);

taskRouter
  .route("/:taskId")
  .put(updateTask)
  .delete(deleteTask);

export default taskRouter;
