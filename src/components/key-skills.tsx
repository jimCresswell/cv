interface KeySkillsProps {
  skills: string[]
}

export function KeySkills({ skills }: KeySkillsProps) {
  return (
    <section aria-labelledby="key-skills-heading" className="print:my-1">
      <h2 id="key-skills-heading" className="text-2xl font-semibold mb-4 print:text-xl print:mb-2">
        Key Skills
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-3 gap-2 print:gap-1">
        {skills.map((skill, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2 text-primary print:mr-1 flex-shrink-0">•</span>
            <span>{skill}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

