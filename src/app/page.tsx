import type { Metadata } from "next";

import "@/app/retro.css";
import cvData from "@/data/cv-data";
import { getMetadata } from "@/data-generation/page-metadata";

export const metadata: Metadata = getMetadata({
  title: "Jim Cresswell",
  description: "Creative technologist, engineering leader, gardener",
});

const OriginalHomePage = () => {
  return (
    <article id="me" itemScope itemType="https://data-vocabulary.org/Person">
      <h1 id="main-title" className="mainlink">
        <a href={cvData.header.linkedin}>
          <span id="s0">@</span>
          <span id="s1">J</span>
          <span id="s2">i</span>
          <span id="s3">m</span>
          <span id="s4">C</span>
          <span id="s5">r</span>
          <span id="s6">e</span>
          <span id="s7">s</span>
          <span id="s8">s</span>
          <span id="s9">w</span>
          <span id="s10">e</span>
          <span id="s11">l</span>
          <span id="s12">l</span>
        </a>
      </h1>
      <section className="description">
        <p>
          My name is <span itemProp="name">Jim Cresswell</span>. I am an
          <span itemProp="role">entrepreneur</span> trying to apply small changes to potential
          systemic tipping points in order to bring about positive big impacts in climate change,
          biodiversity and social equity.
        </p>
        <p>
          I have a background in technology, science, public services and digital products. Here is
          my <a href={cvData.header.cv}>CV</a> and here I am on{" "}
          <a href={cvData.header.linkedin}>LinkedIn</a> and{" "}
          <a href={cvData.header.github}>GitHub</a>.
        </p>
        <p>
          Here are my
          <a href={cvData.header.googleScholar}>published papers</a> as a
          <a href="https://en.wikipedia.org/wiki/Physical_cosmology">cosmologist</a>.
        </p>
      </section>
    </article>
  );
};

export default function Home() {
  return <OriginalHomePage />;
}
