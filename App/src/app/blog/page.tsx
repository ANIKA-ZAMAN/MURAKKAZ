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
    const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const baseUrl = rawBaseUrl.replace(/\/api\/?$/, '');
    fetch(`${baseUrl}/api/blog`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("API response not ok");
      })
      .then((data) => {
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          const mapped: BlogPost[] = data.data.map((item: any) => ({
            id: item.id || item.slug,
            slug: item.slug || item.id,
            date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' }) : "19th May, 2026",
            title: item.title,
            subtitle: item.description,
            description: item.description,
            content: item.content || item.description,
            image: item.image || "/images/events/blog1.jpg",
            author: item.author ? `${item.author.firstName} ${item.author.lastName}` : "Eliyash Hossain",
            category: item.category || "Olfactory Journal",
            readTime: "5 min read",
          }));
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
  const totalPages = Math.max(3, Math.ceil(filteredPosts.length / itemsPerPage));
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

        {/* 3-Column Card Grid */}
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
            <p>We couldn&apos;t find any articles matching your search query. Try searching with a different perfume note or keyword.</p>
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
        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}
