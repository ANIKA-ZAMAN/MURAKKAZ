"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { BlogPost } from "../../data/blogData";
import styles from "../page.module.css";

interface BlogCardProps {
  post: BlogPost;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
}

export function resolveVideoUrl(src?: string): string | undefined {
  if (!src) return undefined;
  const s = src.trim();
  if (
    s === "elements video" ||
    s === "elements/video" ||
    s === "elements/video 1" ||
    s === "elements video.mp4"
  ) {
    return "/elements/video 1.mp4";
  }
  return s;
}

export default function BlogCard({ post, isLiked, onToggleLike }: BlogCardProps) {
  const postSlug = post.slug || post.id;
  const duration = post.duration || post.videoDuration || "00:45";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoSrc = resolveVideoUrl(post.videoUrl);
  const hasRealVideo = Boolean(videoSrc);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().catch((err) => {
        console.warn("Video play interrupted:", err);
      });
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <article className={styles.card} aria-labelledby={`title-${post.id}`}>
      {/* Video Container / Thumbnail */}
      <div
        className={`${styles.videoPlaceholder} ${hasRealVideo ? styles.videoWithMedia : ""}`}
        onClick={hasRealVideo ? handleTogglePlay : undefined}
      >
        {hasRealVideo ? (
          <video
            ref={videoRef}
            className={styles.realVideo}
            preload="metadata"
            muted
            playsInline
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            aria-label={post.title}
          >
            <source src={videoSrc} type="video/mp4" />
            <source src="/elements/video 1.mp4" type="video/mp4" />
            <source src="/elements/video.mp4" type="video/mp4" />
            <source src="/videos/perfume-01.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Link
            href={`/blog/${postSlug}`}
            className={styles.placeholderLink}
            aria-label={`Read article: ${post.title}`}
          />
        )}

        {/* Centered Play Button Overlay */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`${styles.playButton} ${isPlaying ? styles.playButtonHidden : ""}`}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          <svg
            className={styles.playIcon}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            {isPlaying ? (
              <>
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </>
            ) : (
              <polygon points="6 3 20 12 6 3" />
            )}
          </svg>
        </button>

        {/* Small corner duration badge */}
        <span className={styles.durationBadge}>{duration}</span>
      </div>

      {/* Editorial Content Below Video */}
      <div className={styles.cardContent}>
        {/* Date + Wishlist Icon */}
        <div className={styles.metaRow}>
          <span className={styles.postDate}>{post.date}</span>
          <button
            type="button"
            onClick={() => onToggleLike(post.id)}
            className={`${styles.wishlistBtn} ${isLiked ? styles.wishlistBtnActive : ""}`}
            aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              className={styles.heartIcon}
              viewBox="0 0 24 24"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Elegant Serif Title */}
        <h2 id={`title-${post.id}`} className={styles.postTitle}>
          <Link href={`/blog/${postSlug}`} className={styles.titleLink}>
            {post.title}
          </Link>
        </h2>

        {/* 1-2 Line Description */}
        <p className={styles.postDesc}>{post.description}</p>

        {/* Compact "See More →" Button */}
        <div className={styles.actionRow}>
          <Link
            href={`/blog/${postSlug}`}
            className={styles.seeMoreBtn}
            aria-label={`See more about ${post.title}`}
          >
            See More &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
