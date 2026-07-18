import { z } from "zod";

export const enquiryTypes = [
  "General enquiry",
  "Partnership",
  "Funding and development cooperation",
  "Research collaboration",
  "Media enquiry",
  "Community engagement",
  "Careers",
  "Other",
] as const;

export const contactFormSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(160, "Name must be less than 160 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  enquiry_type: z.enum(enquiryTypes, {
    error: "Please select an enquiry type",
  }),
  subject: z
    .string()
    .min(2, "Subject must be at least 2 characters")
    .max(250, "Subject must be less than 250 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters"),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to us processing your enquiry",
  }),
  turnstile_token: z.string().min(1, "Please complete the security check"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
