import CreatorSection from "./components/CreatorSection";
import JourneyStorySection from "./components/JourneyStorySection";
import BehindBrandSection from "./components/BehindBrandSection";
import EventGallerySection from "./components/EventGallerySection";
import styles from "../page.module.css";

export default function OurStoryPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <CreatorSection />
      </main>
      <JourneyStorySection />
      <main className={styles.main}>
        <BehindBrandSection />
      </main>
      <EventGallerySection />
    </div>
  );
}
