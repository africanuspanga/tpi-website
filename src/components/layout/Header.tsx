import Link from "next/link";
import Image from "next/image";
import { MobileMenu } from "./MobileMenu";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "What We Do", href: "/what-we-do" },
  { label: "Resources", href: "/resources" },
  { label: "Events", href: "/events" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-tpi flex h-24 items-center justify-between">
        {/* Left: primary navigation (desktop) + menu trigger (mobile) */}
        <div className="flex items-center gap-8">
          <MobileMenu items={navItems} />
          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold uppercase tracking-wide text-body/80 transition-colors hover:text-navy"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: logo */}
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="flex items-center"
            aria-label="TPi Tanzania — home"
          >
            <Image
              src="/tpi-logo.png"
              alt="TPi Tanzania"
              width={1448}
              height={1086}
              className="h-16 w-auto object-contain md:h-20"
              priority
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
