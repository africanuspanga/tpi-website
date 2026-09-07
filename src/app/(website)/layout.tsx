import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/lib/seo/json-ld";

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      {/* Structured data belongs to the public site only, never the admin. */}
      <OrganizationJsonLd />
      <WebSiteJsonLd />
    </>
  );
}
