"use client";

import { useState, useEffect } from "react";
import { blogPosts as fallbackPosts, BlogPost } from "../data/blogData";
import BlogHeader from "./components/BlogHeader";
import FeaturedBlogHero from "./components/FeaturedBlogHero";
import BlogCard from "./components/BlogCard";
import BlogPagination from "./components/BlogPagination";
import styles from "./page.module.css";

const CATEGORIES = ["All", "Olfactory Journal", "Artisanal Craft", "Fragrance Guide", "Science of Scent", "Sustainability"];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

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
            date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' }) : "Recently Published",
            title: item.title,
            subtitle: item.description,
            description: item.description,
            content: item.content || item.description,
            image: item.image || "/images/events/sadid.jpg",
            author: item.author ? `${item.author.firstName} ${item.author.lastName}` : "Sadid Admin",
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
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Featured Hero post (first article when not searching/filtering specific categories)
  const isDefaultView = searchQuery === "" && selectedCategory === "All";
  const featuredPost = isDefaultView && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(gridPosts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = gridPosts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribedEmail) {
      setSubscribedSuccess(true);
      setSubscribedEmail("");
      setTimeout(() => setSubscribedSuccess(false), 4000);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Header */}
        <BlogHeader
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
        />

        {/* Featured Story Hero (when browsing all) */}
        {featuredPost && (
          <FeaturedBlogHero
            post={featuredPost}
            isLiked={!!likedPosts[featuredPost.id]}
            onToggleLike={toggleLike}
          />
        )}

        {/* Category Pills Bar */}
        <div className={styles.categoryBarContainer}>
          <div className={styles.categoryRow}>
            {CATEGORIES.map((cat) => {
              const count = cat === "All"
                ? posts.length
                : posts.filter(p => p.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`${styles.categoryPill} ${
                    selectedCategory === cat ? styles.categoryPillActive : ""
                  }`}
                >
                  {cat} <span className={styles.pillCount}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Blog Article Grid */}
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
            <h3>No Olfactory Articles Found</h3>
            <p>We couldn't find any articles matching your search criteria. Try refining your keywords or selecting another category.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className={styles.resetSearchBtn}
            >
              Reset Search & Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Olfactory Journal Newsletter Subscription Card */}
        <section className={styles.newsletterSection}>
          <div className={styles.newsletterCard}>
            <span className={styles.newsletterEyebrow}>PRIVATE CONNOISSEUR CIRCLE</span>
            <h3 className={styles.newsletterTitle}>Subscribe to The Olfactory Journal</h3>
            <p className={styles.newsletterDesc}>
              Receive bi-weekly essays on artisanal distillation, perfume reviews, and invitations to private scent launches.
            </p>

            {subscribedSuccess ? (
              <div className={styles.subscribedMsg}>
                ✓ Welcome to the Connoisseur Circle. Check your inbox soon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={subscribedEmail}
                  onChange={(e) => setSubscribedEmail(e.target.value)}
                  className={styles.newsletterInput}
                  required
                />
                <button type="submit" className={styles.newsletterBtn}>
                  Subscribe →
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
