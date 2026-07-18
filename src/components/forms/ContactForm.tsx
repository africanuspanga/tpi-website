"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  contactFormSchema,
  enquiryTypes,
  type ContactFormValues,
} from "@/lib/validation/contact";
import { submitContactMessage } from "@/actions/contact";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  { ssr: false }
);

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm({ defaultEnquiry }: { defaultEnquiry?: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      organization: "",
      enquiry_type: (enquiryTypes as readonly string[]).includes(
        defaultEnquiry ?? ""
      )
        ? (defaultEnquiry as ContactFormValues["enquiry_type"])
        : undefined,
      subject: "",
      message: "",
      consent: false,
      turnstile_token: turnstileSiteKey ? "" : "skipped",
    },
  });

  const consentValue = watch("consent");

  const onSubmit = (values: ContactFormValues) => {
    setResult(null);
    startTransition(async () => {
      const response = await submitContactMessage(values);
      setResult(response);
      if (response.success) reset();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          {result.success ? (
            <CheckCircle2 className="h-4 w-4 text-poverty-green" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full name</Label>
          <Input
            id="full_name"
            placeholder="Your full name"
            aria-invalid={errors.full_name ? "true" : "false"}
            {...register("full_name")}
          />
          {errors.full_name && (
            <p className="text-sm text-destructive">{errors.full_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone number (optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+255 ..."
            {...register("phone")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization">Organization (optional)</Label>
          <Input
            id="organization"
            placeholder="Organization or affiliation"
            {...register("organization")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="enquiry_type">Enquiry type</Label>
        <select
          id="enquiry_type"
          className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-invalid={errors.enquiry_type ? "true" : "false"}
          {...register("enquiry_type")}
        >
          <option value="">Select an enquiry type</option>
          {enquiryTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.enquiry_type && (
          <p className="text-sm text-destructive">{errors.enquiry_type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="What is this about?"
          aria-invalid={errors.subject ? "true" : "false"}
          {...register("subject")}
        />
        {errors.subject && (
          <p className="text-sm text-destructive">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={5}
          placeholder="Tell us how we can help..."
          aria-invalid={errors.message ? "true" : "false"}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent"
            checked={consentValue}
            onCheckedChange={(checked) =>
              setValue("consent", checked === true, { shouldValidate: true })
            }
          />
          <Label htmlFor="consent" className="cursor-pointer font-normal text-body/80">
            I consent to TPi Tanzania processing my personal data to respond to this
            enquiry.
          </Label>
        </div>
        {errors.consent && (
          <p className="text-sm text-destructive">{errors.consent.message}</p>
        )}
      </div>

      {turnstileSiteKey && (
        <div>
          <Turnstile
            siteKey={turnstileSiteKey}
            onSuccess={(token) => setValue("turnstile_token", token)}
            onError={() => setValue("turnstile_token", "")}
            onExpire={() => setValue("turnstile_token", "")}
          />
          {errors.turnstile_token && (
            <p className="mt-2 text-sm text-destructive">
              {errors.turnstile_token.message}
            </p>
          )}
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="bg-navy px-8 text-white hover:bg-navy/90"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send message"
        )}
      </Button>
    </form>
  );
}
