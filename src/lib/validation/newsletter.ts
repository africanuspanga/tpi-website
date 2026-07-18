import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  full_name: z.string().optional(),
  turnstile_token: z.string().min(1, "Please complete the security check"),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
