import type { Metadata } from "next";

import { CVContent } from "@/components/cv-content";
import cvData from "@/data/cv-data";
import { getMetadata } from "@/data-generation/page-metadata";

export const metadata: Metadata = getMetadata({
  title: "Jim Cresswell | Hands-On Engineering Leadership",
  description: "CV of Jim Cresswell, Hands-On Engineering Leader",
});

export default function CV() {
  return <CVContent data={cvData} />;
}
