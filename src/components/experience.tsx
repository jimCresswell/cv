import { ExternalLink } from "lucide-react";

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

interface ExperienceProperties {
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
      const originalUrl = /https?:\/\/web\.archive\.org\/web\/\d+\/(https?:\/\/[^/]+)/.exec(
        url,
      )?.[1];
      if (originalUrl) {
        const urlObject = new URL(originalUrl);
        const domain = urlObject.hostname.replace(/^www\./, "");
        const path = urlObject.pathname === "/" ? "" : urlObject.pathname;
        return domain + path;
      }
    }

    // Handle normal URLs
    const urlObject = new URL(url);
    const domain = urlObject.hostname.replace(/^www\./, "");
    const path = urlObject.pathname === "/" ? "" : urlObject.pathname;
    return domain + path;
  } catch (error: unknown) {
    throw new TypeError(`Invalid URL: ${url}`, { cause: error });
  }
}

/**
 * Process text to handle markdown-style links
 *
 * @todo Implement markdown-style link processing
 *
 * @param text - The text to process
 * @returns The processed text
 */
function processText(text: string) {
  return text;
}

export function Experience({ experience }: Readonly<ExperienceProperties>) {
  return (
    <section aria-labelledby="experience-heading" className="print:my-1">
      <h2 id="experience-heading" className="text-2xl font-semibold mb-6 print:text-xl print:mb-2">
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
                    <span className="text-sm text-muted-foreground">{role.dates}</span>
                  </div>

                  <div className="space-y-3 print:space-y-1">
                    {role.description_paragraphs.map((paragraph, paraIndex) => (
                      <p key={paraIndex} className="text-base leading-relaxed print:leading-tight">
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
