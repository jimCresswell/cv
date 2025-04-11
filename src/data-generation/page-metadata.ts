import type { Metadata } from "next";

import { getIconMetadata } from "./icon";

export function getMetadata({
  title = "Jim Cresswell",
  description = "Creative technologist, engineering leader, gardener",
}: {
  title: string;
  description: string;
}): Metadata {
  const icons = getIconMetadata();
  return {
    title,
    description,
    icons,
  };
}
