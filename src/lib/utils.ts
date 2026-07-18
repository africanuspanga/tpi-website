import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { isValidElement, type ReactElement, type ReactNode } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Bridges the shadcn-style `asChild` API onto base-ui's `render` prop.
 * When `asChild` is set and `children` is a single element, that element is
 * returned as `render` (so base-ui renders *as* it) and `children` is cleared.
 */
export function resolveAsChild(
  asChild: boolean | undefined,
  render: unknown,
  children: ReactNode
): { render: ReactElement | undefined; children: ReactNode } {
  if (asChild && isValidElement(children)) {
    return { render: children as ReactElement, children: undefined }
  }
  return { render: render as ReactElement | undefined, children }
}
