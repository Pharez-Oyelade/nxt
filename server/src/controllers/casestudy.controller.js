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
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "nxt/casestudies",
    });
    coverImage = [{
      url: result.secure_url,
      public_id: result.public_id,
    }];
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
