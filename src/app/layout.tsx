import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OrganizationJsonLd } from "@/lib/seo/json-ld";
import "./globals.css";

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
  title: "TPi Tanzania | Better Cities. Better Lives.",
  description:
    "TPi advances inclusive urban transformation, poverty reduction and climate resilience through community empowerment, partnerships and evidence-based solutions in Tanzania.",
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
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
