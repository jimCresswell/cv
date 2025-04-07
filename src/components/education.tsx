interface Thesis {
  title: string;
  link: string;
}

interface EducationItem {
  institution: string;
  degree: string;
  dates: string;
  thesis?: Thesis;
}

interface EducationProps {
  education: readonly EducationItem[];
}

export function Education({ education }: EducationProps) {
  return (
    <section aria-labelledby="education-heading" className="print:my-1">
      <h2
        id="education-heading"
        className="text-2xl font-semibold mb-4 print:text-xl print:mb-2"
      >
        Education
      </h2>
      <div className="space-y-6 print:space-y-3">
        {education.map((item, index) => (
          <div
            key={index}
            className="border-l-2 border-muted pl-4 space-y-2 print:pl-2 print:space-y-1"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
              <h3 className="text-lg font-medium">{item.institution}</h3>
              <span className="text-sm text-muted-foreground">
                {item.dates}
              </span>
            </div>
            <p className="text-base print:mb-0">{item.degree}</p>
            {item.thesis && (
              <p className="text-sm print:mt-0">
                Thesis:{" "}
                <a
                  href={item.thesis.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {item.thesis.title}
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
