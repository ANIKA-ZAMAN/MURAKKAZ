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
        <p className={styles.subheading}>{mediaMentions.subheading}</p>
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
                  <p className={styles.cardLocation}>{item.location || "Coming Soon"}</p>
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

                    {isFacebook && (
                      <div className={styles.facebookBadge}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>Facebook Video</span>
                      </div>
                    )}

                    {isYouTube && (
                      <div className={styles.youtubeBadge}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span>YouTube Video</span>
                      </div>
                    )}
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
