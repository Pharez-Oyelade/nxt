import CaseStudy from "../models/casestudyModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";
import mongoose from "mongoose";

// get all case studies
export const getCaseStudies = asyncHandler(async (req, res, next) => {
  const query = {};
  if (req.query.selected === "true") {
    query.selected = true;
  }
  
  let dbQuery = CaseStudy.find(query).sort({ order: 1, createdAt: -1 });
  
  if (req.query.limit) {
    dbQuery = dbQuery.limit(parseInt(req.query.limit, 10));
  }
  
  const caseStudies = await dbQuery;
  res.json({ caseStudies });
});

// get single case study
export const getCaseStudy = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const isMongoId = mongoose.Types.ObjectId.isValid(id);
  
  const query = isMongoId ? { _id: id } : { slug: id };
  const caseStudy = await CaseStudy.findOne(query);

  if (!caseStudy) {
    return res.status(404).json({ success: false, message: "Case study not found" });
  }

  res.json({ caseStudy });
});

// create a case study
export const createCaseStudy = asyncHandler(async (req, res, next) => {
  const { title, description, status, order, selected } = req.body;
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
    selected: selected === "true" || selected === true,
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

  const { title, description, status, selected } = req.body;
  let { contentBlocks, slug } = req.body;
  
  if (title) caseStudy.title = title;
  if (description !== undefined) caseStudy.description = description;
  if (status) caseStudy.status = status;
  if (selected !== undefined) caseStudy.selected = selected === "true" || selected === true;
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
