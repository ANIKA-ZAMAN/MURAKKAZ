import Link from "next/link";
import Image from "next/image";
import { ourStoryData } from "../../data/ourStoryData";
import styles from "../../page.module.css";

export default function EventGallerySection() {
  const { gallery } = ourStoryData;

  const images = [
    { src: "/images/events/event_gallery_1.jpg", alt: "Live Olfactory Station", class: styles.itemShort },
    { src: "/images/events/event_gallery_2.jpg", alt: "Luxury Pop-up Stall", class: styles.itemTall },
    { src: "/images/events/event_gallery_3.jpg", alt: "Autumn Scent Soirée", class: styles.itemTall },
    { src: "/images/events/event_gallery_4.jpg", alt: "Private Masterclass", class: styles.itemShort },
  ];

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
                <Image
                  src={images[0].src}
                  alt={images[0].alt}
                  fill
                  sizes="300px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={`${styles.galleryGridItem} ${styles.itemTall}`} aria-label="Event gallery photo 2">
                <Image
                  src={images[1].src}
                  alt={images[1].alt}
                  fill
                  sizes="300px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className={styles.galleryColumn}>
              <div className={`${styles.galleryGridItem} ${styles.itemTall}`} aria-label="Event gallery photo 3">
                <Image
                  src={images[2].src}
                  alt={images[2].alt}
                  fill
                  sizes="300px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={`${styles.galleryGridItem} ${styles.itemShort}`} aria-label="Event gallery photo 4">
                <Image
                  src={images[3].src}
                  alt={images[3].alt}
                  fill
                  sizes="300px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
