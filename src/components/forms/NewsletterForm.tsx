"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  newsletterSchema,
  type NewsletterFormValues,
} from "@/lib/validation/newsletter";
import { subscribeNewsletter } from "@/actions/newsletter";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  { ssr: false }
);

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface NewsletterFormProps {
  showName?: boolean;
  buttonText?: string;
}

export function NewsletterForm({
  showName = true,
  buttonText = "Subscribe",
}: NewsletterFormProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      full_name: "",
      turnstile_token: turnstileSiteKey ? "" : "skipped",
    },
  });

  const onSubmit = (values: NewsletterFormValues) => {
    setResult(null);
    startTransition(async () => {
      const response = await subscribeNewsletter(values);
      setResult(response);
      if (response.success) reset();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      {showName && (
        <div className="space-y-2">
          <Label htmlFor="newsletter_name">Name (optional)</Label>
          <Input
            id="newsletter_name"
            placeholder="Your name"
            {...register("full_name")}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="newsletter_email">Email address</Label>
        <Input
          id="newsletter_email"
          type="email"
          placeholder="you@example.com"
          aria-invalid={errors.email ? "true" : "false"}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
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
        className="w-full bg-navy text-white hover:bg-navy/90"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subscribing...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </form>
  );
}
