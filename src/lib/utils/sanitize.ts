import DOMPurify from "dompurify";

export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") {
    // Server-side: DOMPurify needs a window. Return plain text or use isomorphic-dompurify.
    // For server rendering we strip tags to be safe.
    return html.replace(/<[^>]*>/g, "");
  }
  return DOMPurify.sanitize(html, {
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
  });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}
