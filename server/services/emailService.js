import { Resend } from "resend";
import { env } from "../src/config/env.js";

const resend = new Resend(env.RESEND_API_KEY);
const FROM_EMAIL = env.FROM_EMAIL;

async function sendEmail({ to, subject, html }) {
  if (!env.RESEND_API_KEY || !FROM_EMAIL) {
    throw new Error("Email not configured");
  }

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Resend Error:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function sendInviteEmail({ to, token }) {
  const subject = "Create client account";
  const html = `<p>Click <a href="${env.CLIENT_URL}/invite/${token}">here</a> to create a client account</p>`;
  return sendEmail({ to, subject, html });
}

export async function sendInvoiceEmail({ to, invoiceNumber, amount, link }) {
  const subject = `New Invoice: ${invoiceNumber}`;
  const html = `
    <h2>You have a new invoice from NXT</h2>
    <p>Invoice <strong>${invoiceNumber}</strong> for <strong>₦${amount}</strong> has been generated.</p>
    <p>You can view and pay your invoice securely by clicking the link below:</p>
    <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">View Invoice</a>
  `;
  return sendEmail({ to, subject, html });
}

export async function sendPaymentReceiptEmail({ to, invoiceNumber, amount }) {
  const subject = `Payment Received: ${invoiceNumber}`;
  const html = `
    <h2>Thank You for Your Payment!</h2>
    <p>We have successfully received your payment of <strong>₦${amount}</strong> for Invoice <strong>${invoiceNumber}</strong>.</p>
    <p>Your invoice has been marked as paid. You can review your payment history in your client portal at any time.</p>
  `;
  return sendEmail({ to, subject, html });
}
