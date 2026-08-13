import express from "express";
import { createCaseStudy, getCaseStudies, getCaseStudy } from "../controllers/casestudy.controller.js";
import { upload } from "../middleware/multer.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .get(getCaseStudies)
  .post(protect, restrictTo("admin"), upload.single("coverImage"), createCaseStudy);

router.route("/:id")
  .get(getCaseStudy);

export default router;
