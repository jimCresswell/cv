import { Metadata } from "next";
import { getMetadata } from "@/util/page-metadata";

/**
 * @todo Centralise page metadata creation
 */
export const metadata: Metadata = getMetadata({
  title: "Jim Cresswell",
  description: "Creative technologist, engineering leader, gardener",
});

export default function Home() {
  return <p>my lovely home page</p>;
}
