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

  const getValidImg = (img?: string) => {
    if (!img || img === "null" || img === "undefined" || !img.trim()) {
      return "/images/events/blog1.jpg";
    }
    if (img.startsWith("http") || img.startsWith("/")) {
      return img;
    }
    return `/images/events/${img}`;
  };

  return (
    <article className={styles.card} aria-labelledby={`title-${post.id}`}>
      <Link href={`/blog/${postSlug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <Image
            src={getValidImg(post.image)}
            alt={post.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
            className={styles.postImage}
          />
        </div>
      </Link>

      <div className={styles.cardContent}>
        <span className={styles.postDate}>{post.date}</span>

        <div className={styles.titleRow}>
          <h2 id={`title-${post.id}`} className={styles.postTitle}>
            <Link href={`/blog/${postSlug}`} className={styles.titleLink}>
              {post.title}
            </Link>
          </h2>
        </div>

        <p className={styles.postDesc}>{post.description}</p>

        <div className={styles.actionRow}>
          <Link href={`/blog/${postSlug}`} className={styles.readMoreBtn} aria-label={`Read article: ${post.title}`}>
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
}
