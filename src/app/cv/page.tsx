import { Metadata } from "next";

import { CVContent } from "@/components/cv-content";
import cvData from "@/data/cv-data";

export const metadata: Metadata = {
  title: "Jim Cresswell | Hands-On Engineering Leadership",
  description: "CV of Jim Cresswell, Hands-On Engineering Leader",
};

export default function CV() {
  return <CVContent data={cvData} />;
}
