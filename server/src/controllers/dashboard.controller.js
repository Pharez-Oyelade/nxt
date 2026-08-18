import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../middleware/errorHandler.js";
import { StatusCodes } from "http-status-codes";
import Lead from "../models/leadModel.js";
import Project from "../models/projectModel.js";
import Invoice from "../models/invoiceModel.js";
import Task from "../models/taskModel.js";
import { PHASES } from "./project.controller.js";

export const getAdminDashboardSummary = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    newLeadsCount,
    recentLeads,
    projects,
    unpaidInvoices,
    paidInvoices,
    upcomingTasks,
  ] = await Promise.all([
    Lead.countDocuments({ archived: false, status: "new" }),
    Lead.find({ archived: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name company status createdAt"),
    Project.find({ phase: { $ne: "archived" } }),
    Invoice.find({ status: { $in: ["sent", "overdue"] } }).select(
      "totalAmount",
    ),
    Invoice.find({ status: "paid" }).select("totalAmount createdAt"),
    Task.find({
      status: { $ne: "completed" },
    })
      .sort({ dueDate: 1 })
      .limit(15)
      .populate("projectId", "title"),
  ]);

  const projectsByPhase = PHASES.reduce((acc, phase) => {
    acc[phase] = projects.filter((project) => project.phase === phase).length;
    return acc;
  }, {});

  const revenue = paidInvoices.reduce(
    (acc, inv) => {
      acc.allTime += inv.totalAmount;
      if (inv.createdAt >= startOfMonth) acc.monthly += inv.totalAmount;
      if (inv.createdAt >= startOfYear) acc.yearly += inv.totalAmount;
      return acc;
    },
    { allTime: 0, monthly: 0, yearly: 0 },
  );

  res.json({
    newLeadsCount,
    recentLeads,
    projectsByPhase,
    activeProjectsCount: projects.length,
    outstandingInvoices: {
      count: unpaidInvoices.length,
      totalAmount: unpaidInvoices.reduce(
        (acc, invoice) => acc + invoice.totalAmount,
        0,
      ),
    },
    revenue,
    upcomingTasks,
  });
});

// client portal home
export const getClientDashboardSummary = asyncHandler(async (req, res) => {
  const [projects, unpaidInvoices, recentInvoices] = await Promise.all([
    Project.find({
      clientId: req.user.clientId,
      phase: { $ne: "archived" },
    }).sort({ updatedAt: -1 }),
    Invoice.find({
      clientId: req.user.clientId,
      status: { $in: ["sent", "overdue"] },
    }),
    Invoice.find({
      clientId: req.user.clientId,
    })
      .sort({ createdAt: -1 })
      .limit(3),
  ]);

  const latestFile =
    projects
      .flatMap((project) =>
        project.files.map((file) => ({
          ...file.toObject(),
          projectTitle: project.title,
        })),
      )
      .sort((a, b) => b.uploadedAt - a.uploadedAt)[0] || null;

  res.json({
    projects,
    activeProjectsCount: projects.length,
    outStandingBalance: unpaidInvoices.reduce(
      (acc, invoice) => acc + invoice.totalAmount,
      0,
    ),
    recentInvoices,
    latestFile,
  });
});
