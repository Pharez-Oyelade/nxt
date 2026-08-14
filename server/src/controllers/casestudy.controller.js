import CaseStudy from "../models/casestudyModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";

// get all case studies
export const getCaseStudies = asyncHandler(async (req, res, next) => {
  const caseStudies = await CaseStudy.find();
  res.json({ caseStudies });
});

// get single case study
export const getCaseStudy = asyncHandler(async (req, res, next) => {
  const caseStudy = await CaseStudy.findById(req.params.id);
  res.json({ caseStudy });
});

// create a case study
export const createCaseStudy = asyncHandler(async (req, res, next) => {
  const { title, description, status, order } = req.body;
  let { contentBlocks, slug } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: "Title is required" });
  }

  if (!slug) {
    slug = slugify(title, { lower: true, strict: true });
  }

  const existing = await CaseStudy.findOne({ slug });
  if (existing) {
    return res.status(400).json({ success: false, message: "Case study with this slug already exists" });
  }

  if (typeof contentBlocks === "string") {
    try {
      contentBlocks = JSON.parse(contentBlocks);
    } catch (e) {
      return res.status(400).json({ success: false, message: "Invalid contentBlocks format" });
    }
  }

  let coverImage = [];
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "nxt/casestudies",
      });
      coverImage = [{
        url: result.secure_url,
        public_id: result.public_id,
      }];
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      return res.status(400).json({ 
        success: false, 
        message: "Failed to upload image to Cloudinary. Please verify your Cloudinary API credentials in .env (403 Forbidden).",
        error: uploadError.message
      });
    }
  }

  const newCaseStudy = await CaseStudy.create({
    title,
    description,
    slug,
    coverImage,
    contentBlocks: contentBlocks || [],
    status: status || "draft",
    order: order || 0,
  });

  res.status(201).json({
    success: true,
    message: "Case study created successfully",
    caseStudy: newCaseStudy,
  });
});

// update a case study
export const updateCaseStudy = asyncHandler(async (req, res, next) => {
  const caseStudy = await CaseStudy.findById(req.params.id);
  if (!caseStudy) {
    return res.status(404).json({ success: false, message: "Case study not found" });
  }

  const { title, description, status } = req.body;
  let { contentBlocks, slug } = req.body;
  
  if (title) caseStudy.title = title;
  if (description !== undefined) caseStudy.description = description;
  if (status) caseStudy.status = status;
  if (slug) {
    const existing = await CaseStudy.findOne({ slug, _id: { $ne: req.params.id } });
    if (existing) return res.status(400).json({ success: false, message: "Slug already in use" });
    caseStudy.slug = slug;
  }

  if (contentBlocks) {
    if (typeof contentBlocks === "string") {
      try {
        contentBlocks = JSON.parse(contentBlocks);
      } catch (e) {
        return res.status(400).json({ success: false, message: "Invalid contentBlocks format" });
      }
    }
    caseStudy.contentBlocks = contentBlocks;
  }

  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "nxt/casestudies",
      });
      // Delete old image from Cloudinary
      if (caseStudy.coverImage && caseStudy.coverImage.length > 0 && caseStudy.coverImage[0].public_id) {
        await cloudinary.uploader.destroy(caseStudy.coverImage[0].public_id);
      }
      caseStudy.coverImage = [{
        url: result.secure_url,
        public_id: result.public_id,
      }];
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      return res.status(400).json({ 
        success: false, 
        message: "Failed to upload image to Cloudinary.",
        error: uploadError.message
      });
    }
  }

  await caseStudy.save();

  res.json({
    success: true,
    message: "Case study updated successfully",
    caseStudy,
  });
});

// delete a case study
export const deleteCaseStudy = asyncHandler(async (req, res, next) => {
  const caseStudy = await CaseStudy.findById(req.params.id);
  if (!caseStudy) {
    return res.status(404).json({ success: false, message: "Case study not found" });
  }

  // Delete cover image from Cloudinary if it exists
  if (caseStudy.coverImage && caseStudy.coverImage.length > 0 && caseStudy.coverImage[0].public_id) {
    await cloudinary.uploader.destroy(caseStudy.coverImage[0].public_id);
  }

  await caseStudy.deleteOne();

  res.json({ success: true, message: "Case study deleted successfully" });
});
