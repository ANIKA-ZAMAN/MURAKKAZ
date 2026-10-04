"use client";

import { useState, useEffect } from "react";
import { blogPosts as fallbackPosts, BlogPost } from "../data/blogData";
import BlogHeader from "./components/BlogHeader";
import BlogCard from "./components/BlogCard";
import BlogPagination from "./components/BlogPagination";
import styles from "./page.module.css";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Load wishlist liked posts from localStorage
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

  // Filter posts based on search query (only valid posts with titles)
  const filteredPosts = posts.filter((post) => {
    if (!post.title || !post.title.trim()) {
      return false;
    }

    const query = searchQuery.trim().toLowerCase();
    return (
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query)
    );
  });

  // Exactly 6 cards per page on desktop (3 x 2 grid)
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Refined Page Header with Search */}
        <BlogHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* 3-Column Editorial Grid */}
        {paginatedPosts.length > 0 ? (
          <section
            className={styles.grid}
            aria-label="Fragrance videos and stories grid"
          >
            {paginatedPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                isLiked={!!likedPosts[post.id]}
                onToggleLike={toggleLike}
              />
            ))}
          </section>
        ) : (
          <div className={styles.noResults} role="status">
            <div className={styles.noResultsIcon}>✧</div>
            <h2
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "1.6rem",
                color: "#1C1B1A",
                margin: 0,
              }}
            >
              No Fragrance Videos Found
            </h2>
            <p style={{ maxWidth: "420px", margin: 0, fontSize: "0.88rem" }}>
              We could not find any videos or stories matching your search or category filter.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className={styles.resetFiltersBtn}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Murakkaz Facebook Visual Stories Banner */}
        <section className={styles.facebookBanner} aria-label="Murakkaz on Facebook">
          <div className={styles.facebookBannerContent}>
            <div className={styles.facebookBannerBadge}>
              <span className={styles.facebookStar}>✧</span>
              <span>MURAKKAZ VISUAL ARCHIVE</span>
              <span className={styles.facebookStar}>✧</span>
            </div>

            <h3 className={styles.facebookBannerTitle}>
              More to Watch on Facebook
            </h3>

            <p className={styles.facebookBannerDesc}>
              Discover exclusive fragrance reels, customer reviews, behind-the-scenes masterclasses, and olfactory stories on our official Facebook channel.
            </p>

            <a
              href="https://www.facebook.com/profile.php?id=100063498011095"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.facebookBannerBtn}
              aria-label="More to watch on Facebook - visit Murakkaz official Facebook page"
            >
              <svg
                className={styles.facebookIcon}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>More to watch on Facebook</span>
              <span className={styles.facebookArrow}>→</span>
            </a>
          </div>
        </section>

        {/* Centered Pagination Controls */}
        {totalPages > 1 && (
          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
}
