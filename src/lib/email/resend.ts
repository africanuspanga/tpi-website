import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromAddress =
  process.env.EMAIL_FROM_ADDRESS || "TPi Tanzania <noreply@tpi.or.tz>";
const notificationAddress =
  process.env.EMAIL_NOTIFICATION_ADDRESS || "info@TPi.or.tz";

export async function sendContactNotification(input: {
  full_name: string;
  email: string;
  subject: string;
  enquiry_type?: string | null;
}) {
  if (!resend) {
    console.log("[Email] Resend not configured. Skipping contact notification.");
    return { success: false, reason: "no_provider" };
  }

  try {
    await resend.emails.send({
      from: fromAddress,
      to: notificationAddress,
      subject: `New enquiry: ${input.subject}`,
      html: `<p><strong>${input.full_name}</strong> sent a new ${input.enquiry_type || "general"} enquiry.</p><p><strong>Subject:</strong> ${input.subject}</p><p><strong>Email:</strong> ${input.email}</p><p>View it in the admin panel.</p>`,
    });
    return { success: true };
  } catch (error) {
    console.error("[Email] Failed to send contact notification:", error);
    return { success: false, reason: "send_error" };
  }
}

export async function sendNewsletterWelcome(input: {
  email: string;
  full_name?: string | null;
}) {
  if (!resend) {
    console.log("[Email] Resend not configured. Skipping newsletter welcome.");
    return { success: false, reason: "no_provider" };
  }

  try {
    await resend.emails.send({
      from: fromAddress,
      to: input.email,
      subject: "Welcome to TPi Tanzania updates",
      html: `<p>Dear ${input.full_name || "friend"},</p><p>Thank you for subscribing to updates from TPi Tanzania. We will keep you informed about our work advancing inclusive urban transformation, poverty reduction and climate resilience.</p><p>Best regards,<br>TPi Tanzania</p>`,
    });
    return { success: true };
  } catch (error) {
    console.error("[Email] Failed to send newsletter welcome:", error);
    return { success: false, reason: "send_error" };
  }
}
