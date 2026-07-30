"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, BlogPost } from "../../data/blogData";
import BlogCard from "../components/BlogCard";
import styles from "./blogDetail.module.css";

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [isLiked, setIsLiked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Find post
  const post = blogPosts.find((p) => p.id === id) || blogPosts[0];

  // Other related posts
  const relatedPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  // Check saved favorites
  useEffect(() => {
    try {
      const savedLikes = JSON.parse(localStorage.getItem("liked-blog-posts") || "[]");
      if (savedLikes.includes(post.id)) {
        setIsLiked(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, [post.id]);

  const handleToggleLike = () => {
    const nextState = !isLiked;
    setIsLiked(nextState);

    try {
      let savedLikes = JSON.parse(localStorage.getItem("liked-blog-posts") || "[]");
      if (nextState) {
        if (!savedLikes.includes(post.id)) savedLikes.push(post.id);
        showToast("Added article to your favorites!");
      } else {
        savedLikes = savedLikes.filter((item: string) => item !== post.id);
        showToast("Removed article from your favorites.");
      }
      localStorage.setItem("liked-blog-posts", JSON.stringify(savedLikes));
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast("Article link copied to clipboard!");
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!post) return notFound();

  return (
    <div className={styles.container}>
      <main className={styles.articlePage}>
        {/* Navigation & Category */}
        <nav className={styles.navigationRow} aria-label="Breadcrumb">
          <Link href="/blog" className={styles.backBtn}>
            <span className={styles.backArrow}>&larr;</span> Back to Journal
          </Link>
          <span className={styles.categoryBadge}>{post.category}</span>
        </nav>

        {/* Article Header */}
        <header className={styles.articleHeader}>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          {post.subtitle && <p className={styles.articleSubtitle}>{post.subtitle}</p>}

          <div className={styles.metaRow}>
            <div className={styles.authorWrapper}>
              <Image
                src={post.authorAvatar}
                alt={post.author}
                width={42}
                height={42}
                className={styles.authorAvatar}
              />
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>{post.author}</span>
                <span className={styles.authorRole}>{post.authorRole}</span>
              </div>
            </div>

            <span className={styles.metaDivider} />
            <span className={styles.publishDate}>{post.date}</span>
            <span className={styles.metaDivider} />
            <span className={styles.readTime}>{post.readTime}</span>
          </div>
        </header>

        {/* Hero Featured Image */}
        <div className={styles.heroImageWrapper}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 900px"
            className={styles.heroImage}
          />
        </div>

        {/* Article Body Content */}
        <article className={styles.articleBody}>
          {post.content.map((paragraph, idx) => (
            <React.Fragment key={idx}>
              <p className={styles.paragraph}>{paragraph}</p>
              {idx === 1 && post.quote && (
                <blockquote className={styles.quoteBlock}>
                  <p className={styles.quoteText}>&ldquo;{post.quote}&rdquo;</p>
                </blockquote>
              )}
            </React.Fragment>
          ))}
        </article>

        {/* Interactive Action Bar */}
        <div className={styles.actionBar}>
          <span className={styles.readTime}>Enjoyed this article? Share it with fellow connoisseurs.</span>
          <div className={styles.actionBtnGroup}>
            <button
              type="button"
              onClick={handleToggleLike}
              className={`${styles.actionBtn} ${isLiked ? styles.actionBtnActive : ""}`}
            >
              <svg viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" className={styles.actionIcon}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {isLiked ? "Liked" : "Like"}
            </button>

            <button type="button" onClick={handleShare} className={styles.actionBtn}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={styles.actionIcon}>
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
              </svg>
              Share
            </button>
          </div>
        </div>

        {/* Related Journal Articles */}
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Continue Reading</h2>
          <div className={styles.relatedGrid}>
            {relatedPosts.map((relatedPost) => (
              <BlogCard
                key={relatedPost.id}
                post={relatedPost}
                isLiked={false}
                onToggleLike={() => {}}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Toast Notification */}
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}
    </div>
  );
}
