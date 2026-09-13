"use client";

import { useState, useEffect } from "react";
import { blogPosts as fallbackPosts, BlogPost } from "../data/blogData";
import BlogHeader from "./components/BlogHeader";
import BlogCard from "./components/BlogCard";
import BlogPagination from "./components/BlogPagination";
import styles from "./page.module.css";
import { getApiBaseUrl } from "@/lib/api";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
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

  // Optionally fetch live blog posts if API is available, merging with fallback
  useEffect(() => {
    const baseUrl = getApiBaseUrl();
    fetch(`${baseUrl}/api/blog`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("API response not ok");
      })
      .then((data) => {
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          const mapped: BlogPost[] = data.data.map((item: any) => {
            const fallback = fallbackPosts.find(
              (f) => (f.slug && f.slug === item.slug) || f.id === item.id || f.title === item.title
            );
            return {
              id: item.id || item.slug,
              slug: item.slug || item.id,
              date: item.publishedAt
                ? new Date(item.publishedAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).toUpperCase()
                : fallback?.date || "12 JUL 2025",
              title: item.title || fallback?.title || "",
              subtitle: item.description || fallback?.subtitle || "",
              description: item.description || fallback?.description || "",
              content: item.content || item.description || fallback?.content || "",
              image: item.image || fallback?.image || "/images/events/blog1.jpg",
              videoUrl: item.videoUrl || fallback?.videoUrl,
              duration: item.duration || fallback?.duration || "00:45",
              videoDuration: item.duration || fallback?.videoDuration || "00:45",
              author: item.author
                ? (typeof item.author === "string" ? item.author : `${item.author.firstName} ${item.author.lastName}`)
                : fallback?.author || "Eliyash Hossain",
              category: item.category || fallback?.category || "Stories",
              readTime: fallback?.readTime || "4 min read",
            };
          });

          // Always keep fallbackPosts in their curated editorial order so Card 1 has the real video
          const fallbackIds = new Set(fallbackPosts.map((fp) => fp.slug || fp.id));
          const extraApiPosts = mapped.filter((m) => !fallbackIds.has(m.slug || m.id));
          setPosts([...fallbackPosts, ...extraApiPosts]);
        }
      })
      .catch(() => {
        setPosts(fallbackPosts);
      });
  }, []);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const updated = { ...prev, [postId]: !prev[postId] };
      localStorage.setItem("blog-liked-posts", JSON.stringify(updated));
      return updated;
    });
  };

  // Filter posts based on category and search query
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" ||
      (post.category &&
        post.category.trim().toLowerCase() === activeCategory.trim().toLowerCase());

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      (post.category && post.category.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
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

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setCurrentPage(1);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Refined Page Header with Search and Category Filter Pills */}
        <BlogHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          activeCategory={activeCategory}
          onSelectCategory={handleCategoryChange}
        />

        {/* 3-Column Editorial Grid (3 x 2 cards per page) */}
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
