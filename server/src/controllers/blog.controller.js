import BlogPost from "../models/blogPostModel";
import asyncHandler from "../utils/asyncHandler";
import cloudinary from "../config/cloudinary";
import slugify from "slugify";
import { AppError } from "../middleware/errorHandler";
import { StatusCodes } from "http-status-codes";
import fs from "fs";

// get all blog posts (admin)
export const getBlogPosts = asyncHandler(async (req, res, next) => {
  const blogPosts = await BlogPost.find();
  res.json({ blogPosts });
});

// get published blog
export const getPublishedPosts = asyncHandler(async (req, res, next) => {
  const blogPosts = await BlogPost.find({ status: "published" }).sort({
    publishedAt: -1,
  });
  res.json({ blogPosts });
});

// get single blog (admin)
export const getBlogPost = asyncHandler(async (req, res, next) => {
  const blogPost = await BlogPost.findById(req.params.id);

  if (!blogPost) {
    throw new AppError("Blog post not found", StatusCodes.NOT_FOUND);
  }

  res.json({ blogPost });
});

// get single blog (public)
export const getPublishedPost = asyncHandler(async (req, res, next) => {
  const blogPost = await BlogPost.findOne({
    slug: req.params.slug,
    status: "published",
  });

  if (!blogPost) {
    throw new AppError("Blog post not found", StatusCodes.NOT_FOUND);
  }

  res.json({ blogPost });
});

// create a blog post
export const createBlogPost = asyncHandler(async (req, res, next) => {
  const { title, body, status } = req.body;
  let { slug } = req.body;

  if (!title) {
    throw new AppError("Title is required", StatusCodes.BAD_REQUEST);
  }

  if (!slug) {
    slug = slugify(title, { lower: true, strict: true });
  }

  // check if slug exists
  const existingSlug = await BlogPost.findOne({ slug });

  if (existingSlug) {
    throw new AppError("Slug already in use", StatusCodes.BAD_REQUEST);
  }

  let coverImage = null;
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "/nxt/blog",
      });
      coverImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      throw new AppError("Cover image upload failed", StatusCodes.BAD_GATEWAY);
    } finally {
      fs.unlink(req.file.path, () => {});
    }
  }

  const postStatus = status || "draft";

  const newBlog = await BlogPost.create({
    title,
    body,
    slug,
    coverImage,
    status: postStatus,
    publishedAt: postStatus === "published" ? new Date() : null,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ message: "Blog post created", blog: newBlog });
});

// update a blog
export const updateBlogPost = asyncHandler(async (req, res, next) => {
  const blogPost = await BlogPost.findById(req.params.id);
  if (!blogPost) {
    throw new AppError("Blog post not found", StatusCodes.NOT_FOUND);
  }

  const { title, body, status } = req.body;
  let { slug } = req.body;

  if (title) blogPost.title = title;
  if (body !== undefined) blogPost.body = body;
  if (status === "published" && blogPost.publishedAt === null) {
    blogPost.status = status;
    blogPost.publishedAt = new Date();
  } else if (status) {
    blogPost.status = status;
  }
  if (slug) {
    const existing = await BlogPost.findOne({
      slug,
      _id: { $ne: req.params.id },
    });
    if (existing) {
      throw new AppError("Slug already in use", StatusCodes.BAD_REQUEST);
    }
    blogPost.slug = slug;
  }

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "nxt/blog",
      });
      // Delete old image
      if (blogPost.coverImage && blogPost.coverImage.public_id) {
        await cloudinary.uploader.destroy(blogPost.coverImage.public_id);
      }
      blogPost.coverImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      throw new AppError("Cover image upload failed", StatusCodes.BAD_GATEWAY);
    } finally {
      fs.unlink(req.file.path, () => {});
    }
  }

  await blogPost.save();

  res.json({
    success: true,
    message: "Blog post updated successfully",
    blogPost,
  });
});

// delete a blog post
export const deleteBlogPost = asyncHandler(async (req, res, next) => {
  const blogPost = await BlogPost.findById(req.params.id);
  if (!blogPost) {
    throw new AppError("Blog post not found", StatusCodes.NOT_FOUND);
  }

  // Delete cover image from cloudinary
  if (blogPost.coverImage && blogPost.coverImage.public_id) {
    await cloudinary.uploader.destroy(blogPost.coverImage.public_id);
  }

  await blogPost.deleteOne();

  res.json({ success: true, message: "Blog post deleted successfully" });
});
