import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./MobileMenu";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "What We Do", href: "/what-we-do" },
  { label: "Projects", href: "/projects" },
  { label: "Impact", href: "/impact" },
  { label: "Resources", href: "/resources" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-tpi flex h-20 items-center justify-between">
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
            className="h-14 w-auto object-contain md:h-16"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-body/80 transition-colors hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            asChild
            className="hidden sm:inline-flex bg-navy hover:bg-navy/90 text-white"
          >
            <Link href="/get-involved">Partner With TPi</Link>
          </Button>
          <MobileMenu items={navItems} />
        </div>
      </div>
    </header>
  );
}
