import Link from "next/link";
import type React from "react";

import { logger } from "@/lib/shared/logging";

/**
 * Converts markdown-style links in a string into Next.js Link components.
 *
 * The link must be in the form [text](url), no other formats are supported.
 * The text is returned as an array of ReactNodes, with markdown links
 * converted to NextJS Link components targeting external URLs.
 *
 * @example
 * ```typescript
 * markdownLinksToNextLinks("[Example](https://example.com)");
 * // Returns [<Link href="https://example.com" target="_blank" rel="noopener noreferrer">Example</Link>]
 * ```
 * @example
 * ```typescript
 * markdownLinksToNextLinks("Some prior text [Example1](https://example.com) and [Example2](https://example.com) after");
 * // Returns ["Some prior text ", <Link href="https://example.com" ...>Example1</Link>, " and ", <Link href="https://example.com" ...>Example2</Link>, " after"]
 * ```
 *
 * @example
 * ```typescript
 * markdownLinksToNextLinks("Just some ordinary text");
 * // Returns ["Just some ordinary text"]
 * ```
 *
 * @param text - The text containing markdown links.
 * @returns An array of React.ReactNode elements (strings and Link components).
 *
 * @throws {TypeError} If the text is not a non-empty string.
 */
export function markdownLinksToNextLinks(text: string): React.ReactNode[] {
  if (typeof text !== "string" || text.length === 0) {
    throw new TypeError(`markdownLinksToNextLinks: Invalid text supplied: ${text}`);
  }

  // Guard against super-linear runtime regex DoS
  if (text.length > 1_000_000) {
    logger.warn(`markdownLinksToNextLinks: Text too long, possible DoS: ${text}`);
    return [text];
  }
  // eslint-disable-next-line sonarjs/slow-regex
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  const matches = text.matchAll(linkRegex);
  for (const match of matches) {
    if (match.length < 3) {
      continue;
    }
    const fullMatch = match[0];
    const linkText = match[1];
    const url = match[2];
    const index = match.index;

    // Add text segment before the link
    if (index > lastIndex) {
      result.push(text.substring(lastIndex, index));
    }

    // Only process https links, warn for http
    if (url.startsWith("https://")) {
      result.push(
        <Link key={url + index} href={url} target="_blank" rel="noopener noreferrer">
          {linkText}
        </Link>,
      );
    } else if (url.startsWith("http://")) {
      logger.warn(
        `markdownLinksToNextLinks: Found non-secure link (http): ${url}. Leaving as plain text.`,
      );
      // Add the original full match as plain text if it's http
      result.push(fullMatch);
    } else {
      // Should not happen with the current regex, but handle defensively
      result.push(fullMatch);
    }

    lastIndex = index + fullMatch.length; // Update lastIndex
  }

  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }

  if (result.length === 0 && lastIndex === 0) {
    return [text];
  }

  return result;
}
