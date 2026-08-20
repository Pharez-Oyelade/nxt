import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../middleware/errorHandler.js";
import { StatusCodes } from "http-status-codes";
import Task from "../models/taskModel.js";
import Project from "../models/projectModel.js";
import User from "../models/userModel.js";

// @desc    Create a new task for a project
// @route   POST /api/v1/projects/:id/tasks
// @access  Private/Admin
export const createTask = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const { title, description, dueDate, assignedTo, status } = req.body;

  if (!title) {
    throw new AppError("Task title is required", StatusCodes.BAD_REQUEST);
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("Project not found", StatusCodes.NOT_FOUND);
  }

  const task = await Task.create({
    projectId,
    title,
    description,
    dueDate,
    assignedTo,
    status: status || "pending",
  });

  // Add task to project's tasks array
  project.tasks.push(task._id);
  await project.save();

  // Populate assignee for the response
  await task.populate("assignedTo", "name email");

  res.status(StatusCodes.CREATED).json({ task });
});

// @desc    Get all tasks for a project
// @route   GET /api/v1/projects/:id/tasks
// @access  Private
export const getProjectTasks = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("Project not found", StatusCodes.NOT_FOUND);
  }

  const tasks = await Task.find({ projectId })
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 });

  res.status(StatusCodes.OK).json({ tasks });
});

// @desc    Get all tasks across all projects
// @route   GET /api/v1/tasks
// @access  Private/Admin
export const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({})
    .populate("assignedTo", "name email")
    .populate("projectId", "title")
    .sort({ createdAt: -1 });

  res.status(StatusCodes.OK).json({ tasks });
});

// @desc    Update a task
// @route   PUT /api/v1/tasks/:taskId
// @access  Private/Admin
export const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, dueDate, assignedTo, status } = req.body;

  let task = await Task.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", StatusCodes.NOT_FOUND);
  }

  task.title = title || task.title;
  if (description !== undefined) task.description = description;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (assignedTo !== undefined) task.assignedTo = assignedTo;
  if (status !== undefined) task.status = status;
  task.updatedAt = Date.now();

  await task.save();
  await task.populate("assignedTo", "name email");

  res.status(StatusCodes.OK).json({ task });
});

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:taskId
// @access  Private/Admin
export const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", StatusCodes.NOT_FOUND);
  }

  // Remove task from project's tasks array
  await Project.findByIdAndUpdate(task.projectId, {
    $pull: { tasks: task._id },
  });

  await task.deleteOne();

  res.status(StatusCodes.OK).json({ message: "Task removed" });
});
