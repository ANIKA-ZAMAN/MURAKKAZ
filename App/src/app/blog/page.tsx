"use client";

import { useState, useEffect } from "react";
import { blogPosts as fallbackPosts, BlogPost } from "../data/blogData";
import BlogHeader from "./components/BlogHeader";
import BlogCard from "./components/BlogCard";
import BlogPagination from "./components/BlogPagination";
import PerfumeVideoGrid from "./components/PerfumeVideoGrid";
import styles from "./page.module.css";
import { getApiBaseUrl } from "@/lib/api";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [viewTab, setViewTab] = useState<"all" | "videos" | "articles">("all");

  // Load liked posts from localStorage
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

  // Fetch live blog posts from API if available
  useEffect(() => {
    const baseUrl = getApiBaseUrl();
    const defaultBlogImages = [
      "/images/events/blog1.jpg",
      "/images/events/blog2.jpg",
      "/images/events/blog3.jpg",
      "/images/events/eliyas.jpg",
      "/images/events/event_gallery_1.jpg",
      "/images/events/event_gallery_2.jpg",
    ];

    fetch(`${baseUrl}/api/blog`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("API response not ok");
      })
      .then((data) => {
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          const mapped: BlogPost[] = data.data.map((item: any, idx: number) => {
            let img = item.image;
            if (!img || img === "null" || img === "undefined" || !img.trim()) {
              img = defaultBlogImages[idx % defaultBlogImages.length];
            } else if (!img.startsWith("http") && !img.startsWith("/")) {
              img = `/images/events/${img}`;
            }

            return {
              id: item.id || item.slug,
              slug: item.slug || item.id,
              date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' }) : "19th May, 2026",
              title: item.title,
              subtitle: item.description,
              description: item.description,
              content: item.content || item.description,
              image: img,
              author: item.author ? `${item.author.firstName} ${item.author.lastName}` : "Eliyash Hossain",
              category: item.category || "Olfactory Journal",
              readTime: "5 min read",
            };
          });
          setPosts(mapped);
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

  // Filter posts
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {/* Header: Vlog title + Search your perfume */}
        <BlogHeader
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
        />

        {/* View Switcher Tabs */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            paddingBottom: "12px",
            marginTop: "-0.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => setViewTab("all")}
            style={{
              padding: "7px 18px",
              borderRadius: "30px",
              border: "none",
              background: viewTab === "all" ? "#1f1f22" : "#f2edf9",
              color: viewTab === "all" ? "#ffffff" : "#555558",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            All Highlights
          </button>
          <button
            type="button"
            onClick={() => setViewTab("videos")}
            style={{
              padding: "7px 18px",
              borderRadius: "30px",
              border: "none",
              background: viewTab === "videos" ? "#1f1f22" : "#f2edf9",
              color: viewTab === "videos" ? "#ffffff" : "#555558",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: "11px" }}>▶</span> Perfume Cinema (Videos)
          </button>
          <button
            type="button"
            onClick={() => setViewTab("articles")}
            style={{
              padding: "7px 18px",
              borderRadius: "30px",
              border: "none",
              background: viewTab === "articles" ? "#1f1f22" : "#f2edf9",
              color: viewTab === "articles" ? "#ffffff" : "#555558",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Editorial Articles
          </button>
        </div>

        {/* Perfume Video Grid Section */}
        {(viewTab === "all" || viewTab === "videos") && (
          <PerfumeVideoGrid />
        )}

        {/* Editorial Articles Section */}
        {(viewTab === "all" || viewTab === "articles") && (
          <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
            {viewTab === "all" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  borderTop: "1px solid rgba(197, 168, 128, 0.25)",
                  paddingTop: "2rem",
                  marginTop: "1rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#820011",
                    fontWeight: 700,
                  }}
                >
                  The Olfactory Journal
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontSize: "1.9rem",
                    color: "#1f1f22",
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Fragrance Guides & Stories
                </h2>
              </div>
            )}

            {paginatedPosts.length > 0 ? (
              <div className={styles.grid}>
                {paginatedPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    isLiked={!!likedPosts[post.id]}
                    onToggleLike={toggleLike}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>✧</div>
                <h3>No Perfume Articles Found</h3>
                <p>
                  We couldn&apos;t find any articles matching your search query. Try searching with a different perfume note or keyword.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className={styles.resetSearchBtn}
                >
                  Reset Search
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </section>
        )}
      </main>
    </div>
  );
}
