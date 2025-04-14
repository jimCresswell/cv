import type { Metadata } from "next";
import Link from "next/link";

import cvData from "@/data/cv-data";
import { getMetadata } from "@/data-generation/page-metadata";

import styles from "./home-page.module.css";

export const metadata: Metadata = getMetadata({
  title: "Jim Cresswell",
  description: "Creative technologist, engineering leader, gardener",
});

const OriginalHomePage = () => {
  return (
    <article className={styles.me} itemScope itemType="https://data-vocabulary.org/Person">
      <h1 className={styles.mainTitle}>
        <a href={cvData.header.linkedin}>
          <span className={styles.s0}>@</span>
          <span className={styles.s1}>J</span>
          <span className={styles.s2}>i</span>
          <span className={styles.s3}>m</span>
          <span className={styles.s4}>C</span>
          <span className={styles.s5}>r</span>
          <span className={styles.s6}>e</span>
          <span className={styles.s7}>s</span>
          <span className={styles.s8}>s</span>
          <span className={styles.s9}>w</span>
          <span className={styles.s10}>e</span>
          <span className={styles.s11}>l</span>
          <span className={styles.s12}>l</span>
        </a>
      </h1>
      <section className="description">
        <p>
          My name is <span itemProp="name">Jim Cresswell</span>. I am an{" "}
          <span itemProp="role">entrepreneur</span> trying to apply small changes to potential
          systemic tipping points in order to bring about positive big impacts in climate change,
          biodiversity and social equity.
        </p>
        <p>
          I have a background in technology, science, public services and digital products. Here is{" "}
          my{" "}
          <Link href="/cv" className="text-primary hover:underline underline-offset-4">
            CV
          </Link>{" "}
          and here I am on{" "}
          <a
            href={cvData.header.linkedin}
            className="text-primary hover:underline underline-offset-4"
          >
            LinkedIn
          </a>{" "}
          and{" "}
          <a
            href={cvData.header.github}
            className="text-primary hover:underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
        <p>
          Here are my{" "}
          <a
            href={cvData.header.googleScholar}
            className="text-primary hover:underline underline-offset-4"
          >
            published papers
          </a>{" "}
          as a{" "}
          <a
            href="https://en.wikipedia.org/wiki/Physical_cosmology"
            className="text-primary hover:underline underline-offset-4"
          >
            cosmologist
          </a>
          .
        </p>
      </section>
    </article>
  );
};

export default function Home() {
  return <OriginalHomePage />;
}
