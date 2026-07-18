"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validation/contact";
import { verifyTurnstileToken } from "@/lib/utils/turnstile";
import { rateLimitIp } from "@/lib/utils/rate-limit";
import { sendContactNotification } from "@/lib/email/resend";
import { headers } from "next/headers";

export async function submitContactMessage(values: ContactFormValues) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";

  const rate = rateLimitIp(ip, "contact", 3, 3600);
  if (!rate.success) {
    return {
      success: false,
      message: "Too many messages sent. Please try again later.",
    };
  }

  const parsed = contactFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { turnstile_token, consent, ...data } = parsed.data;

  const turnstileOk = await verifyTurnstileToken(turnstile_token);
  if (!turnstileOk) {
    return {
      success: false,
      message: "Security check failed. Please try again.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    ...data,
    consent_given: consent,
  });

  if (error) {
    console.error("[Contact] Insert error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }

  await sendContactNotification(data);
  revalidatePath("/admin/messages");

  return {
    success: true,
    message: "Thank you for your message. We will be in touch soon.",
  };
}
