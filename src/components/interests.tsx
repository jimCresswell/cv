import React from "react";

import { markdownLinksToNextLinks } from "../content-manipulation/text-processing";

interface InterestsProperties {
  paragraphs: readonly string[];
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
            {markdownLinksToNextLinks(paragraph)}
          </p>
        ))}
      </div>
    </section>
  );
}
