"use client";

import Link from "next/link";
import { BlogPost } from "../../data/blogData";
import styles from "../page.module.css";

interface BlogCardProps {
  post: BlogPost;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
}

export default function BlogCard({ post, isLiked, onToggleLike }: BlogCardProps) {
  const postSlug = post.slug || post.id;
  const duration = post.duration || post.videoDuration || "00:45";

  return (
    <article className={styles.card} aria-labelledby={`title-${post.id}`}>
      {/* Large Video Placeholder Container */}
      <Link
        href={`/blog/${postSlug}`}
        className={styles.videoPlaceholder}
        aria-label={`Watch video: ${post.title}`}
      >
        <div className={styles.playButton} aria-hidden="true">
          <svg
            className={styles.playIcon}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        </div>

        {/* Small corner duration badge */}
        <span className={styles.durationBadge}>{duration}</span>
      </Link>

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
