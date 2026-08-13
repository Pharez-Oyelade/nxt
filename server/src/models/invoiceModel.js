import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  lineItems: [
    {
      desc: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["draft", "sent", "paid", "overdue"],
    default: "draft",
  },
  dueDate: {
    type: Date,
  },
  paystackRef: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Invoice =
  mongoose.models.invoice || mongoose.model("invoice", invoiceSchema);

export default Invoice;
