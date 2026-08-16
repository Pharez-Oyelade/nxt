import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../middleware/errorHandler.js";
import { StatusCodes } from "http-status-codes";
import Client from "../models/clientModel.js";
import Lead from "../models/leadModel.js";
import { createClientAndInviteUser } from "../../services/clientService.js";

// Get all clients
export const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find();

  res.json({ clients });
});

// Get single client
export const getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    throw new AppError("Client not found", StatusCodes.NOT_FOUND);
  }

  res.json({ client });
});

// create a client
export const createClient = asyncHandler(async (req, res) => {
  const { companyName, contactName, email, industry, billingEmail, notes } =
    req.body;

  if (!companyName || !contactName || !email) {
    throw new AppError("Provide all required fields", StatusCodes.BAD_REQUEST);
  }

  const { client, user, emailSent } = await createClientAndInviteUser({
    companyName,
    contactName,
    email,
    industry,
    billingEmail,
    notes,
  });

  res.status(StatusCodes.CREATED).json({
    client,
    user: {
      id: user._id,
      email: user.email,
    },
    emailSent,
  });
});

// update a client
export const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!client) {
    throw new AppError("Client not found", StatusCodes.NOT_FOUND);
  }

  res.json({ client });
});
