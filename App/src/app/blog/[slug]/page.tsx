"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { blogPosts, BlogPost } from "../../data/blogData";
import BlogCard from "../components/BlogCard";
import styles from "./article.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedLikes = localStorage.getItem("blog-liked-posts");
    if (savedLikes) {
      try {
        setLikedPosts(JSON.parse(savedLikes));
      } catch (e) {
        console.error("Failed to parse liked blog posts", e);
      }
    }
  }, []);

  // Find post in static data or try API fetch
  useEffect(() => {
    const found = blogPosts.find((p) => p.slug === slug || p.id === slug);
    if (found) {
      setPost(found);
    } else {
      // Attempt API fetch
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      fetch(`${baseUrl}/api/blog/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.data) {
            const item = data.data;
            setPost({
              id: item.id,
              slug: item.slug,
              date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' }) : "Recently Published",
              title: item.title,
              subtitle: item.description,
              description: item.description,
              content: item.content || item.description,
              image: item.image || "/images/events/sadid.jpg",
              author: item.author ? `${item.author.firstName} ${item.author.lastName}` : "Sadid Admin",
              category: "Olfactory Journal",
              readTime: "5 min read",
            });
          }
        })
        .catch(() => {
          if (blogPosts.length > 0) setPost(blogPosts[0]);
        });
    }
  }, [slug]);

  if (!post) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading article...</p>
      </div>
    );
  }

  const isLiked = !!likedPosts[post.id];

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const updated = { ...prev, [postId]: !prev[postId] };
      localStorage.setItem("blog-liked-posts", JSON.stringify(updated));
      return updated;
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const relatedPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  const contentParagraphs = Array.isArray(post.content)
    ? post.content
    : typeof post.content === "string"
    ? post.content.split("\n\n")
    : [];

  return (
    <div className={styles.articlePage}>
      <article className={styles.container}>
        {/* Navigation Link */}
        <Link href="/blog" className={styles.backLink}>
          ← Back to Olfactory Journal
        </Link>

        {/* Hero Header */}
        <header className={styles.header}>
          <div className={styles.categoryMeta}>
            <span className={styles.categoryBadge}>{post.category}</span>
            <span className={styles.dotSeparator}>•</span>
            <span className={styles.readTime}>{post.readTime}</span>
          </div>

          <h1 className={styles.articleTitle}>{post.title}</h1>

          {post.subtitle && <p className={styles.subtitle}>{post.subtitle}</p>}

          <div className={styles.authorRow}>
            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar}>
                {post.author.charAt(0)}
              </div>
              <div>
                <span className={styles.authorName}>{post.author}</span>
                {post.authorRole && (
                  <span className={styles.authorRole}>{post.authorRole}</span>
                )}
              </div>
            </div>

            <div className={styles.dateMeta}>
              <span>Published on {post.date}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className={styles.heroImageWrapper}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1100px) 100vw, 1100px"
            className={styles.heroImage}
          />
        </div>

        {/* Article Body */}
        <div className={styles.articleBody}>
          {contentParagraphs.map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={index} className={styles.sectionHeading}>
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }

            if (trimmed.startsWith("> ")) {
              return (
                <blockquote key={index} className={styles.pullQuote}>
                  <p>{trimmed.replace("> ", "").replace(/"/g, "")}</p>
                </blockquote>
              );
            }

            return (
              <p key={index} className={styles.paragraph}>
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Article Footer & Actions */}
        <footer className={styles.articleFooter}>
          <div className={styles.actionsBar}>
            <button
              type="button"
              onClick={() => toggleLike(post.id)}
              className={`${styles.actionBtn} ${isLiked ? styles.likedAction : ""}`}
            >
              <svg viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" className={styles.actionIcon}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {isLiked ? "Saved to Favorites" : "Save Article"}
            </button>

            <button type="button" onClick={handleShare} className={styles.actionBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              {copied ? "Link Copied!" : "Share Article"}
            </button>
          </div>

          {/* Author Bio Box */}
          <div className={styles.bioCard}>
            <div className={styles.bioAvatar}>{post.author.charAt(0)}</div>
            <div className={styles.bioText}>
              <h4>Written by {post.author}</h4>
              <p>
                {post.authorRole || "Contributor at Murakkaz Olfactory Journal"}. Dedicated to preserving heritage distillation techniques and exploring the sensory art of artisanal perfumery.
              </p>
            </div>
          </div>
        </footer>

        {/* Related Articles Section */}
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>More From Olfactory Journal</h2>
          <div className={styles.relatedGrid}>
            {relatedPosts.map((relPost) => (
              <BlogCard
                key={relPost.id}
                post={relPost}
                isLiked={!!likedPosts[relPost.id]}
                onToggleLike={toggleLike}
              />
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
