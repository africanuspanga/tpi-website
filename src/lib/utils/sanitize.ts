import DOMPurify from "dompurify";

const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "a",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "blockquote",
  ],
  ALLOWED_ATTR: ["href", "title", "target", "rel"],
};

export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") {
    // Server-side: DOMPurify needs a DOM, and this project has no server-side
    // DOM implementation (no jsdom / isomorphic-dompurify in dependencies).
    // Fall back to a best-effort removal of active content that preserves
    // benign markup. This is NOT a complete HTML sanitizer — installing
    // isomorphic-dompurify would let the server path use real DOMPurify.
    return sanitizeHtmlServer(html);
  }
  return DOMPurify.sanitize(html, PURIFY_CONFIG);
}

function sanitizeHtmlServer(html: string): string {
  let out = html;
  // Drop active/embedding elements and their contents. Loop until stable so
  // nested injection tricks (e.g. <scr<script>ipt>) are fully removed.
  let prev: string;
  do {
    prev = out;
    out = out.replace(
      /<(script|style|iframe|object|embed|form|svg|math|link|meta|base)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
      ""
    );
    out = out.replace(
      /<(script|style|iframe|object|embed|form|svg|math|link|meta|base)\b[^>]*\/?>/gi,
      ""
    );
  } while (out !== prev);
  // Strip inline event handlers (onclick=..., onerror=..., ...).
  out = out.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  // Neutralize javascript:/vbscript: URLs in href/src attributes.
  out = out.replace(
    /(href|src)\s*=\s*(["']?)\s*(javascript|vbscript)\s*:[^"'>\s]*\2/gi,
    '$1="#"'
  );
  // Strip HTML comments.
  out = out.replace(/<!--[\s\S]*?-->/g, "");
  return out;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}
