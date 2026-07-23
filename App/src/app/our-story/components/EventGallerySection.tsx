import Link from "next/link";
import { ourStoryData } from "../../data/ourStoryData";
import styles from "../../page.module.css";

export default function EventGallerySection() {
  const { gallery } = ourStoryData;

  return (
    <section className={styles.gallerySection} aria-labelledby="gallery-heading">
      <div className={styles.galleryContainer}>
        <div className={styles.galleryLeftCol}>
          <h2 id="gallery-heading" className={styles.galleryHeading}>
            {gallery.heading}
          </h2>
          <p className={styles.galleryParagraph}>
            {gallery.paragraph}
          </p>
          <Link href={gallery.buttonLink} className={styles.exploreBtn} aria-label="Explore more events">
            {gallery.buttonText} <span className={styles.exploreArrow}>↗</span>
          </Link>
        </div>

        <div className={styles.galleryRightCol}>
          <div className={styles.galleryGrid}>
            <div className={styles.galleryColumn}>
              <div className={`${styles.galleryGridItem} ${styles.itemShort}`} aria-label="Event gallery photo 1">
                <div className={styles.darkMockPhoto} />
              </div>
              <div className={`${styles.galleryGridItem} ${styles.itemTall}`} aria-label="Event gallery photo 2">
                <div className={styles.darkMockPhoto} />
              </div>
            </div>
            <div className={styles.galleryColumn}>
              <div className={`${styles.galleryGridItem} ${styles.itemTall}`} aria-label="Event gallery photo 3">
                <div className={styles.darkMockPhoto} />
              </div>
              <div className={`${styles.galleryGridItem} ${styles.itemShort}`} aria-label="Event gallery photo 4">
                <div className={styles.darkMockPhoto} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
