import { ContactForm } from "@/components/forms/ContactForm";
import { CopyButton } from "@/components/ui/CopyButton";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { Mail, Phone, MapPin, Globe, Clock, MessageCircle } from "lucide-react";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Start a conversation with TPi Tanzania. Reach us for partnerships, funding, research collaboration, media and community engagement.",
  path: "/contact",
});

const ADDRESS = "21 Taasisi, Mikocheni, P.O. Box 4161, Dar es Salaam, Tanzania";
const WHATSAPP_NUMBER = "255749778332";

export default async function ContactPage(props: {
  searchParams: Promise<{ enquiry?: string }>;
}) {
  const { enquiry } = await props.searchParams;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      <section className="bg-navy py-28 text-white lg:py-36">
        <div className="container-tpi">
          <span className="label-eyebrow mb-4 block text-gold">Contact</span>
          <h1 className="heading-display text-4xl text-white md:text-5xl lg:text-6xl">
            Start a conversation with TPi.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Whether you are a community, a local authority, a development partner
            or a researcher, we would like to hear from you. Send us a message and
            our team will respond promptly.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container-tpi">
          <div className="grid gap-16 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="heading-display text-2xl text-navy md:text-3xl">
                Send us a message
              </h2>
              <p className="mt-3 text-body/80">
                Fill in the form below. Fields marked optional can be left blank.
              </p>
              <div className="mt-8">
                <ContactForm defaultEnquiry={enquiry} />
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-soft-bg p-8">
                <h2 className="heading-display text-2xl text-navy">
                  Official contact details
                </h2>

                <ul className="mt-6 space-y-6">
                  <li className="flex items-start gap-4">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <p className="font-semibold text-navy">Office</p>
                      <p className="text-sm text-body/80">{ADDRESS}</p>
                      <CopyButton
                        value={ADDRESS}
                        label="Copy address"
                        className="mt-2"
                      />
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <p className="font-semibold text-navy">Email</p>
                      <a
                        href="mailto:info@TPi.or.tz"
                        className="text-sm text-body/80 hover:text-urban-blue"
                      >
                        info@TPi.or.tz
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <p className="font-semibold text-navy">Phone</p>
                      <a
                        href="tel:+255749778332"
                        className="block text-sm text-body/80 hover:text-urban-blue"
                      >
                        +255 749 778 332
                      </a>
                      <a
                        href="tel:+255784642290"
                        className="block text-sm text-body/80 hover:text-urban-blue"
                      >
                        +255 784 642 290
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <Globe className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <p className="font-semibold text-navy">Website</p>
                      <span className="text-sm text-body/80">www.TPi.or.tz</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <p className="font-semibold text-navy">Office hours</p>
                      <p className="text-sm text-body/80">
                        Monday – Friday, 8:00 – 17:00 (EAT)
                      </p>
                    </div>
                  </li>
                </ul>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-poverty-green px-5 py-3 font-medium text-white transition-colors hover:bg-poverty-green/90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-soft-bg pb-20 lg:pb-28">
        <div className="container-tpi">
          <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <iframe
              title="TPi Tanzania office location — Mikocheni, Dar es Salaam"
              src="https://www.google.com/maps?q=Mikocheni,Dar%20es%20Salaam,Tanzania&output=embed"
              width="100%"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full border-0"
            />
          </div>
        </div>
      </section>
    </>
  );
}
