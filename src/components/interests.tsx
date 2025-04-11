interface InterestsProperties {
  paragraphs: readonly string[];
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

export function Interests({ paragraphs }: Readonly<InterestsProperties>) {
  return (
    <section aria-labelledby="interests-heading" className="print:my-1">
      <h2 id="interests-heading" className="text-2xl font-semibold mb-4 print:text-xl print:mb-2">
        Interests & Personal Projects
      </h2>
      <div className="space-y-4 print:space-y-2">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed print:leading-tight">
            {processText(paragraph)}
          </p>
        ))}
      </div>
    </section>
  );
}
