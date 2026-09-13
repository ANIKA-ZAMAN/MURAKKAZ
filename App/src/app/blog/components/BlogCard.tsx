"use client";

import { useState, useRef, useEffect } from "react";
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
    s === "elements video.mp4" ||
    s === "elements video 1.mp4"
  ) {
    return "/elements/video 1.mp4";
  }
  if (
    s === "elements video 2" ||
    s === "elements/video 2" ||
    s === "elements video 2.mp4"
  ) {
    return "/elements/video 2.mp4";
  }
  if (
    s === "elements video 3" ||
    s === "elements/video 3" ||
    s === "elements video 3.mp4"
  ) {
    return "/elements/video 3.mp4";
  }
  return s;
}

export default function BlogCard({ post, isLiked, onToggleLike }: BlogCardProps) {
  const postSlug = post.slug || post.id;
  const duration = post.duration || post.videoDuration || "00:45";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);

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

  const handleToggleSound = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoRef.current) return;

    if (isMuted) {
      videoRef.current.muted = false;
      const targetVol = volume > 0.05 ? volume : 0.8;
      videoRef.current.volume = targetVol;
      setVolume(targetVol);
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (!videoRef.current) return;

    videoRef.current.volume = newVol;
    if (newVol <= 0.01) {
      videoRef.current.muted = true;
      setIsMuted(true);
    } else {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      if (videoRef.current) {
        videoRef.current.controls = isFs;
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  const handleFullscreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoRef.current) return;

    const el = videoRef.current as any;

    if (el.paused) {
      el.play().catch(() => {});
      setIsPlaying(true);
    }

    if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    } else if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.webkitEnterFullscreen) {
      // iOS Safari native video fullscreen
      el.webkitEnterFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  };

  return (
    <article className={styles.card} aria-labelledby={`title-${post.id}`}>
      {/* Video Container / Thumbnail */}
      <div
        className={`${styles.videoPlaceholder} ${hasRealVideo ? styles.videoWithMedia : ""}`}
        onClick={hasRealVideo ? handleTogglePlay : undefined}
        onDoubleClick={hasRealVideo ? handleFullscreen : undefined}
      >
        {hasRealVideo ? (
          <>
            <video
              ref={videoRef}
              className={styles.realVideo}
              preload="auto"
              muted={isMuted}
              playsInline
              loop
              onLoadedMetadata={(e) => {
                try {
                  e.currentTarget.currentTime = 0.001;
                } catch (err) {}
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              aria-label={post.title}
            >
              <source src={videoSrc} type="video/mp4" />
              {videoSrc?.includes('video 1') && (
                <>
                  <source src="/elements/video 1.mp4" type="video/mp4" />
                  <source src="/elements/video.mp4" type="video/mp4" />
                  <source src="/videos/perfume-01.mp4" type="video/mp4" />
                </>
              )}
              {videoSrc?.includes('video 2') && (
                <source src="/elements/video 2.mp4" type="video/mp4" />
              )}
              {videoSrc?.includes('video 3') && (
                <source src="/elements/video 3.mp4" type="video/mp4" />
              )}
              Your browser does not support the video tag.
            </video>

            {/* Fullscreen Expand Button in Thumbnail */}
            <button
              type="button"
              onClick={handleFullscreen}
              className={styles.fullscreenBtn}
              aria-label="View video fullscreen"
              title="Full screen"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>

            {/* Sound / Volume Control Pill */}
            <div
              className={styles.volumeControlWrapper}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleToggleSound}
                className={styles.soundBtn}
                aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
                title={isMuted ? "Turn Sound On" : "Mute Sound"}
              >
                {isMuted || volume <= 0.01 ? (
                  /* Muted Speaker Icon */
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  /* Active Sound Speaker Icon */
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
              </button>

              <span
                onClick={handleToggleSound}
                className={styles.soundLabel}
              >
                {isMuted ? "Sound" : `${Math.round((isMuted ? 0 : volume) * 100)}%`}
              </span>

              {/* Volume Slider for Sound Up and Down */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                onClick={(e) => e.stopPropagation()}
                className={styles.volumeSlider}
                aria-label="Adjust volume up or down"
                title="Adjust sound volume"
              />
            </div>
          </>
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
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="#1C1B1A"
          >
            {isPlaying ? (
              <g fill="#1C1B1A">
                <rect x="6" y="4" width="4" height="16" fill="#1C1B1A" />
                <rect x="14" y="4" width="4" height="16" fill="#1C1B1A" />
              </g>
            ) : (
              <polygon points="7 4 19 12 7 20" fill="#1C1B1A" />
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
      </div>
    </article>
  );
}
