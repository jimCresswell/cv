import { Header } from "@/components/header";
import { ExecutiveSummary } from "@/components/executive-summary";
import { KeySkills } from "@/components/key-skills";
import { Experience } from "@/components/experience";
import { Education } from "@/components/education";
import { Interests } from "@/components/interests";
import { CVData } from "@/data/cv-data";

export function CVContent({ data }: { data: CVData }) {
  return (
    <div className="space-y-8 print:space-y-4">
      <Header
        name={data.header.name}
        title={data.header.title}
        email={data.header.email}
        linkedin={data.header.linkedin}
        github={data.header.github}
        website={data.header.website}
        location={data.header.location}
      />

      <ExecutiveSummary paragraphs={data.executive_summary} />

      <KeySkills skills={data.key_skills} />

      <Experience experience={data.experience} />

      <Education education={data.education} />

      <Interests paragraphs={data.interests} />
    </div>
  );
}
