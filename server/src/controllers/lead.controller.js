import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../middleware/errorHandler.js";
import { StatusCodes } from "http-status-codes";
import Lead from "../models/leadModel.js";
import { createClientAndInviteUser } from "../../services/clientService.js";
import Project from "../models/projectModel.js";

// Get all leads
export const getLeads = asyncHandler(async (req, res) => {
  const leads = await Lead.find({ archived: false });

  res.json({ leads });
});

// Get single lead
export const getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    throw new AppError("Lead not found", StatusCodes.NOT_FOUND);
  }

  res.json({ lead });
});

// Create a lead
export const createLead = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const company = req.body.company?.trim();
  const message = req.body.message?.trim();

  if (!name || !email || !message) {
    throw new AppError(
      "Please provide all required fields",
      StatusCodes.BAD_REQUEST,
    );
  }

  // Check if this person already exists
  const existingLead = await Lead.findOne({ email });

  if (existingLead) {
    existingLead.name = name;
    // existingLead.company = company;
    existingLead.messages.push(message);

    if (company) {
      existingLead.company = company;
    }

    await existingLead.save();

    return res.json({ lead: existingLead });
  }

  const lead = await Lead.create({
    name,
    email,
    company,
    messages: [message],
  });

  res.status(StatusCodes.CREATED).json({ lead });
});

// create lead admin
export const createAdminLead = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const company = req.body.company?.trim();
  const message = req.body.message?.trim();
  const { projectType, budgetRange, status } = req.body;

  if (!name || !email || !message) {
    throw new AppError(
      "Please provide all required fields",
      StatusCodes.BAD_REQUEST,
    );
  }

  // Check if this person already exists
  const existingLead = await Lead.findOne({ email });

  if (existingLead) {
    existingLead.name = name;
    // existingLead.company = company;
    existingLead.projectType = projectType;
    existingLead.budgetRange = budgetRange;

    if (company) {
      existingLead.company = company;
    }

    if (status) {
      existingLead.status = status;
    }

    existingLead.messages.push(message);

    await existingLead.save();

    return res.json({ lead: existingLead });
  }

  const lead = await Lead.create({
    name,
    email,
    company,
    projectType: projectType,
    budgetRange: budgetRange,
    status,
    messages: [message],
  });

  res.status(StatusCodes.CREATED).json({ lead });
});

// Update a lead's status
export const updateLeadStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    throw new AppError(
      "Please provide a valid status",
      StatusCodes.BAD_REQUEST,
    );
  }

  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    throw new AppError("Lead not found", StatusCodes.NOT_FOUND);
  }

  lead.status = status;
  await lead.save();

  res.json({ lead });
});

// Update full lead details (Admin)
export const updateLead = asyncHandler(async (req, res) => {
  const { name, email, company, projectType, budgetRange, status, newMessage } =
    req.body;

  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    throw new AppError("Lead not found", StatusCodes.NOT_FOUND);
  }

  if (name) lead.name = name;
  if (email) lead.email = email;
  if (company !== undefined) lead.company = company;
  if (projectType !== undefined) lead.projectType = projectType;
  if (budgetRange !== undefined) lead.budgetRange = budgetRange;
  if (status) lead.status = status;

  if (newMessage && newMessage.trim().length > 0) {
    lead.messages.push(newMessage.trim());
  }

  await lead.save();

  res.json({ lead });
});

// convert lead to client
export const convertLeadToClient = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) throw new AppError("Lead not found", StatusCodes.NOT_FOUND);
  if (lead.archived)
    throw new AppError("Lead already converted", StatusCodes.BAD_REQUEST);

  const { client, user, emailSent } = await createClientAndInviteUser({
    companyName: lead.company,
    contactName: lead.name,
    email: lead.email,
  });

  const project = await Project.create({
    clientId: client._id,
    title: `${client.companyName} - Project`,
    phase: "discovery",
  });

  lead.archived = true;
  await lead.save();

  res.status(StatusCodes.CREATED).json({
    client,
    project,
    user: {
      id: user._id,
      email: user.email,
    },
    emailSent,
  });
});
