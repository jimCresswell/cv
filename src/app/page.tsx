import type { Metadata } from "next";

import { getMetadata } from "@/data-generation/page-metadata";

export const metadata: Metadata = getMetadata({
  title: "Jim Cresswell",
  description: "Creative technologist, engineering leader, gardener",
});

export default function Home() {
  return <p>my lovely home page</p>;
}
