import crypto from "crypto";
import Invoice from "../models/invoiceModel.js";
import Project from "../models/projectModel.js";
import Client from "../models/clientModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../middleware/errorHandler.js";
import { StatusCodes } from "http-status-codes";
import { sendInvoiceEmail, sendPaymentReceiptEmail } from "../../services/emailService.js";
import { env } from "../config/env.js";

// Generate sequential invoice number (e.g., INV-0001)
const generateInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();
  return `INV-${(count + 1).toString().padStart(4, "0")}`;
};

// Admin: Create invoice
export const createInvoice = asyncHandler(async (req, res) => {
  const { clientId, projectId, lineItems, dueDate } = req.body;

  if (!clientId || !projectId || !lineItems || lineItems.length === 0) {
    throw new AppError("Provide clientId, projectId, and lineItems", StatusCodes.BAD_REQUEST);
  }

  const project = await Project.findById(projectId);
  if (!project) throw new AppError("Project not found", StatusCodes.NOT_FOUND);

  let totalAmount = 0;
  lineItems.forEach((item) => {
    totalAmount += item.amount;
  });

  const invoiceNumber = await generateInvoiceNumber();

  const invoice = await Invoice.create({
    invoiceNumber,
    clientId,
    projectId,
    lineItems,
    totalAmount,
    dueDate,
    status: "draft",
  });

  res.status(StatusCodes.CREATED).json({ invoice });
});

// Admin: Get all invoices
export const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find()
    .populate("clientId", "companyName email")
    .populate("projectId", "title")
    .sort({ createdAt: -1 });

  res.json({ invoices });
});

// Admin & Client: Get single invoice
export const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("clientId", "companyName email")
    .populate("projectId", "title");

  if (!invoice) {
    throw new AppError("Invoice not found", StatusCodes.NOT_FOUND);
  }

  // Ensure client can only view their own invoice
  if (req.user.role === "client") {
    if (invoice.clientId._id.toString() !== req.user.clientId) {
      throw new AppError("Unauthorized access to invoice", StatusCodes.FORBIDDEN);
    }
    if (invoice.status === "draft") {
      throw new AppError("Invoice not found", StatusCodes.NOT_FOUND);
    }
  }

  res.json({ invoice });
});

// Client: Get client invoices
export const getClientInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ 
    clientId: req.user.clientId,
    status: { $ne: "draft" } 
  })
    .populate("projectId", "title")
    .sort({ createdAt: -1 });

  res.json({ invoices });
});

// Admin: Send Invoice
export const sendInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate("clientId");

  if (!invoice) {
    throw new AppError("Invoice not found", StatusCodes.NOT_FOUND);
  }

  invoice.status = "sent";
  await invoice.save();

  // Send email to client
  const paymentLink = `${env.CLIENT_URL}/portal/invoices/${invoice._id}`;
  await sendInvoiceEmail({
    to: invoice.clientId.email,
    invoiceNumber: invoice.invoiceNumber,
    amount: invoice.totalAmount,
    link: paymentLink,
  });

  res.json({ invoice, message: "Invoice sent successfully" });
});

// Public: Paystack Webhook
export const handlePaystackWebhook = asyncHandler(async (req, res) => {
  // Paystack sends the hash in x-paystack-signature header
  const signature = req.headers["x-paystack-signature"];
  
  if (!signature) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "No signature found" });
  }

  // Verify the signature using HMAC SHA512 with the raw body buffer
  const hash = crypto
    .createHmac("sha512", env.PAYSTACK_SECRET_KEY)
    .update(req.body) // req.body must be a raw buffer from express.raw()
    .digest("hex");

  if (hash !== signature) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid signature" });
  }

  // Parse the raw body to JSON now that it's verified
  const event = JSON.parse(req.body.toString());

  if (event.event === "charge.success") {
    const data = event.data;
    const reference = data.reference;

    // Metadata should contain the invoiceId passed from the frontend
    const invoiceId = data.metadata?.custom_fields?.find(f => f.variable_name === "invoice_id")?.value;

    if (invoiceId) {
      const invoice = await Invoice.findById(invoiceId).populate("clientId");
      
      if (invoice && invoice.status !== "paid") {
        // Amount comes back in kobo/cents. Ensure it matches. (Optional, can just mark paid if success)
        invoice.status = "paid";
        invoice.paystackRef = reference;
        await invoice.save();

        await sendPaymentReceiptEmail({
          to: invoice.clientId.email,
          invoiceNumber: invoice.invoiceNumber,
          amount: invoice.totalAmount,
        });
      }
    }
  }

  // Acknowledge receipt to Paystack
  res.status(StatusCodes.OK).send("Webhook received");
});
