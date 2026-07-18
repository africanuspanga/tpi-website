"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "255749778332";
const PREFILL = encodeURIComponent(
  "Hello TPi Tanzania, I would like to know more about your work."
);

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.16c-.24.68-1.42 1.32-1.95 1.36-.5.05-.5.4-3.16-.66-2.66-1.05-4.32-3.78-4.45-3.96-.13-.18-1.06-1.41-1.06-2.69 0-1.28.67-1.91.9-2.17.24-.26.53-.33.7-.33l.5.01c.16 0 .38-.06.59.45.24.58.8 2 .87 2.15.07.14.12.31.02.5-.09.18-.14.29-.28.45-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.72 1.18 1.54 1.91 1.06.94 1.95 1.24 2.23 1.38.28.14.44.12.6-.07.16-.19.7-.81.89-1.09.18-.28.37-.23.62-.14.25.09 1.61.76 1.89.9.28.14.46.21.53.32.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}

/**
 * Global floating WhatsApp button with a gentle attention pulse and an
 * expandable label. Appears on all public pages, bottom-right.
 */
export function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);

  // Avoid an SSR/CSR flash of the entrance animation.
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 transition-all duration-500 sm:bottom-7 sm:right-7 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${PREFILL}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with TPi on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40 motion-reduce:hidden" />
        <WhatsAppGlyph className="relative h-7 w-7" />

        {/* Expanding label */}
        <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-full bg-navy px-4 py-2 text-sm font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 sm:block">
          Chat with us
        </span>
      </a>
    </div>
  );
}
