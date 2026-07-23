import CreatorSection from "./components/CreatorSection";
import JourneyStorySection from "./components/JourneyStorySection";
import MediaMentionsSection from "./components/MediaMentionsSection";
import BehindBrandSection from "./components/BehindBrandSection";
import AwardsSection from "./components/AwardsSection";
import styles from "../page.module.css";

export default function OurStoryPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <CreatorSection />
      </main>
      <JourneyStorySection />
      <main className={styles.main}>
        <MediaMentionsSection />
        <BehindBrandSection />
      </main>
      <AwardsSection />
    </div>
  );
}
