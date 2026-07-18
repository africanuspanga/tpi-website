import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How TPi Tanzania collects, uses and protects personal data submitted through this website.",
  path: "/privacy-policy",
});

const LAST_UPDATED = "18 July 2026";

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ]}
      />

      <section className="bg-navy py-24 text-white lg:py-28">
        <div className="container-tpi">
          <span className="label-eyebrow mb-4 block text-gold">Legal</span>
          <h1 className="heading-display text-4xl md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-white/70">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="container-tpi">
          <div className="prose prose-lg mx-auto max-w-3xl text-body/80 prose-headings:heading-display prose-headings:text-navy prose-a:text-urban-blue">
            <p>
              TPi Tanzania (&quot;TPi&quot;, &quot;we&quot;, &quot;us&quot;) is
              committed to protecting the privacy of everyone who interacts with
              this website. This policy explains what personal data we collect,
              why we collect it, and how we handle it.
            </p>

            <h2>Information we collect</h2>
            <p>
              We only collect personal data that you choose to provide, for
              example when you submit our contact form or subscribe to our
              newsletter. This may include your name, email address, phone
              number, organization and the content of your message.
            </p>

            <h2>How we use your information</h2>
            <ul>
              <li>To respond to enquiries and partnership requests.</li>
              <li>To send updates you have subscribed to receive.</li>
              <li>
                To improve our programmes, communications and the performance of
                this website.
              </li>
              <li>To comply with legal and regulatory obligations.</li>
            </ul>

            <h2>Legal basis and consent</h2>
            <p>
              Where we rely on your consent — such as newsletter subscriptions or
              responding to your enquiry — you may withdraw that consent at any
              time by contacting us. We process contact-form submissions only when
              you confirm your consent on the form.
            </p>

            <h2>Sharing your information</h2>
            <p>
              We do not sell your personal data. We may share it with trusted
              service providers (for example, email delivery and website hosting)
              strictly to operate this website, and with authorities where
              required by law.
            </p>

            <h2>Data retention and security</h2>
            <p>
              We keep personal data only as long as necessary for the purposes
              described above and apply appropriate technical and organizational
              measures to protect it against unauthorized access, loss or misuse.
            </p>

            <h2>Your rights</h2>
            <p>
              You may request access to, correction of, or deletion of your
              personal data, and object to certain processing. To exercise these
              rights, contact us at{" "}
              <a href="mailto:info@TPi.or.tz">info@TPi.or.tz</a>.
            </p>

            <h2>Cookies and analytics</h2>
            <p>
              This website may use privacy-respecting analytics to understand how
              visitors use our content. These tools do not identify you
              personally.
            </p>

            <h2>Contact us</h2>
            <p>
              For any question about this policy or your personal data, contact
              TPi Tanzania at 21 Taasisi, Mikocheni, P.O. Box 4161, Dar es Salaam,
              Tanzania, or by email at{" "}
              <a href="mailto:info@TPi.or.tz">info@TPi.or.tz</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
