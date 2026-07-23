import { galleryImages } from "../../data/eventsData";
import styles from "../page.module.css";

export default function EventGallerySection() {
  return (
    <section className={styles.gallerySection}>
      <h2 className={styles.sectionHeading}>Event Gallery</h2>

      <div className={styles.galleryLayout}>
        <div className={styles.galleryText}>
          <p className={styles.galleryDesc}>
            Catch the highlights and unforgettable moments from our past events.
            Browse through our created gallery of fragrance showcases, meetups,
            and exclusive product launches across Bangladesh and beyond.
          </p>
          <a href="#" className={styles.readMoreLink}>Read More &gt;</a>
        </div>

        <div className={styles.galleryGrid}>
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className={`${styles.galleryItem} ${
                idx === 0 ? styles.galleryItemLarge : ""
              }`}
            >
              <div className={styles.placeholderImageFill} aria-label={img.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
