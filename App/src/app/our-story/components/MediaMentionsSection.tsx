"use client";

import { useState } from "react";
import Image from "next/image";
import { ourStoryData } from "../../data/ourStoryData";
import styles from "./MediaMentionsSection.module.css";

interface MediaMentionsSectionProps {
  customVideoUrl?: string;
  customPoster?: string;
}

export default function MediaMentionsSection({
  customVideoUrl,
  customPoster,
}: MediaMentionsSectionProps) {
  const { mediaMentions } = ourStoryData;
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  // Fallback to default 3 items if videos array is not present
  const videoList = mediaMentions.videos || [
    {
      id: "v1",
      title: "Artisanal Fragrance Distillation",
      location: "Midas Center, Dhanmondi",
      poster: customPoster || mediaMentions.posterImage || "/images/events/event_gallery_1.jpg",
      videoUrl: customVideoUrl || mediaMentions.videoUrl || "",
    },
    {
      id: "v2",
      title: "Master Scent Consultation",
      location: "NSU Campus, Dhaka",
      poster: "/images/events/event_gallery_2.jpg",
      videoUrl: "",
    },
    {
      id: "v3",
      title: "Botanical Formulation & Notes",
      location: "BRAC University, Dhaka",
      poster: "/images/events/event_gallery_3.jpg",
      videoUrl: "",
    },
  ];

  return (
    <section className={styles.section} aria-labelledby="media-mentions-title">
      <div className={styles.headingGroup}>
        <h2 id="media-mentions-title" className={styles.title}>
          {mediaMentions.heading}
        </h2>
        <p className={styles.subheading}>{mediaMentions.subheading}</p>
      </div>

      {/* 3 Video Cards Grid Aligned Properly */}
      <div className={styles.videoGrid}>
        {videoList.map((item) => {
          const isPlaying = activePlayingId === item.id;
          const videoSrc = item.videoUrl || customVideoUrl || mediaMentions.videoUrl;
          const posterSrc = item.poster;

          return (
            <div key={item.id} className={styles.videoCard}>
              <div className={styles.videoContainer}>
                {videoSrc && isPlaying ? (
                  <video
                    src={videoSrc}
                    className={styles.videoElement}
                    controls
                    autoPlay
                    poster={posterSrc}
                  />
                ) : (
                  <div
                    className={styles.posterWrapper}
                    onClick={() => setActivePlayingId(item.id)}
                  >
                    <Image
                      src={posterSrc}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
                      className={styles.posterImage}
                    />
                    <div className={styles.playOverlay} aria-label={`Play ${item.title}`}>
                      <div className={styles.playTriangle} />
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.cardMeta}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                {item.location && <p className={styles.cardLocation}>{item.location}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
