import { ourStoryData } from "../../data/ourStoryData";
import styles from "../../page.module.css";

export default function BehindBrandSection() {
  const { behindBrand } = ourStoryData;

  return (
    <section className={styles.behindSection} aria-labelledby="behind-heading">
      <div className={styles.behindContainer}>
        <h2 id="behind-heading" className={styles.behindHeading}>
          {behindBrand.heading}
        </h2>

        <div className={styles.behindGrid}>
          {behindBrand.cards.map((card) => (
            <div key={card.number} className={styles.behindCard}>
              <div className={styles.cardNumber}>{card.number}</div>
              <div className={styles.cardContent}>
                <h4 className={styles.cardTitle}>{card.title}</h4>
                <p className={styles.cardDesc}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.behindFooterTextRow}>
          <p className={styles.behindFooterText}>
            {behindBrand.footerText}
          </p>
        </div>
      </div>
    </section>
  );
}
