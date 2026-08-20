import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  createBlogPost,
  getBlogPosts,
  getBlogPost,
  getPublishedPosts,
  getPublishedPost,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/blog.controller.js";
import { upload } from "../middleware/multer.js";

const blogRouter = express.Router();

// admin routes
blogRouter
  .route("/admin")
  .get(protect, restrictTo("admin"), getBlogPosts)
  .post(
    protect,
    restrictTo("admin"),
    upload.single("coverImage"),
    createBlogPost,
  );

blogRouter
  .route("/admin/:id")
  .get(protect, restrictTo("admin"), getBlogPost)
  .put(
    protect,
    restrictTo("admin"),
    upload.single("coverImage"),
    updateBlogPost,
  )
  .delete(protect, restrictTo("admin"), deleteBlogPost);

// public routes
blogRouter.get("/", getPublishedPosts);
blogRouter.get("/:slug", getPublishedPost);

export default blogRouter;
