"use client";

import Image from "next/image";
import { ourStoryData } from "../../data/ourStoryData";
import styles from "../../page.module.css";

export default function CreatorSection() {
  const { creator } = ourStoryData;

  return (
    <section className={styles.creatorSection} aria-labelledby="creator-heading">
      <div className={styles.creatorContainer}>
        <div className={styles.creatorTextCol}>
          <h1 id="creator-heading" className={styles.sectionHeadingLarge}>
            {creator.headingLine1}<br />{creator.headingLine2}
          </h1>
          <p className={styles.creatorParagraph}>
            {creator.paragraph}
          </p>
          <button
            type="button"
            className={styles.scrollDownBtn}
            onClick={() => {
              document.getElementById("journey-heading")?.scrollIntoView({ behavior: "smooth" });
            }}
            aria-label="Scroll down to next section"
          >
            {creator.buttonText} <span className={styles.arrowIcon}>˅</span>
          </button>
        </div>
        <div className={styles.creatorImageCol}>
          <div className={styles.creatorImageFrame} aria-label={creator.imageAlt}>
            <Image
              src={creator.image}
              alt={creator.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className={styles.creatorImage}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
