import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description:
    "The terms governing your use of the TPi Tanzania website and its content.",
  path: "/terms-of-use",
});

const LAST_UPDATED = "18 July 2026";

export default function TermsOfUsePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Terms of Use", path: "/terms-of-use" },
        ]}
      />

      <section className="bg-navy py-24 text-white lg:py-28">
        <div className="container-tpi">
          <span className="label-eyebrow mb-4 block text-gold">Legal</span>
          <h1 className="heading-display text-4xl md:text-5xl">Terms of Use</h1>
          <p className="mt-4 text-sm text-white/70">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="container-tpi">
          <div className="prose prose-lg mx-auto max-w-3xl text-body/80 prose-headings:heading-display prose-headings:text-navy prose-a:text-urban-blue">
            <p>
              These terms govern your use of the TPi Tanzania website. By
              accessing or using this website, you agree to these terms. If you do
              not agree, please do not use the site.
            </p>

            <h2>Use of content</h2>
            <p>
              The content on this website — including text, images, reports and
              publications — is provided for information purposes. You may view,
              download and share our content for non-commercial purposes, provided
              you credit TPi Tanzania and do not alter the material.
            </p>

            <h2>Intellectual property</h2>
            <p>
              Unless otherwise stated, all content, logos and trademarks on this
              website are the property of TPi Tanzania or its partners and are
              protected by applicable laws. You may not use them without prior
              written permission.
            </p>

            <h2>Acceptable use</h2>
            <ul>
              <li>
                Do not use this website in any way that is unlawful or harmful.
              </li>
              <li>
                Do not attempt to gain unauthorized access to any part of the
                website or its systems.
              </li>
              <li>
                Do not submit false, misleading or abusive content through our
                forms.
              </li>
            </ul>

            <h2>Third-party links</h2>
            <p>
              This website may contain links to external websites. We are not
              responsible for the content, policies or practices of those
              websites.
            </p>

            <h2>Disclaimer</h2>
            <p>
              We strive to keep information accurate and up to date, but we make no
              warranties about the completeness or reliability of the content. Use
              of the website is at your own risk.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              To the extent permitted by law, TPi Tanzania shall not be liable for
              any loss or damage arising from your use of, or inability to use,
              this website.
            </p>

            <h2>Changes to these terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the
              website after changes take effect constitutes acceptance of the
              revised terms.
            </p>

            <h2>Contact us</h2>
            <p>
              Questions about these terms can be sent to{" "}
              <a href="mailto:info@TPi.or.tz">info@TPi.or.tz</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
