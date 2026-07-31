"use client";

import Image from "next/image";
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

  return (
    <article className={styles.card} aria-labelledby={`title-${post.id}`}>
      <Link href={`/blog/${postSlug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 350px"
            className={styles.postImage}
          />
          {post.category && (
            <span className={styles.categoryBadge}>{post.category}</span>
          )}
        </div>
      </Link>

      <div className={styles.cardContent}>
        <div className={styles.metaRow}>
          <span className={styles.postDate}>{post.date}</span>
          {post.readTime && <span className={styles.readTime}>• {post.readTime}</span>}
        </div>

        <div className={styles.titleRow}>
          <h2 id={`title-${post.id}`} className={styles.postTitle}>
            <Link href={`/blog/${postSlug}`} className={styles.titleLink}>
              {post.title}
            </Link>
          </h2>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleLike(post.id);
            }}
            className={`${styles.wishlistBtn} ${isLiked ? styles.wishlistBtnActive : ""}`}
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          >
            <svg viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" className={styles.heartIcon}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        <p className={styles.postDesc}>{post.description}</p>

        <div className={styles.actionRow}>
          <Link href={`/blog/${postSlug}`} className={styles.readMoreBtn} aria-label={`Read article: ${post.title}`}>
            Read Article →
          </Link>
        </div>
      </div>
    </article>
  );
}
