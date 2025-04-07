import { JSX } from "react";

interface InterestsProps {
  paragraphs: readonly string[];
}

// Improved helper function to process text with links
function processText(text: string) {
  if (!text) return "";

  // Regular expression to find markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]$$([^)]+)$$/g;

  // Check if there are any links in the text
  if (!linkRegex.test(text)) {
    return text;
  }

  // Reset the regex lastIndex
  linkRegex.lastIndex = 0;

  // Split the text into parts (text and links)
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add the link
    const [fullMatch, linkText, linkUrl] = match;
    parts.push(
      <a
        key={match.index}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        {linkText}
      </a>
    );

    lastIndex = match.index + fullMatch.length;
  }

  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

export function Interests({ paragraphs }: InterestsProps) {
  return (
    <section aria-labelledby="interests-heading" className="print:my-1">
      <h2
        id="interests-heading"
        className="text-2xl font-semibold mb-4 print:text-xl print:mb-2"
      >
        Interests & Personal Projects
      </h2>
      <div className="space-y-4 print:space-y-2">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-base leading-relaxed print:leading-tight"
          >
            {processText(paragraph)}
          </p>
        ))}
      </div>
    </section>
  );
}
