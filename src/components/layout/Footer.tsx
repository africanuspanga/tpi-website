import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  FacebookIcon,
  XIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/ui/SocialIcons";

const footerLinks = {
  organization: [
    { label: "About TPi", href: "/about" },
    { label: "What We Do", href: "/what-we-do" },
    { label: "Our Team", href: "/about#team" },
    { label: "Partners", href: "/partners" },
  ],
  work: [
    { label: "Projects", href: "/projects" },
    { label: "Impact", href: "/impact" },
    { label: "Resources", href: "/resources" },
    { label: "News", href: "/news" },
  ],
  engage: [
    { label: "Get Involved", href: "/get-involved" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/contact?enquiry=Careers" },
    { label: "Media Enquiries", href: "/contact?enquiry=Media%20enquiry" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use", href: "/terms-of-use" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-tpi py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="mb-6 inline-flex"
              aria-label="TPi Tanzania — home"
            >
              <span className="inline-flex rounded-2xl bg-white p-3 shadow-sm">
                <Image
                  src="/tpi-logo.png"
                  alt="TPi Tanzania"
                  width={1448}
                  height={1086}
                  className="h-16 w-auto object-contain"
                />
              </span>
            </Link>
            <p className="text-white/80 leading-relaxed max-w-sm mb-6">
              Advancing inclusive urban transformation, poverty reduction and
              climate resilience across Tanzania.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: FacebookIcon, label: "Facebook" },
                { Icon: XIcon, label: "X (Twitter)" },
                { Icon: LinkedinIcon, label: "LinkedIn" },
                { Icon: YoutubeIcon, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white hover:text-navy transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4 text-white">Organization</h4>
            <ul className="space-y-3">
              {footerLinks.organization.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4 text-white">Our Work</h4>
            <ul className="space-y-3">
              {footerLinks.work.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4 text-white">Engage</h4>
            <ul className="space-y-3">
              {footerLinks.engage.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
                <span>21 Taasisi, Mikocheni, P.O. Box 4161, Dar es Salaam, Tanzania</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <a href="mailto:info@TPi.or.tz" className="hover:text-white">
                  info@TPi.or.tz
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <a href="tel:+255749778332" className="hover:text-white">
                  +255 749 778 332
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} TPi Tanzania. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
