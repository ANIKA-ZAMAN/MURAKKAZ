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
  const [isPlaying, setIsPlaying] = useState(false);

  const rawVideoUrl = customVideoUrl || mediaMentions.videoUrl || "https://youtu.be/kDqvhSFQud0?si=616OL7LTVlGLshNh";
  const posterSrc = customPoster || mediaMentions.posterImage || "/images/events/video_thumbnail_2.png";
  const videoTitle = mediaMentions.videoTitle || "Interview at Channel i with Shykh Seraj";
  const subheadingText = mediaMentions.subheading || videoTitle;

  // Determine if URL is YouTube
  const isYouTube = rawVideoUrl.includes("youtube.com") || rawVideoUrl.includes("youtu.be");
  let embedUrl = mediaMentions.embedUrl || "https://www.youtube.com/embed/kDqvhSFQud0?autoplay=1";
  if (isYouTube) {
    if (rawVideoUrl.includes("youtu.be/")) {
      const id = rawVideoUrl.split("youtu.be/")[1]?.split("?")[0];
      if (id) embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    } else if (rawVideoUrl.includes("watch?v=")) {
      const id = rawVideoUrl.split("watch?v=")[1]?.split("&")[0];
      if (id) embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
  }

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <section className={styles.section} aria-labelledby="media-mentions-title">
      <div className={styles.headingGroup}>
        <h2 id="media-mentions-title" className={styles.title}>
          {mediaMentions.heading}
        </h2>
        {subheadingText && (
          <p className={styles.subheading}>{subheadingText}</p>
        )}
      </div>

      {/* Single Big Video Container as it was before */}
      <div className={styles.videoContainer}>
        {isPlaying ? (
          isYouTube ? (
            <iframe
              src={embedUrl}
              title={videoTitle}
              className={styles.videoElement}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              src={rawVideoUrl}
              className={styles.videoElement}
              controls
              autoPlay
              poster={posterSrc}
            />
          )
        ) : (
          <div
            className={styles.posterWrapper}
            onClick={handlePlay}
            role="button"
            tabIndex={0}
            aria-label={`Play ${videoTitle}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handlePlay();
            }}
          >
            {posterSrc && (
              <Image
                src={posterSrc}
                alt={videoTitle}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className={styles.posterImage}
              />
            )}
            <div className={styles.playOverlay} aria-label="Play video">
              <div className={styles.playTriangle} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
