"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

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

const initialFavorites: WishlistProduct[] = [
  {
    id: "fav-1",
    name: "Jade Serenity",
    image: "/images/products/jade_serenity.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "1,720tk",
    rating: "4.8",
    ratingCount: 250,
    inWishlist: true,
  },
  {
    id: "fav-2",
    name: "Orvi Soq",
    image: "/images/products/coral_sea.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "1,630tk",
    originalPrice: "1,930tk",
    rating: "4.2",
    ratingCount: 250,
    inWishlist: true,
  },
  {
    id: "fav-3",
    name: "Mageration",
    image: "/images/products/jade_serenity.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "1,210tk",
    rating: "3.5",
    ratingCount: 50,
    inWishlist: true,
  },
  {
    id: "fav-4",
    name: "Hellenist",
    image: "/images/products/magnetism.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "2,200tk",
    originalPrice: "2,400tk",
    rating: "4.3",
    ratingCount: 80,
    inWishlist: true,
  },
  {
    id: "fav-5",
    name: "Mageration",
    image: "/images/products/jade_serenity.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "1,210tk",
    rating: "3.5",
    ratingCount: 50,
    inWishlist: true,
  },
  {
    id: "fav-6",
    name: "Hellenist",
    image: "/images/products/magnetism.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "2,200tk",
    originalPrice: "2,400tk",
    rating: "4.3",
    ratingCount: 80,
    inWishlist: true,
  },
  {
    id: "fav-7",
    name: "Jade Serenity",
    image: "/images/products/jade_serenity.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "1,720tk",
    rating: "4.8",
    ratingCount: 250,
    inWishlist: true,
  },
  {
    id: "fav-8",
    name: "Orvi Soq",
    image: "/images/products/coral_sea.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "1,630tk",
    originalPrice: "1,930tk",
    rating: "4.2",
    ratingCount: 150,
    inWishlist: true,
  },
  {
    id: "fav-9",
    name: "Coral Sea",
    image: "/images/products/coral_sea.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "1,450tk",
    rating: "4.0",
    ratingCount: 95,
    inWishlist: true,
  },
  {
    id: "fav-10",
    name: "Amber Gold",
    image: "/images/products/magnetism.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "1,890tk",
    rating: "4.5",
    ratingCount: 120,
    inWishlist: true,
  },
  {
    id: "fav-11",
    name: "Ocean Mist",
    image: "/images/products/jade_serenity.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "1,350tk",
    rating: "3.8",
    ratingCount: 40,
    inWishlist: true,
  },
  {
    id: "fav-12",
    name: "Night Bloom",
    image: "/images/products/magnetism.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "2,100tk",
    rating: "4.7",
    ratingCount: 180,
    inWishlist: true,
  },
];

const initialRelated: WishlistProduct[] = [
  {
    id: "rel-1",
    name: "Orvi Soq",
    image: "/images/products/coral_sea.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "1,630tk",
    originalPrice: "1,930tk",
    rating: "4.2",
    ratingCount: 250,
    inWishlist: false,
  },
  {
    id: "rel-2",
    name: "Jade Serenity",
    image: "/images/products/jade_serenity.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "1,720tk",
    rating: "4.8",
    ratingCount: 250,
    inWishlist: false,
  },
  {
    id: "rel-3",
    name: "Mageration",
    image: "/images/products/jade_serenity.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "1,210tk",
    rating: "3.5",
    ratingCount: 50,
    inWishlist: false,
  },
  {
    id: "rel-4",
    name: "Hellenist",
    image: "/images/products/magnetism.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "2,200tk",
    originalPrice: "2,400tk",
    rating: "4.3",
    ratingCount: 80,
    inWishlist: false,
  },
  {
    id: "rel-5",
    name: "Coral Sea",
    image: "/images/products/coral_sea.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "1,450tk",
    rating: "4.0",
    ratingCount: 95,
    inWishlist: false,
  },
  {
    id: "rel-6",
    name: "Amber Gold",
    image: "/images/products/magnetism.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "1,890tk",
    rating: "4.5",
    ratingCount: 120,
    inWishlist: false,
  },
  {
    id: "rel-7",
    name: "Ocean Mist",
    image: "/images/products/jade_serenity.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "1,350tk",
    rating: "3.8",
    ratingCount: 40,
    inWishlist: false,
  },
  {
    id: "rel-8",
    name: "Night Bloom",
    image: "/images/products/magnetism.png",
    inspiredBy: "inspired by Dior Sauvage",
    price: "2,100tk",
    rating: "4.7",
    ratingCount: 180,
    inWishlist: false,
  },
];

export default function WishlistPage() {
  const [favorites, setFavorites] = useState<WishlistProduct[]>(initialFavorites);
  const [related, setRelated] = useState<WishlistProduct[]>(initialRelated);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritesLimit, setFavoritesLimit] = useState(8);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const toggleFavorite = (id: string, isRelated = false) => {
    if (isRelated) {
      setRelated(prev =>
        prev.map(item =>
          item.id === id ? { ...item, inWishlist: !item.inWishlist } : item
        )
      );
    } else {
      setFavorites(prev =>
        prev.map(item =>
          item.id === id ? { ...item, inWishlist: !item.inWishlist } : item
        )
      );
    }
  };

  const handleToggleFavoritesLimit = () => {
    if (favoritesLimit >= filteredFavorites.length) {
      setFavoritesLimit(8);
    } else {
      setFavoritesLimit(prev => prev + 4);
    }
  };

  const handlePrevCarousel = () => {
    setCarouselIndex(prev => Math.max(prev - 1, 0));
  };

  const handleNextCarousel = () => {
    // 4 items visible in viewport
    setCarouselIndex(prev => Math.min(prev + 1, related.length - 4));
  };

  const filteredFavorites = favorites.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const displayedFavorites = filteredFavorites.slice(0, favoritesLimit);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Title and Search Section */}
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Your Favorite Things</h1>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7a7a7d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Favorite Grid */}
        <div className={styles.gridContainer}>
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
                    {item.originalPrice && (
                      <span className={styles.originalPrice}>{item.originalPrice}</span>
                    )}
                    <span className={styles.price}>{item.price}</span>
                  </div>
                </div>
                <div className={styles.actionButtons}>
                  <button className={styles.addBagBtn}>Add to Bag</button>
                  <button className={styles.buyNowBtn}>Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More */}
        {filteredFavorites.length > 8 && (
          <div className={styles.showMoreRow}>
            <button className={styles.showMoreBtn} onClick={handleToggleFavoritesLimit}>
              {favoritesLimit >= filteredFavorites.length ? "Show Less" : "Show More"}
              <span 
                className={styles.downArrow} 
                style={{ 
                  transform: favoritesLimit >= filteredFavorites.length ? 'rotate(180deg)' : 'none', 
                  transition: 'transform 0.3s ease',
                  display: 'flex',
                  alignItems: 'center'
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
        <div className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Products Related To Your Liking</h2>
          <div className={styles.carouselContainer}>
            {/* Left Nav */}
            <button 
              className={styles.carouselNavBtn} 
              onClick={handlePrevCarousel}
              disabled={carouselIndex === 0}
              style={{ opacity: carouselIndex === 0 ? 0.3 : 1, cursor: carouselIndex === 0 ? 'default' : 'pointer' }}
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
                            {item.originalPrice && (
                              <span className={styles.originalPrice}>{item.originalPrice}</span>
                            )}
                            <span className={styles.price}>{item.price}</span>
                          </div>
                        </div>
                        <div className={styles.actionButtons}>
                          <button className={styles.addBagBtn}>Add to Bag</button>
                          <button className={styles.buyNowBtn}>Buy Now</button>
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
              disabled={carouselIndex >= related.length - 4}
              style={{ opacity: carouselIndex >= related.length - 4 ? 0.3 : 1, cursor: carouselIndex >= related.length - 4 ? 'default' : 'pointer' }}
              aria-label="Next Related Products"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Luxury Footer Section */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrandCol}>
            <div className={styles.footerLogo}>
              {/* Luxury Serif Logo */}
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
              {/* Facebook Box */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.socialBox} aria-label="Facebook">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V2h-3c-2.9 0-5 1.55-5 4.5V8z"/>
                </svg>
              </a>
              {/* Instagram Box */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialBox} aria-label="Instagram">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* YouTube Box */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className={styles.socialBox} aria-label="YouTube">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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
