// src/components/skip-to-content-link.tsx
import Link from "next/link";

import { cn } from "@/lib/shared/utilities";

/**
 * A link that allows keyboard users to quickly skip past navigation
 * to the main content area of the page.
 *
 * It is visually hidden by default but becomes visible when focused.
 */
export function SkipToContentLink() {
  return (
    <Link
      href="#main-content"
      className={cn(
        "absolute left-4 top-4 z-50 block -translate-y-12 transform rounded-md",
        "bg-background px-4 py-2 text-sm font-medium text-foreground shadow-md transition-transform duration-300",
        "focus:translate-y-0",
        // sr-only alternative: visually hide but keep accessible
        "h-[1px] w-[1px] overflow-hidden whitespace-nowrap",
        "focus:clip-auto focus:h-auto focus:w-auto focus:overflow-visible focus:whitespace-normal",
      )}
    >
      Skip to main content
    </Link>
  );
}
