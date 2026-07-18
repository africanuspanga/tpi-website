export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.warn("[Turnstile] TURNSTILE_SECRET_KEY not set. Skipping verification.");
    return true;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
        }),
      }
    );

    const data = (await response.json()) as { success: boolean };
    return data.success === true;
  } catch (error) {
    console.error("[Turnstile] Verification failed:", error);
    return false;
  }
}
