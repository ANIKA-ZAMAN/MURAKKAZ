import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";

export default function OurStoryPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* ========================================== */}
        {/* SECTION 1: The Curator: Meet Murakkaz      */}
        {/* ========================================== */}
        <section className={styles.curatorSection} aria-labelledby="curator-heading">
          <div className={styles.curatorContainer}>
            <div className={styles.curatorTextCol}>
              <h1 id="curator-heading" className={styles.sectionHeadingLarge}>
                The Curator: Meet<br />Murakkaz
              </h1>
              <p className={styles.curatorParagraph}>
                I didn&apos;t start Murakkaz to just sell bottles of perfume. I started
                it to combine memories, heritage, and design, and wood sillage
                luxury—making it unavoidable for our fragrance lovers in
                Bangladesh and other fields we keep working on. Every scent is
                hand-picked, every detail is handled by my personal view.
              </p>
            </div>
            <div className={styles.curatorImageCol}>
              <div className={styles.imagePlaceholder} aria-label="Portrait of the Curator">
                <Image
                  src="/images/events/sadid.jpg"
                  alt="The Curator of Murakkaz"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className={styles.responsiveImage}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION 2: Journey For The Love Of Fragrance */}
        {/* ========================================== */}
        <section className={styles.journeySection} aria-labelledby="journey-heading">
          <div className={styles.journeyContainer}>
            <h2 id="journey-heading" className={styles.sectionHeadingLarge}>
              Journey For The Love Of<br />Fragrance
            </h2>

            <div className={styles.journeyIntroRow}>
              <div className={styles.journeyIntroText}>
                <h3 className={styles.journeyIntroTitle}>
                  From an Obsession to curated fragrances.
                </h3>
                <p className={styles.journeyIntroDesc}>
                  My obsession with fragrance started with a simple question: Why
                  should world-class luxury scents only belong to the pricing
                  premium designer price tag?
                </p>
              </div>
            </div>

            <div className={styles.journeyBigImageWrap}>
              <div className={styles.bigImagePlaceholder} aria-label="Olfactory blending process image">
                <div className={styles.mockPhotoOverlay}>
                  <span>Olfactory Journey</span>
                </div>
              </div>
            </div>

            <div className={styles.journeyDetailsRow}>
              <div className={styles.journeyDetailsCol}>
                <p className={styles.journeyDetailParagraph}>
                  I spent years studying the complex olfactory pyramids—learning
                  how to work with fresh top notes, deep, woody souls, and rich
                  sillage to find details in a crowded market.
                </p>
                <p className={styles.journeyDetailParagraph}>
                  Murakkaz was born out of a relentless search for ingredients
                  that best fit the tropical Bangladeshi climate. I reject
                  hundreds of formulations, just to finalize the one that
                  carries my personal signature. When you wear a Murakkaz
                  fragrance, you are wearing my definition of luxury.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* SECTION 3: Behind The Brand                */}
        {/* ========================================== */}
        <section className={styles.behindSection} aria-labelledby="behind-heading">
          <div className={styles.behindContainer}>
            <h2 id="behind-heading" className={styles.behindHeading}>
              Behind The Brand
            </h2>

            <div className={styles.behindGrid}>
              <div className={styles.behindCard}>
                <div className={styles.cardNumber}>01</div>
                <div className={styles.cardContent}>
                  <h4 className={styles.cardTitle}>Sourced Globally, Matured Locally</h4>
                  <p className={styles.cardDesc}>
                    We import high-grade perfume oil globally and dry-mix it in
                    Bangladesh, making it ideal for our tropical weather. Each formula
                    is hand-crafted and batch-matured.
                  </p>
                </div>
              </div>

              <div className={styles.behindCard}>
                <div className={styles.cardNumber}>02</div>
                <div className={styles.cardContent}>
                  <h4 className={styles.cardTitle}>The Founder&apos;s Soul</h4>
                  <p className={styles.cardDesc}>
                    Not only do we import bottle formulations, we develop them from
                    scratch. Each bottle is a canvas for art, representing our
                    heritage and luxury.
                  </p>
                </div>
              </div>

              <div className={styles.behindCard}>
                <div className={styles.cardNumber}>03</div>
                <div className={styles.cardContent}>
                  <h4 className={styles.cardTitle}>Honest Premium Pricing</h4>
                  <p className={styles.cardDesc}>
                    We believe high-quality fragrance shouldn&apos;t cost a fortune.
                    By removing middle-men, we bring you premium fragrances at a
                    fraction of the cost.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.behindFooterTextRow}>
              <p className={styles.behindFooterText}>
                Not only made in Bangladesh, MATURED in here.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================== */}
      {/* SECTION 4: Event Gallery (Dark Section)    */}
      {/* ========================================== */}
      <section className={styles.gallerySection} aria-labelledby="gallery-heading">
        <div className={styles.galleryContainer}>
          <div className={styles.galleryLeftCol}>
            <h2 id="gallery-heading" className={styles.galleryHeading}>
              Event Gallery
            </h2>
            <p className={styles.galleryParagraph}>
              Luxury is personal, and I love meeting our community face-to-face.
              From elite fashion exhibitions to exclusive perfumer meetups across
              Bangladesh, we bring the sensory experience directly to you. See
              our current store locations, live bottle-painting workshops, and
              past interactions.
            </p>
            <Link href="/events" className={styles.exploreBtn} aria-label="Explore more events">
              Explore More <span className={styles.exploreArrow}>↗</span>
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
    </div>
  );
}
