"use server";

import { createClient } from "@/lib/supabase/server";
import {
  newsletterSchema,
  type NewsletterFormValues,
} from "@/lib/validation/newsletter";
import { verifyTurnstileToken } from "@/lib/utils/turnstile";
import { rateLimitIp } from "@/lib/utils/rate-limit";
import { sendNewsletterWelcome } from "@/lib/email/resend";
import { headers } from "next/headers";

export async function subscribeNewsletter(values: NewsletterFormValues) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";

  const rate = rateLimitIp(ip, "newsletter", 5, 3600);
  if (!rate.success) {
    return {
      success: false,
      message: "Too many subscription attempts. Please try again later.",
    };
  }

  const parsed = newsletterSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  const { turnstile_token, ...data } = parsed.data;

  const turnstileOk = await verifyTurnstileToken(turnstile_token);
  if (!turnstileOk) {
    return {
      success: false,
      message: "Security check failed. Please try again.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").upsert(
    {
      email: data.email.toLowerCase(),
      full_name: data.full_name || null,
      is_active: true,
      unsubscribed_at: null,
    },
    { onConflict: "email" }
  );

  if (error) {
    console.error("[Newsletter] Upsert error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }

  await sendNewsletterWelcome(data);

  return {
    success: true,
    message: "Thank you for subscribing to TPi Tanzania updates.",
  };
}
