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

  const videoSrc = customVideoUrl || mediaMentions.videoUrl;
  const posterSrc = customPoster || mediaMentions.posterImage;

  return (
    <section className={styles.section} aria-labelledby="media-mentions-title">
      <div className={styles.headingGroup}>
        <h2 id="media-mentions-title" className={styles.title}>
          {mediaMentions.heading}
        </h2>
        <p className={styles.subheading}>{mediaMentions.subheading}</p>
      </div>

      {/* Embedded Video Container with Play Icon Overlay */}
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
          <div className={styles.posterWrapper} onClick={() => setIsPlaying(true)}>
            {posterSrc && (
              <Image
                src={posterSrc}
                alt="Trust Signals & Media Mentions Video"
                fill
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
