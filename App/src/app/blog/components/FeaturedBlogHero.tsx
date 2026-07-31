import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "../../data/blogData";
import styles from "../page.module.css";

interface FeaturedBlogHeroProps {
  post: BlogPost;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
}

export default function FeaturedBlogHero({ post, isLiked, onToggleLike }: FeaturedBlogHeroProps) {
  const postSlug = post.slug || post.id;

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroLayout}>
        <Link href={`/blog/${postSlug}`} className={styles.heroImageLink}>
          <div className={styles.heroImageWrapper}>
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={styles.heroImage}
            />
            <span className={styles.heroCategoryBadge}>Featured Story</span>
          </div>
        </Link>

        <div className={styles.heroContent}>
          <div className={styles.heroMetaRow}>
            <span className={styles.heroCategory}>{post.category}</span>
            <span className={styles.heroDot}>•</span>
            <span className={styles.heroDate}>{post.date}</span>
            {post.readTime && <span className={styles.heroReadTime}>• {post.readTime}</span>}
          </div>

          <h2 className={styles.heroTitle}>
            <Link href={`/blog/${postSlug}`} className={styles.heroTitleLink}>
              {post.title}
            </Link>
          </h2>

          <p className={styles.heroDesc}>{post.description}</p>

          <div className={styles.heroAuthorRow}>
            <div className={styles.heroAuthorInfo}>
              <div className={styles.heroAvatar}>{post.author.charAt(0)}</div>
              <div>
                <span className={styles.heroAuthorName}>{post.author}</span>
                {post.authorRole && <span className={styles.heroAuthorRole}>{post.authorRole}</span>}
              </div>
            </div>

            <div className={styles.heroActionGroup}>
              <button
                type="button"
                onClick={() => onToggleLike(post.id)}
                className={`${styles.wishlistBtn} ${isLiked ? styles.wishlistBtnActive : ""}`}
                aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
              >
                <svg viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" className={styles.heartIcon}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>

              <Link href={`/blog/${postSlug}`} className={styles.heroCtaBtn}>
                Read Featured Story →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
