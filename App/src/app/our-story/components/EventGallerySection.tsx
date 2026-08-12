import Link from "next/link";
import Image from "next/image";
import { ourStoryData } from "../../data/ourStoryData";
import { galleryImages } from "../../data/eventsData";
import styles from "../../page.module.css";

export default function EventGallerySection() {
  const { gallery } = ourStoryData;
  const items = galleryImages.slice(0, 4);

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
              {items.slice(0, 2).map((img, idx) => (
                <div 
                  key={idx} 
                  className={`${styles.galleryGridItem} ${idx % 2 === 0 ? styles.itemShort : styles.itemTall}`} 
                  aria-label={img.alt}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="300px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
            <div className={styles.galleryColumn}>
              {items.slice(2, 4).map((img, idx) => (
                <div 
                  key={idx} 
                  className={`${styles.galleryGridItem} ${idx % 2 === 0 ? styles.itemTall : styles.itemShort}`} 
                  aria-label={img.alt}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="300px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
