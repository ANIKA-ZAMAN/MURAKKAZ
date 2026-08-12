"use client";

import Image from "next/image";
import { ourStoryData } from "../../data/ourStoryData";
import styles from "./CreatorSection.module.css";

export default function CreatorSection() {
  const { creator } = ourStoryData;

  return (
    <section className={styles.creatorSection} aria-labelledby="creator-heading">
      <div className={styles.creatorContainer}>
        {/* Left Column: Creator Story & Call to Action */}
        <div className={styles.creatorTextCol}>
          <span className={styles.creatorSubheading}>{creator.headingLine1}</span>
          <h1 id="creator-heading" className={styles.creatorMainHeading}>
            {creator.headingLine2}
          </h1>
          <p className={styles.creatorParagraph}>{creator.paragraph}</p>
          <button
            type="button"
            className={styles.scrollDownBtn}
            onClick={() => {
              document
                .getElementById("journey-heading")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            aria-label="Scroll down to next section"
          >
            {creator.buttonText} <span className={styles.arrowIcon}>˅</span>
          </button>
        </div>

        {/* Right Column: Framed Creator Photo */}
        <div className={styles.creatorImageCol}>
          <div className={styles.creatorImageFrame} aria-label={creator.imageAlt}>
            <Image
              src={creator.image}
              alt={creator.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 480px"
              className={styles.creatorImage}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
