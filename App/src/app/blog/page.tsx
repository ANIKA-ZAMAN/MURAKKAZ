"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { blogPosts, BlogPost } from "../data/blogData";
import styles from "./page.module.css";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Load wishlist states from localStorage on mount
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

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const updated = { ...prev, [postId]: !prev[postId] };
      localStorage.setItem("blog-liked-posts", JSON.stringify(updated));
      return updated;
    });
  };

  // Filter posts based on search query
  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic (6 items per page matches design spec)
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Header section: Title and Search bar */}
        <div className={styles.headerRow}>
          <h1 className={styles.pageTitle}>Blog</h1>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search blog"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
              aria-label="Search blog posts"
            />
            <span className={styles.searchIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>
        </div>

        {/* Blog post grid */}
        {paginatedPosts.length > 0 ? (
          <div className={styles.grid}>
            {paginatedPosts.map((post) => {
              const isLiked = !!likedPosts[post.id];
              return (
                <article key={post.id} className={styles.card} aria-labelledby={`title-${post.id}`}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 350px"
                      className={styles.postImage}
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <span className={styles.postDate}>{post.date}</span>
                    <div className={styles.titleRow}>
                      <h2 id={`title-${post.id}`} className={styles.postTitle}>{post.title}</h2>
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
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
                      <button type="button" className={styles.readMoreBtn} aria-label={`Read more about ${post.title}`}>
                        Read More
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>No blog posts found matching your search.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Pagination Navigation">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={styles.paginationArrow}
              aria-label="Previous Page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`${styles.pageNumber} ${currentPage === pageNum ? styles.activePage : ""}`}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={currentPage === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={styles.paginationArrow}
              aria-label="Next Page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </nav>
        )}
      </main>
    </div>
  );
}
