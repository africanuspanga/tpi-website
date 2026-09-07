import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tpi.or.tz";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // metadataBase resolves every relative OG/canonical URL below, and gives the
  // routes that do not call buildMetadata() (404, admin) an absolute base too.
  metadataBase: new URL(siteUrl),
  // No `template` here on purpose: buildMetadata() already appends
  // "| TPi Tanzania" to every page title, and a template would double it.
  title: "TPi Tanzania | Better Cities. Better Lives.",
  description:
    "TPi advances inclusive urban transformation, poverty reduction and climate resilience through community empowerment, partnerships and evidence-based solutions in Tanzania.",
  applicationName: "TPi Tanzania",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    siteName: "TPi Tanzania",
    locale: "en_TZ",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${manrope.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
