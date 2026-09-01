"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { productsCatalog } from "../data/products";

interface WishlistProduct {
  id: string;
  name: string;
  image: string;
  inspiredBy: string;
  price: string;
  originalPrice?: string;
  rating: string;
  ratingCount: number;
  inWishlist: boolean;
}

export default function WishlistPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<WishlistProduct[]>([]);
  const [related, setRelated] = useState<WishlistProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritesLimit, setFavoritesLimit] = useState(8);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const syncWishlist = () => {
    try {
      const saved = localStorage.getItem("wishlist-items");
      let savedIds: string[] = [];
      if (saved) {
        savedIds = JSON.parse(saved);
        if (!Array.isArray(savedIds)) savedIds = [];
      }

      // Map saved items (strings or objects) to products in productsCatalog
      const favList: WishlistProduct[] = [];
      savedIds.forEach((entry: any) => {
        const idOrName = typeof entry === "string" ? entry : (entry?.id || entry?.name);
        if (!idOrName) return;

        const match = productsCatalog.find(
          (p) =>
            p.id === idOrName ||
            p.name.toLowerCase() === idOrName.toLowerCase() ||
            p.id.toLowerCase() === idOrName.toLowerCase()
        );

        if (match) {
          if (!favList.some((f) => f.name === match.name)) {
            favList.push({
              id: match.id,
              name: match.name,
              image: match.image || "/images/products/jade_serenity.png",
              inspiredBy: match.inspiredBy
                ? `Inspired by ${match.inspiredBy}`
                : (match.brand ? `By ${match.brand}` : match.name),
              price: "300 - 2500tk",
              rating: (match.rating || 4.8).toString(),
              ratingCount: match.reviews || 180,
              inWishlist: true,
            });
          }
        } else if (typeof entry === "object" && entry.name) {
          if (!favList.some((f) => f.name === entry.name)) {
            favList.push({
              id: entry.id || entry.name,
              name: entry.name,
              image: entry.image || "/images/products/jade_serenity.png",
              inspiredBy: entry.brand ? `By ${entry.brand}` : entry.name,
              price: "300 - 2500tk",
              rating: (entry.rating || 4.8).toString(),
              ratingCount: entry.ratingCount || 150,
              inWishlist: true,
            });
          }
        }
      });

      setFavorites(favList);

      // Related products not currently in wishlist
      const relList: WishlistProduct[] = productsCatalog
        .filter((p) => !favList.some((f) => f.name === p.name))
        .slice(0, 12)
        .map((p) => ({
          id: p.id,
          name: p.name,
          image: p.image || "/images/products/jade_serenity.png",
          inspiredBy: p.inspiredBy
            ? `Inspired by ${p.inspiredBy}`
            : (p.brand ? `By ${p.brand}` : p.name),
          price: "300 - 2500tk",
          rating: (p.rating || 4.8).toString(),
          ratingCount: p.reviews || 150,
          inWishlist: false,
        }));

      setRelated(relList);
    } catch (err) {
      console.error("Error reading wishlist:", err);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    syncWishlist();
    window.addEventListener("wishlist-updated", syncWishlist);
    window.addEventListener("storage", syncWishlist);
    return () => {
      window.removeEventListener("wishlist-updated", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  const toggleFavorite = (id: string, isRelated = false) => {
    try {
      const saved = localStorage.getItem("wishlist-items");
      let wishlist: any[] = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(wishlist)) wishlist = [];

      const exists = wishlist.some((item) =>
        typeof item === "string" ? item === id : (item.id === id || item.name === id)
      );

      if (exists) {
        wishlist = wishlist.filter((item) =>
          typeof item === "string" ? item !== id : (item.id !== id && item.name !== id)
        );
      } else {
        const match = productsCatalog.find((p) => p.id === id || p.name === id);
        if (match) {
          wishlist.push({
            id: match.id,
            name: match.name,
            brand: match.brand,
            image: match.image,
            rating: match.rating,
            ratingCount: match.reviews,
          });
        } else {
          wishlist.push(id);
        }
      }

      localStorage.setItem("wishlist-items", JSON.stringify(wishlist));
      window.dispatchEvent(new Event("wishlist-updated"));
      syncWishlist();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToBag = (item: WishlistProduct) => {
    try {
      const saved = localStorage.getItem("cart-items");
      let cart: any[] = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(cart)) cart = [];

      const existingIndex = cart.findIndex(
        (i: any) =>
          i.name &&
          i.name.toLowerCase() === item.name.toLowerCase() &&
          (i.selectedSize === "10ml" || !i.selectedSize)
      );

      const isExclusive = [
        "irish-leather", "baccarat-rouge-540", "tobacco-vanille", "by-the-fireplace",
        "resala", "sultani", "guidance", "rosewood", "sakura-dior", "imagination"
      ].some(slug => (item.id && item.id.toLowerCase().includes(slug)) || (item.name && item.name.toLowerCase().includes(slug)));

      const prices = isExclusive ? {
        "6ml": 300,
        "10ml": 500,
        "30ml": 1500,
        "50ml": 2500,
      } : {
        "6ml": 300,
        "10ml": 500,
        "30ml": 900,
        "50ml": 1500,
      };

      if (existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
        cart[existingIndex].selected = true;
      } else {
        cart.push({
          id: `cart-${item.id || Date.now()}`,
          name: item.name,
          image: item.image,
          inspiredBy: item.inspiredBy,
          selectedSize: "10ml",
          quantity: 1,
          prices: prices,
          selected: true,
        });
      }

      localStorage.setItem("cart-items", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuyNow = (item: WishlistProduct) => {
    handleAddToBag(item);
    router.push("/cart");
  };

  const handleToggleFavoritesLimit = () => {
    if (favoritesLimit >= filteredFavorites.length) {
      setFavoritesLimit(8);
    } else {
      setFavoritesLimit((prev) => prev + 4);
    }
  };

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => Math.min(prev + 1, Math.max(0, related.length - 4)));
  };

  const filteredFavorites = favorites.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedFavorites = filteredFavorites.slice(0, favoritesLimit);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Title and Search Section */}
        <div className={styles.headerRow}>
          <h1 className={styles.title}>
            Your Favorite Things
            {isLoaded && favorites.length > 0 && (
              <span style={{ fontSize: "1.25rem", color: "#820011", marginLeft: "0.75rem", fontWeight: 600 }}>
                ({favorites.length})
              </span>
            )}
          </h1>

          {favorites.length > 0 && (
            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7a7a7d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search favorite products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear Search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Empty state or Product Grid */}
        {isLoaded && filteredFavorites.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#313134" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>No Favorite Fragrances Found</h3>
            <p className={styles.emptySubtitle}>
              {searchQuery
                ? "No products matched your search query in favorites."
                : "Your favorites list is currently empty. Explore our master collection and click the heart icon to save fragrances here."}
            </p>
            <Link href="/shop" className={styles.exploreBtn}>
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {displayedFavorites.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img src={item.image} alt={item.name} className={styles.productImg} />
                </div>
                <div className={styles.cardDetails}>
                  <div className={styles.titleHeartRow}>
                    <h3 className={styles.productName}>{item.name}</h3>
                    <button
                      className={styles.heartBtn}
                      onClick={() => toggleFavorite(item.id)}
                      title="Remove from wishlist"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#820011" stroke="#820011" strokeWidth="1.5">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>
                  <div className={styles.inspiredBy}>{item.inspiredBy}</div>
                  <div className={styles.ratingPriceRow}>
                    <div className={styles.ratingWrapper}>
                      <span className={styles.starIcon}>★</span>
                      <span className={styles.ratingValue}>{item.rating}</span>
                      <span className={styles.ratingCount}>({item.ratingCount})</span>
                    </div>
                    <div className={styles.priceContainer}>
                      <span className={styles.price}>{item.price}</span>
                    </div>
                  </div>
                  <div className={styles.actionButtons}>
                    <button
                      type="button"
                      className={styles.buyNowBtn}
                      onClick={() => handleBuyNow(item)}
                    >
                      Buy Now
                    </button>
                    <button
                      type="button"
                      className={styles.addBagBtn}
                      onClick={() => handleAddToBag(item)}
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show More */}
        {filteredFavorites.length > 8 && (
          <div className={styles.showMoreRow}>
            <button className={styles.showMoreBtn} onClick={handleToggleFavoritesLimit}>
              {favoritesLimit >= filteredFavorites.length ? "Show Less" : "Show More"}
              <span
                className={styles.downArrow}
                style={{
                  transform: favoritesLimit >= filteredFavorites.length ? "rotate(180deg)" : "none",
                  transition: "transform 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>
          </div>
        )}

        {/* Products Related To Your Liking */}
        {related.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Products Related To Your Liking</h2>
            <div className={styles.carouselContainer}>
              {/* Left Nav */}
              <button
                className={styles.carouselNavBtn}
                onClick={handlePrevCarousel}
                disabled={carouselIndex === 0}
                style={{ opacity: carouselIndex === 0 ? 0.3 : 1, cursor: carouselIndex === 0 ? "default" : "pointer" }}
                aria-label="Previous Related Products"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              {/* Carousel Viewport Container */}
              <div className={styles.carouselViewport}>
                <div
                  className={styles.carouselTrack}
                  style={{ "--carousel-index": carouselIndex } as React.CSSProperties}
                >
                  {related.map((item) => (
                    <div key={item.id} className={styles.carouselCard}>
                      <div className={styles.card}>
                        <div className={styles.imageWrapper}>
                          <img src={item.image} alt={item.name} className={styles.productImg} />
                        </div>
                        <div className={styles.cardDetails}>
                          <div className={styles.titleHeartRow}>
                            <h3 className={styles.productName}>{item.name}</h3>
                            <button
                              className={styles.heartBtn}
                              onClick={() => toggleFavorite(item.id, true)}
                              title={item.inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                            >
                              {item.inWishlist ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#820011" stroke="#820011" strokeWidth="1.5">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                              ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a7a7d" strokeWidth="1.5">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          <div className={styles.inspiredBy}>{item.inspiredBy}</div>
                          <div className={styles.ratingPriceRow}>
                            <div className={styles.ratingWrapper}>
                              <span className={styles.starIcon}>★</span>
                              <span className={styles.ratingValue}>{item.rating}</span>
                              <span className={styles.ratingCount}>({item.ratingCount})</span>
                            </div>
                            <div className={styles.priceContainer}>
                              <span className={styles.price}>{item.price}</span>
                            </div>
                          </div>
                          <div className={styles.actionButtons}>
                            <button
                              type="button"
                              className={styles.buyNowBtn}
                              onClick={() => handleBuyNow(item)}
                            >
                              Buy Now
                            </button>
                            <button
                              type="button"
                              className={styles.addBagBtn}
                              onClick={() => handleAddToBag(item)}
                            >
                              Add to Bag
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Nav */}
              <button
                className={styles.carouselNavBtn}
                onClick={handleNextCarousel}
                disabled={carouselIndex >= Math.max(0, related.length - 4)}
                style={{
                  opacity: carouselIndex >= Math.max(0, related.length - 4) ? 0.3 : 1,
                  cursor: carouselIndex >= Math.max(0, related.length - 4) ? "default" : "pointer",
                }}
                aria-label="Next Related Products"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Luxury Footer Section */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrandCol}>
            <div className={styles.footerLogo}>
              <span>Murakkaz</span>
            </div>
            <p className={styles.footerDesc}>
              Crafted and created by Murakkaj. Redefining luxury fragrances in Bangladesh by bringing you world-class olfactory art with beast-mode longevity, without the ridiculous designer markups.
            </p>
          </div>
          <div className={styles.footerLinksCol}>
            <div className={styles.linksRow}>
              <Link href="/">Home</Link>
              <Link href="/">Our Story</Link>
              <Link href="/">Shop</Link>
              <Link href="/events">Event</Link>
              <Link href="/">Discovery</Link>
              <Link href="/">Community</Link>
            </div>
            <div className={styles.linksSubRow}>
              <Link href="/events">Event Finder</Link>
              <Link href="/">Perfume Finder</Link>
            </div>
          </div>
          <div className={styles.footerSocialCol}>
            <div className={styles.socialIconsRow}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.socialBox} aria-label="Facebook">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V2h-3c-2.9 0-5 1.55-5 4.5V8z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialBox} aria-label="Instagram">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className={styles.socialBox} aria-label="YouTube">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
            <span className={styles.copyrightText}>©2026 Murakkaj. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
