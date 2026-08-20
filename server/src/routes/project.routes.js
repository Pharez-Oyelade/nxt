import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProjectPhase,
  updateProject,
  addFile,
  getClientProjects,
  getClientProject,
  proposeProject,
} from "../controllers/project.controller.js";
import {
  createTask,
  getProjectTasks,
} from "../controllers/task.controller.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const projectRouter = express.Router();

projectRouter
  .route("/")
  .get(protect, restrictTo("admin"), getProjects)
  .post(protect, restrictTo("admin"), createProject);

projectRouter.post("/propose", protect, restrictTo("client"), proposeProject);

projectRouter.get("/client", protect, restrictTo("client"), getClientProjects);
projectRouter.get(
  "/client/:id",
  protect,
  restrictTo("client"),
  getClientProject,
);

projectRouter
  .route("/:id")
  .get(protect, restrictTo("admin"), getProject)
  .put(protect, restrictTo("admin"), updateProject);

projectRouter.put(
  "/:id/phase",
  protect,
  restrictTo("admin"),
  updateProjectPhase,
);

projectRouter.post(
  "/:id/files",
  protect,
  restrictTo("admin"),
  upload.single("file"),
  addFile,
);

// Project Task routes
projectRouter
  .route("/:id/tasks")
  .get(protect, getProjectTasks)
  .post(protect, restrictTo("admin"), createTask);

export default projectRouter;
