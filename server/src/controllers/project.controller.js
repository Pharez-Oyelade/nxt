import Project from "../models/projectModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../middleware/errorHandler.js";
import { StatusCodes } from "http-status-codes";

const PHASES = [
  "discovery",
  "design",
  "development",
  "review",
  "delivered",
  "maintenance",
  "archived",
];

// admin - list all projects
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ archived: false })
    .populate("clientId", "companyName")
    .sort({
      createdAt: -1,
    });

  res.json({ projects });
});

// admin detail view
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "clientId",
    "companyName",
    "primaryContactName",
  );

  if (!project) {
    throw new AppError("Project not found", StatusCodes.NOT_FOUND);
  }

  res.json({ project });
});

// admin create project for exisiting client
export const createProject = asyncHandler(async (req, res) => {
  const { clientId, title } = req.body;

  if (!clientId || !title) {
    throw new AppError(
      "Please provide all required fields",
      StatusCodes.BAD_REQUEST,
    );
  }

  const project = await Project.create({
    clientId,
    title,
    phase: "discovery",
  });

  res.status(StatusCodes.CREATED).json({ project });
});

// admin kanban drag
export const updateProjectPhase = asyncHandler(async (req, res) => {
  const { phase } = req.body;

  if (!PHASES.includes(phase)) {
    throw new AppError("Please provide a valid phase", StatusCodes.BAD_REQUEST);
  }

  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new AppError("Project not found", StatusCodes.NOT_FOUND);
  }

  project.phase = phase;
  await project.save();

  res.json({ project });
});

// admin edit details
export const updateProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new AppError("Project not found", StatusCodes.NOT_FOUND);
  }

  if (title) project.title = title;
  if (description) project.description = description;

  await project.save();
  res.json({ project });
});

// admin upload a deliverable
export const addFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Please upload a file", StatusCodes.BAD_REQUEST);
  }

  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError("Project not found", StatusCodes.NOT_FOUND);

  let uploaded;
  try {
    uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "/nxt/deliverables",
    });
  } catch (err) {
    throw new AppError(err.message, StatusCodes.BAD_REQUEST);
  } finally {
    fs.unlink(req.file.path, () => {});
  }

  project.files.push({
    url: uploaded.secure_url,
    public_id: uploaded.public_id,
    name: req.file.originalname,
  });

  await project.save();

  res.status(StatusCodes.CREATED).json({ project });
});

// client - list own projects
export const getClientProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    clientId: req.user.clientId,
  });

  res.json({ projects });
});

// client detail view
export const getClientProject = asyncHandler(async (req, res) => {
  const project = await Project.find({
    id: req.params.id,
    clientId: req.user.clientId,
  });

  if (!project) {
    throw new AppError("Project not found", StatusCodes.NOT_FOUND);
  }

  res.json({ project });
});
