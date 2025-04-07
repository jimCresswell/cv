interface ExecutiveSummaryProps {
  paragraphs: string[]
}

export function ExecutiveSummary({ paragraphs }: ExecutiveSummaryProps) {
  return (
    <section aria-labelledby="executive-summary-heading" className="print:my-1">
      <h2 id="executive-summary-heading" className="text-2xl font-semibold mb-4 print:text-xl print:mb-2">
        Executive Summary
      </h2>
      <div className="space-y-4 print:space-y-2">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed print:leading-tight">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  )
}

