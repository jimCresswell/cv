import { ExternalLink } from "lucide-react";
import { JSX } from "react";

interface Role {
  title: string;
  dates: string;
  description_paragraphs: readonly string[];
}

interface ExperienceItem {
  company: string;
  website?: string;
  roles: readonly Role[];
}

interface ExperienceProps {
  experience: readonly ExperienceItem[];
}

// Function to format website URL for display
function formatWebsiteForDisplay(url: string): string {
  try {
    // Special case for Obaith
    if (url.includes("obaith.com")) {
      return "obaith.com";
    }

    // Handle archive.org URLs specially
    if (url.includes("web.archive.org")) {
      // Extract the original URL from the archive.org URL
      const originalUrl = url.match(
        /https?:\/\/web\.archive\.org\/web\/\d+\/(https?:\/\/[^/]+)/
      )?.[1];
      if (originalUrl) {
        const urlObj = new URL(originalUrl);
        const domain = urlObj.hostname.replace(/^www\./, "");
        const path = urlObj.pathname !== "/" ? urlObj.pathname : "";
        return domain + path;
      }
    }

    // Handle normal URLs
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace(/^www\./, "");
    const path = urlObj.pathname !== "/" ? urlObj.pathname : "";
    return domain + path;
  } catch (error: unknown) {
    throw new TypeError(`Invalid URL: ${url}`, { cause: error });
  }
}

// Improved helper function to process text with links
function processText(text: string) {
  if (!text) return "";

  // Special case for Google Scholar link
  if (text.includes("[Google Scholar]")) {
    const googleScholarRegex = /\[Google Scholar\]$$([^)]+)$$/;
    const match = text.match(googleScholarRegex);

    if (match && match[1]) {
      const url = match[1];
      const parts = text.split(googleScholarRegex);

      return (
        <>
          {parts[0]}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Scholar
          </a>
          {parts[2] || ""}
        </>
      );
    }
  }

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

export function Experience({ experience }: ExperienceProps) {
  return (
    <section aria-labelledby="experience-heading" className="print:my-1">
      <h2
        id="experience-heading"
        className="text-2xl font-semibold mb-6 print:text-xl print:mb-2"
      >
        Professional Experience
      </h2>

      <div className="space-y-10 print:space-y-4">
        {experience.map((item, index) => (
          <div key={index} className="space-y-6 print:space-y-2">
            <div className="flex flex-col">
              <h3 className="text-xl font-medium print:mb-1 flex items-center">
                {item.company}
                {item.website && (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center ml-2 text-primary hover:text-primary/80 print:hidden"
                    aria-label={`${item.company} website`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </h3>
              {item.website && (
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary mt-1 print:hidden"
                >
                  {formatWebsiteForDisplay(item.website)}
                </a>
              )}
            </div>

            <div className="space-y-6 print:space-y-3">
              {item.roles.map((role, roleIndex) => (
                <div
                  key={roleIndex}
                  className="border-l-2 border-muted pl-4 space-y-2 print:pl-2 print:space-y-1"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                    <h4 className="text-lg font-medium">{role.title}</h4>
                    <span className="text-sm text-muted-foreground">
                      {role.dates}
                    </span>
                  </div>

                  <div className="space-y-3 print:space-y-1">
                    {role.description_paragraphs.map((paragraph, paraIndex) => (
                      <p
                        key={paraIndex}
                        className="text-base leading-relaxed print:leading-tight"
                      >
                        {processText(paragraph)}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
