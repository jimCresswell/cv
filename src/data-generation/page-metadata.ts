import type { Metadata } from "next";

export function getMetadata({
  title = "Jim Cresswell",
  description = "Creative technologist, engineering leader, gardener",
}: {
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
  };
}
