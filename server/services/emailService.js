import { Resend } from "resend";
import { env } from "../src/config/env.js";

const resend = new Resend(env.RESEND_API_KEY);
const FROM_EMAIL = env.FROM_EMAIL;

async function sendEmail({ to, subject, html }) {
  if (!env.RESEND_API_KEY || FROM_EMAIL) {
    throw new Error("Email not configured");
  }

  const data = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  return data;
}

export async function sendInviteEmail({ to, token }) {
  const subject = "Create client account";
  const html = `<p>Click <a href="${env.CLIENT_URL}/invite/${token}">here</a> to create a client account</p>`;
  return sendEmail({ to, subject, html });
}
