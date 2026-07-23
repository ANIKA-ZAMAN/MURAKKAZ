"use client";

import { useState, useEffect } from "react";
import { blogPosts } from "../data/blogData";
import BlogHeader from "./components/BlogHeader";
import BlogCard from "./components/BlogCard";
import BlogPagination from "./components/BlogPagination";
import styles from "./page.module.css";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

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

  const filteredPosts = blogPosts.filter(
    (post) =>
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
        <BlogHeader
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
        />

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
            <p>No blog posts found matching your search.</p>
          </div>
        )}

        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}
