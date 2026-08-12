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

  const videoList = mediaMentions.videos || [
    {
      id: "v1",
      title: "Live Olfactory Station Showcase",
      location: "Midas Center, Dhanmondi",
      poster: customPoster || mediaMentions.posterImage || "/images/events/event_gallery_1.jpg",
      videoUrl: customVideoUrl || mediaMentions.videoUrl || "https://www.facebook.com/share/v/1PY3vSxsrR/",
      isPlaceholder: false,
    },
    {
      id: "v2",
      title: "Campus Perfume & Scent Discovery",
      location: "NSU Campus, Banani",
      poster: "/images/events/event_gallery_2.jpg",
      videoUrl: "https://www.facebook.com/share/v/19Fy1ZWWG5/",
      isPlaceholder: false,
    },
    {
      id: "v3",
      title: "Upcoming Feature",
      location: "Slot available for future media",
      poster: "",
      videoUrl: "",
      isPlaceholder: true,
    },
  ];

  const handleCardClick = (item: typeof videoList[0]) => {
    if (item.isPlaceholder || !item.videoUrl) return;

    if (item.videoUrl.includes("facebook.com") || item.videoUrl.includes("youtube.com") || item.videoUrl.includes("youtu.be")) {
      window.open(item.videoUrl, "_blank", "noopener,noreferrer");
    } else {
      setActivePlayingId(item.id);
    }
  };

  return (
    <section className={styles.section} aria-labelledby="media-mentions-title">
      <div className={styles.headingGroup}>
        <h2 id="media-mentions-title" className={styles.title}>
          {mediaMentions.heading}
        </h2>
        {mediaMentions.subheading && (
          <p className={styles.subheading}>{mediaMentions.subheading}</p>
        )}
      </div>

      {/* 3 Video Cards Grid Aligned Properly */}
      <div className={styles.videoGrid}>
        {videoList.map((item) => {
          const isPlaying = activePlayingId === item.id;
          const videoSrc = item.videoUrl;
          const posterSrc = item.poster;
          const isPlaceholder = item.isPlaceholder || (!videoSrc && !posterSrc);
          const isFacebook = videoSrc && videoSrc.includes("facebook.com");
          const isYouTube = videoSrc && (videoSrc.includes("youtube.com") || videoSrc.includes("youtu.be"));

          if (isPlaceholder) {
            return (
              <div key={item.id} className={`${styles.videoCard} ${styles.placeholderCard}`}>
                <div className={styles.placeholderBox}>
                  <div className={styles.placeholderPlusIcon}>+</div>
                  <p className={styles.placeholderText}>Upcoming Media Feature</p>
                  <span className={styles.placeholderSubtext}>Slot reserved for future video</span>
                </div>
                <div className={styles.cardMeta}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  {item.location && <p className={styles.cardLocation}>{item.location}</p>}
                </div>
              </div>
            );
          }

          return (
            <div key={item.id} className={styles.videoCard}>
              <div className={styles.videoContainer}>
                {videoSrc && isPlaying && !isFacebook && !isYouTube ? (
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
                    onClick={() => handleCardClick(item)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Watch ${item.title}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleCardClick(item);
                    }}
                  >
                    {posterSrc && (
                      <Image
                        src={posterSrc}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
                        className={styles.posterImage}
                      />
                    )}
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
