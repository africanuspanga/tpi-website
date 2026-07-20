"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MobileMenuProps {
  items: { label: string; href: string }[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="h-6 w-6 text-navy" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm bg-white">
        <div className="flex flex-col h-full pt-8">
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-lg font-semibold uppercase tracking-wide text-navy py-3 border-b border-border/60 hover:text-urban-blue transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto pb-8">
            <Button
              asChild
              className="w-full bg-navy hover:bg-navy/90 text-white"
              onClick={() => setOpen(false)}
            >
              <Link href="/get-involved">Partner With TPi</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
