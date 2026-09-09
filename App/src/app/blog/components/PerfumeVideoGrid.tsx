"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PerfumeVideo, perfumeVideos as defaultVideos } from "../../data/blogData";
import styles from "./PerfumeVideoGrid.module.css";

const CATEGORIES = [
  "All Videos",
  "Bottle Showcase",
  "Scent Review",
  "Olfactory Notes",
  "Campaign Film",
];

// Helper to convert YouTube or Vimeo URLs into responsive embed links
function getEmbedInfo(url: string): { isEmbed: boolean; embedUrl: string } {
  if (!url) return { isEmbed: false, embedUrl: "" };

  // YouTube match
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      isEmbed: true,
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
    };
  }

  // Vimeo match
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      isEmbed: true,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  return { isEmbed: false, embedUrl: url };
}

export default function PerfumeVideoGrid() {
  const [videos, setVideos] = useState<PerfumeVideo[]>(defaultVideos);
  const [activeCategory, setActiveCategory] = useState("All Videos");
  const [selectedVideo, setSelectedVideo] = useState<PerfumeVideo | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Add Video
  const [formTitle, setFormTitle] = useState("");
  const [formPerfumeName, setFormPerfumeName] = useState("");
  const [formPerfumeSlug, setFormPerfumeSlug] = useState("");
  const [formCategory, setFormCategory] = useState<PerfumeVideo["category"]>("Bottle Showcase");
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formThumbnail, setFormThumbnail] = useState("");
  const [formDuration, setFormDuration] = useState("1:00");
  const [formDescription, setFormDescription] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);

  // Load user-added custom videos from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("murakkaz_custom_perfume_videos");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVideos([...parsed, ...defaultVideos]);
        }
      }
    } catch (e) {
      console.error("Could not load custom videos from storage", e);
    }
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedVideo(null);
        setIsAddModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenAddModal = () => {
    setFormTitle("");
    setFormPerfumeName("");
    setFormPerfumeSlug("");
    setFormCategory("Bottle Showcase");
    setFormVideoUrl("");
    setFormThumbnail("/images/products/blue_talisman.jpg");
    setFormDuration("1:00");
    setFormDescription("");
    setIsAddModalOpen(true);
  };

  const handlePerfumeNameChange = (val: string) => {
    setFormPerfumeName(val);
    setFormPerfumeSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formVideoUrl.trim()) {
      alert("Please provide at least a video title and a valid video URL.");
      return;
    }

    const newVideo: PerfumeVideo = {
      id: `custom-vid-${Date.now()}`,
      title: formTitle.trim(),
      perfumeName: formPerfumeName.trim() || "Murakkaz Artisanal",
      perfumeSlug: formPerfumeSlug.trim() || "blue-talisman",
      category: formCategory,
      description: formDescription.trim() || `Visual fragrance exploration of ${formPerfumeName || 'Murakkaz'}.`,
      videoUrl: formVideoUrl.trim(),
      thumbnail: formThumbnail.trim() || "/images/products/blue_talisman.jpg",
      duration: formDuration.trim() || "1:00",
      views: "1 view",
      featured: true,
      date: "Just Now",
    };

    const updated = [newVideo, ...videos];
    setVideos(updated);

    try {
      const existingSaved = localStorage.getItem("murakkaz_custom_perfume_videos");
      const existingList = existingSaved ? JSON.parse(existingSaved) : [];
      localStorage.setItem(
        "murakkaz_custom_perfume_videos",
        JSON.stringify([newVideo, ...existingList])
      );
    } catch (err) {
      console.error("Failed to save to localStorage", err);
    }

    setIsAddModalOpen(false);
  };

  // Filtered list
  const filteredVideos = videos.filter((v) => {
    if (activeCategory === "All Videos") return true;
    return v.category === activeCategory;
  });

  const embedInfo = selectedVideo ? getEmbedInfo(selectedVideo.videoUrl) : { isEmbed: false, embedUrl: "" };

  return (
    <section className={styles.section} aria-label="Perfume Video Cinema">
      {/* Section Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <span className={styles.eyebrow}>Olfactory Cinema & Reels</span>
          <h2 className={styles.sectionTitle}>Perfume in Motion</h2>
          <p className={styles.sectionSubtitle}>
            Immerse yourself in our cinematic bottle showcases, scent reviews, and visual accords engineered for fragrance enthusiasts.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className={styles.addVideoBtn}
            title="Add a new perfume video to this grid"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            + Add Perfume Video
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className={styles.filtersBar} role="tablist">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={`${styles.filterPill} ${activeCategory === cat ? styles.filterPillActive : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      <div className={styles.videoGrid}>
        {filteredVideos.map((video) => (
          <article key={video.id} className={styles.videoCard}>
            {/* Thumbnail Box */}
            <div
              className={styles.thumbnailWrapper}
              onClick={() => setSelectedVideo(video)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setSelectedVideo(video)}
              aria-label={`Play video: ${video.title}`}
            >
              <Image
                src={video.thumbnail || "/images/products/blue_talisman.jpg"}
                alt={video.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.thumbnailImg}
              />

              {/* Play Button Overlay */}
              <div className={styles.playOverlay}>
                <div className={styles.playCircle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 3 20 12 6 21 6 3"></polygon>
                  </svg>
                </div>
              </div>

              {/* Duration Badge */}
              <span className={styles.durationBadge}>{video.duration}</span>

              {/* Category Badge */}
              <span className={styles.categoryBadge}>{video.category}</span>
            </div>

            {/* Card Body */}
            <div className={styles.cardBody}>
              <div className={styles.perfumeMetaRow}>
                <Link
                  href={`/product/${video.perfumeSlug}`}
                  className={styles.perfumeLink}
                  title={`View ${video.perfumeName} product page`}
                >
                  <span>✦</span> {video.perfumeName}
                </Link>
                {video.views && <span className={styles.viewsCount}>{video.views}</span>}
              </div>

              <h3
                className={styles.videoTitle}
                onClick={() => setSelectedVideo(video)}
              >
                {video.title}
              </h3>

              <p className={styles.videoDesc}>{video.description}</p>

              <div className={styles.cardFooter}>
                <button
                  type="button"
                  onClick={() => setSelectedVideo(video)}
                  className={styles.watchBtn}
                >
                  Watch Reel
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>

                <Link
                  href={`/product/${video.perfumeSlug}`}
                  className={styles.shopFragranceBtn}
                >
                  Shop Scent
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox Video Player Modal */}
      {selectedVideo && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedVideo(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles.modalContent}
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className={styles.modalCloseBtn}
              aria-label="Close video player"
            >
              ✕
            </button>

            {/* Video Player */}
            <div className={styles.playerFrame}>
              {embedInfo.isEmbed ? (
                <iframe
                  src={embedInfo.embedUrl}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  key={selectedVideo.id}
                  controls
                  autoPlay
                  playsInline
                  poster={selectedVideo.thumbnail}
                >
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
              )}
            </div>

            {/* Modal Info Footer */}
            <div className={styles.modalBody}>
              <div className={styles.modalTopRow}>
                <span className={styles.modalCategory}>{selectedVideo.category}</span>
                <span style={{ fontSize: "0.8rem", color: "#8a8a8e" }}>
                  Duration: {selectedVideo.duration}
                </span>
              </div>

              <h2 className={styles.modalTitle}>{selectedVideo.title}</h2>
              <p className={styles.modalDesc}>{selectedVideo.description}</p>

              <div className={styles.modalActionRow}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#C5A880", fontSize: "0.85rem" }}>Featured Fragrance:</span>
                  <span style={{ fontWeight: 600, color: "#FFFFFF" }}>{selectedVideo.perfumeName}</span>
                </div>

                <Link
                  href={`/product/${selectedVideo.perfumeSlug}`}
                  className={styles.modalShopBtn}
                  onClick={() => setSelectedVideo(null)}
                >
                  Explore & Buy {selectedVideo.perfumeName}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* "Add Perfume Video" Modal Form */}
      {isAddModalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setIsAddModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles.addFormModal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.addFormTitle}>Add Perfume Video</h3>
            <p className={styles.addFormSubtitle}>
              Paste a local video link (e.g. <code>/videos/bottleAnimation.mp4</code>), an uploaded MP4 URL, or a YouTube video link.
            </p>

            <form onSubmit={handleAddVideoSubmit} className={styles.formGrid}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Video Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blue Talisman — Summer Projection Test"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className={styles.inputControl}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Perfume Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Blue Talisman"
                    value={formPerfumeName}
                    onChange={(e) => handlePerfumeNameChange(e.target.value)}
                    className={styles.inputControl}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className={styles.inputControl}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="Bottle Showcase">Bottle Showcase</option>
                    <option value="Scent Review">Scent Review</option>
                    <option value="Olfactory Notes">Olfactory Notes</option>
                    <option value="Campaign Film">Campaign Film</option>
                  </select>
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Video URL or YouTube Link *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /videos/bottleAnimation.mp4 or https://youtube.com/watch?v=..."
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  className={styles.inputControl}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Thumbnail Image URL</label>
                  <input
                    type="text"
                    placeholder="e.g. /images/products/blue_talisman.jpg"
                    value={formThumbnail}
                    onChange={(e) => setFormThumbnail(e.target.value)}
                    className={styles.inputControl}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 1:15"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className={styles.inputControl}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the perfume video, sillage notes, or sensory highlights..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className={styles.inputControl}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Add Video to Grid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
