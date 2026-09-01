"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import QuizCard from "./QuizCard";
import { slugify, fetchLiveProducts, Product } from "../../data/products";
import {
  quizQuestions,
  getTop3Recommendations,
  type QuizRecommendation,
} from "../data/scentIndexData";
import styles from "./ScentIndex.module.css";

export default function ScentIndex() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<"intro" | "consultation" | "loading" | "results">("intro");
  const [isTransitioningIntro, setIsTransitioningIntro] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [transitioningStep, setTransitioningStep] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<QuizRecommendation[]>([]);
  const [particles, setParticles] = useState<Array<{ id: number; left: string; top: string; delay: string; size: string }>>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Restore quiz state or check for ?state=loading parameter
  useEffect(() => {
    const stateParam = searchParams?.get("state");
    if (stateParam === "loading") {
      setPhase("loading");
      return;
    }
    try {
      const savedPhase = sessionStorage.getItem("scent-quiz-phase");
      const savedAnswers = sessionStorage.getItem("scent-quiz-answers");
      const savedRecommendations = sessionStorage.getItem("scent-quiz-recommendations");
      const savedCurrentStep = sessionStorage.getItem("scent-quiz-current-step");

      // Never restore "loading" from sessionStorage on refresh
      if (savedPhase && savedPhase !== "loading") {
        setPhase(savedPhase as any);
      } else if (savedPhase === "loading") {
        sessionStorage.removeItem("scent-quiz-phase");
        setPhase("intro");
      }

      if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
      if (savedRecommendations) setRecommendations(JSON.parse(savedRecommendations));
      if (savedCurrentStep) setCurrentStep(Number(savedCurrentStep));
    } catch (e) {
      console.error("Failed to restore quiz state", e);
    }
  }, [searchParams]);

  // Save quiz state to sessionStorage when it changes
  useEffect(() => {
    try {
      if (phase === "intro" || phase === "loading") {
        sessionStorage.removeItem("scent-quiz-phase");
        if (phase === "intro") {
          sessionStorage.removeItem("scent-quiz-answers");
          sessionStorage.removeItem("scent-quiz-recommendations");
          sessionStorage.removeItem("scent-quiz-current-step");
        }
      } else {
        sessionStorage.setItem("scent-quiz-phase", phase);
        sessionStorage.setItem("scent-quiz-answers", JSON.stringify(answers));
        sessionStorage.setItem("scent-quiz-recommendations", JSON.stringify(recommendations));
        sessionStorage.setItem("scent-quiz-current-step", String(currentStep));
      }
    } catch (e) {
      console.error("Failed to save quiz state", e);
    }
  }, [phase, answers, recommendations, currentStep]);

  // Generate ambient floating particles
  useEffect(() => {
    const isAmbientDisabled = localStorage.getItem("pref-ambient") === "false";
    if (isAmbientDisabled) {
      setParticles([]);
      return;
    }
    const pts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 4 + 2}px`,
    }));
    setParticles(pts);
  }, []);

  const [isSealPressed, setIsSealPressed] = useState(false);
  const [isSealedCracked, setIsSealedCracked] = useState(false);

  const handleSealClick = () => {
    if (isSealPressed || isSealedCracked) return;

    setIsSealPressed(true);

    setTimeout(() => {
      setIsSealPressed(false);
      setIsSealedCracked(true);
      setIsTransitioningIntro(true);

      setTimeout(() => {
        setPhase("consultation");
        setIsTransitioningIntro(false);
      }, 700);
    }, 200);
  };

  const handleSelect = (questionId: number, option: string) => {
    const question = quizQuestions.find((q) => q.id === questionId);
    if (!question) return;

    if (question.type === "multi") {
      const current = (answers[questionId] as string[]) || [];
      const updated = current.includes(option)
        ? current.filter((opt) => opt !== option)
        : [...current, option];
      setAnswers((prev) => ({ ...prev, [questionId]: updated }));
    } else {
      setAnswers((prev) => ({ ...prev, [questionId]: option }));
    }
  };

  const handleNext = async () => {
    const currentQ = quizQuestions[currentStep];
    const currentAns = answers[currentQ.id];
    if (!currentAns || (Array.isArray(currentAns) && currentAns.length === 0)) return;

    if (currentStep < quizQuestions.length - 1) {
      setTransitioningStep(currentStep);
      setCurrentStep((prev) => prev + 1);
      setTimeout(() => setTransitioningStep(null), 600);
    } else {
      setTransitioningStep(currentStep);
      setTimeout(async () => {
        setPhase("loading");
        setTransitioningStep(null);

        // Fetch live catalog to compute recommendations
        const liveCatalog = await fetchLiveProducts();
        const recs = getTop3Recommendations(answers, liveCatalog);
        setRecommendations(recs);

        setTimeout(() => {
          setPhase("results");
        }, 1400);
      }, 500);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setRecommendations([]);
    setPhase("intro");
  };

  const handleAddToCart = (product: Product) => {
    try {
      const savedCart = localStorage.getItem("cart-items");
      let cart = savedCart ? JSON.parse(savedCart) : [];
      const existingIndex = cart.findIndex((item: any) => item.name === product.name && item.volume === "10ml");

      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({
          id: `quiz-item-${Date.now()}-${product.id}`,
          productId: product.id,
          name: product.name,
          brand: product.brand || "Murakkaz",
          price: product.priceVal || 300,
          originalPrice: product.originalPriceVal || 400,
          volume: "10ml",
          image: product.image,
          quantity: 1,
          selected: true,
        });
      }

      localStorage.setItem("cart-items", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      setToastMessage(`Added ${product.name} (10ml) to your shopping bag!`);
    } catch (e) {
      console.error("Error adding to cart:", e);
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const isNextDisabled = () => {
    const currentQ = quizQuestions[currentStep];
    const currentAns = answers[currentQ.id];
    return !currentAns || (Array.isArray(currentAns) && currentAns.length === 0);
  };

  return (
    <div className={styles.quizPage}>
      {/* Background Ambient Particles */}
      <div className={styles.particlesContainer}>
        {particles.map((pt) => (
          <div
            key={pt.id}
            className={styles.particle}
            style={{ left: pt.left, top: pt.top, animationDelay: pt.delay, width: pt.size, height: pt.size }}
          />
        ))}
      </div>

      {/* Main Page Layout Wrapper */}
      <main className={`${styles.mainContent} ${phase === "results" ? styles.mainContentResults : ""}`}>

        {/* ── INTRO LAYER ── Doors + wax seal overlay */}
        {(phase === "intro" || isTransitioningIntro) && (
          <div
            className={`${styles.introContainer} ${isTransitioningIntro ? styles.introLeaving : ""}`}
            suppressHydrationWarning
          >
            {/* Left door */}
            <div className={`${styles.introDoor} ${styles.introDoorLeft}`}>
              {isSealedCracked && (
                <div className={`${styles.waxSealHalf} ${styles.waxSealLeft}`}>
                  <div className={styles.sealLogoWrapperHalfLeft}>
                    <Image src="/images/logo-murakkaz.svg" alt="Murakkaz Logo Left" width={88} height={38} priority className={styles.sealLogo} suppressHydrationWarning />
                  </div>
                </div>
              )}
            </div>

            {/* Right door */}
            <div className={`${styles.introDoor} ${styles.introDoorRight}`}>
              {isSealedCracked && (
                <div className={`${styles.waxSealHalf} ${styles.waxSealRight}`}>
                  <div className={styles.sealLogoWrapperHalfRight}>
                    <Image src="/images/logo-murakkaz.svg" alt="Murakkaz Logo Right" width={88} height={38} priority className={styles.sealLogo} suppressHydrationWarning />
                  </div>
                </div>
              )}
            </div>

            {/* Content overlay */}
            <div className={styles.introContent}>
              <div className={styles.introTextGroup}>
                <div className={styles.introHeader}>
                  <h1 className={styles.introHeading}>Discover Your Signature Fragrance</h1>
                </div>
                <p className={styles.introBody}>
                  Every fragrance tells a different story. Answer seven carefully created questions and we&apos;ll recommend the fragrances that best match your personality, preferences, and lifestyle.
                </p>
              </div>

              <div className={styles.sealInteractionArea} suppressHydrationWarning>
                {!isTransitioningIntro && (
                  <div
                    className={`${styles.waxSealWrapper} ${isSealPressed ? styles.sealPressed : ""} ${isSealedCracked ? styles.sealCracked : ""}`}
                    onClick={handleSealClick}
                    suppressHydrationWarning
                  >
                    <div className={styles.waxSealIntact}>
                      <div className={styles.sealLogoWrapper}>
                        <Image src="/images/logo-murakkaz.svg" alt="Murakkaz Logo" width={88} height={38} priority className={styles.sealLogo} />
                      </div>
                    </div>
                    {isSealedCracked && (
                      <div className={styles.waxFragments}>
                        <span className={`${styles.fragment} ${styles.frag1}`} />
                        <span className={`${styles.fragment} ${styles.frag2}`} />
                        <span className={`${styles.fragment} ${styles.frag3}`} />
                        <span className={`${styles.fragment} ${styles.frag4}`} />
                      </div>
                    )}
                  </div>
                )}
                <span className={styles.sealPrompt}>
                  {isSealedCracked ? "Opening..." : "Unseal Your Consultation"}
                </span>
              </div>

              <div className={styles.introFooter}>
                7 Questions &bull; Takes Less Than 2 Minutes
              </div>
            </div>
          </div>
        )}

        {/* ── QUIZ LAYER ── */}
        {(phase === "intro" || phase === "consultation" || isTransitioningIntro) && (
          <div className={`${styles.quizContainer} ${phase === "intro" && !isTransitioningIntro ? styles.quizHidden : ""} ${isTransitioningIntro ? styles.quizContainerEnter : ""}`}>
            {/* Progress markers */}
            <div className={styles.progressMarkers}>
              {quizQuestions.map((_, idx) => (
                <div
                  key={idx}
                  className={`${styles.marker} ${idx === currentStep ? styles.markerActive : ""} ${idx < currentStep ? styles.markerPassed : ""}`}
                />
              ))}
            </div>

            {/* Card stack */}
            <div className={styles.cardStack}>
              {quizQuestions.map((q, idx) => {
                const isLeaving = transitioningStep === idx;
                const isTop = idx === currentStep;
                const depth = idx - currentStep;

                if (idx < currentStep && !isLeaving) return null;

                return (
                  <QuizCard
                    key={q.id}
                    question={q}
                    selectedAnswers={answers[q.id] || (q.type === "multi" ? [] : "")}
                    onSelect={(opt) => handleSelect(q.id, opt)}
                    isTop={isTop}
                    depth={depth}
                    isLeaving={isLeaving}
                    onNext={handleNext}
                    onBack={handleBack}
                    isNextDisabled={isNextDisabled()}
                    showBackButton={currentStep > 0}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ── LOADING LAYER ── */}
        {phase === "loading" && (
          <div className={styles.loadingContainer}>
            <div className={styles.paperGrainTexture} />
            <div className={styles.logoLoaderContainer}>
              <div className={styles.logoWrapperLoading}>
                <Image
                  src="/images/logo-murakkaz.svg"
                  alt="Murakkaz Logo Scent Analysis"
                  width={140}
                  height={50}
                  priority
                  className={styles.animatedLogo}
                />
              </div>
            </div>
            <h2 className={styles.loadingText}>Analyzing your profile...</h2>
            <p className={styles.loadingSubtext}>
              Selecting the ideal signature notes to reflect your desired presence
            </p>
          </div>
        )}

        {/* ── RESULTS LAYER ── */}
        {phase === "results" && recommendations.length > 0 && (
          <div className={styles.resultsGridWrapper}>
            <div className={styles.fadeUpProfile}>
              {(() => {
                const profile = getFragranceProfile(answers);
                return (
                  <div className={styles.profileSection}>
                    <div className={styles.profileIcon}>✨ Your Fragrance Profile</div>
                    <h2 className={styles.profileHeading}>{profile.name}</h2>
                    <p className={styles.profileDescription}>{profile.description}</p>
                    <div className={styles.profileTags}>
                      {profile.tags.map((tag) => (
                        <span key={tag} className={styles.profileTag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className={styles.fadeUpRecommendations}>
              <div className={styles.recommendationHeader}>
                <h3 className={styles.recommendationHeading}>Recommended For You</h3>
                <p className={styles.recommendationSubheading}>
                  Based on your fragrance profile, these Murakkaz selections are the closest match to your preferences.
                </p>
              </div>

              <div className={styles.resultsGrid}>
                {recommendations.map((rec, index) => {
                  const recSlug = (rec.product as any).slug || slugify(rec.product.name) || rec.product.id;
                  const handleCardClick = (e: React.MouseEvent) => {
                    const target = e.target as HTMLElement;
                    if (target.closest("button")) return;
                    router.push(`/product/${recSlug}?from=quiz`);
                  };

                  return (
                    <div key={rec.product.id} className={styles.cardEntryWrapper}>
                      <div
                        className={`${styles.resultsNarrowCard} ${index === 0 ? styles.resultsFirstCard : ""}`}
                        style={{ cursor: "pointer" }}
                        onClick={handleCardClick}
                      >
                        <div className={styles.cardHeader}>
                          <span className={`${styles.matchBadge} ${index > 0 ? styles.matchBadgeMuted : ""}`}>
                            {rec.matchScore}% Match &bull; {index === 0 ? "Best Match" : index === 1 ? "Second Pick" : "Alternative Pick"}
                          </span>
                        </div>

                        <div className={styles.cardImgWrapper}>
                          <Image src={rec.product.image} alt={rec.product.name} width={280} height={200} className={styles.cardImg} priority={index === 0} />
                        </div>

                        <h3 className={styles.cardTitle}>{rec.product.name}</h3>
                        <p className={styles.cardInspiration}>{rec.inspiration}</p>
                        <p className={styles.cardText}>{rec.reason}</p>

                        {/* Display Key Notes */}
                        {rec.keyNotes && rec.keyNotes.length > 0 && (
                          <div className={styles.keyNotesContainer}>
                            <span className={styles.keyNotesLabel}>Key Notes:</span>
                            <span className={styles.keyNotesText}>{rec.keyNotes.join(", ")}</span>
                          </div>
                        )}

                        <div className={styles.scentProfileTags}>
                          {rec.profileTags?.map((tag) => (
                            <span key={tag} className={styles.scentTag}>{tag}</span>
                          ))}
                        </div>

                        <div className={styles.performanceLine}>{rec.performance}</div>

                        <div className={styles.cardActions}>
                          <button
                            type="button"
                            className={styles.quizBuyNowBtn}
                            onClick={() => router.push(`/product/${recSlug}?from=quiz`)}
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            className={styles.quizAddToCartBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(rec.product);
                            }}
                          >
                            Add 10ml Bag
                          </button>
                          <button
                            type="button"
                            className={styles.quizAddBagBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/compare?add=${rec.product.id}&image=${encodeURIComponent(rec.product.image)}&name=${encodeURIComponent(rec.product.name)}`);
                            }}
                          >
                            Compare
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.fadeUpActions}>
              <div className={styles.stillExploringHeader}>
                <h4 className={styles.stillExploringHeading}>Still exploring your signature scent?</h4>
              </div>
              <div className={styles.resultsResetContainer}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnNext}`}
                  style={{ padding: "0.5rem 2.5rem", height: "42px", borderRadius: "21px", minWidth: "180px", textTransform: "none", fontSize: "0.85rem" }}
                  onClick={() => {
                    const rec1 = recommendations[0];
                    const rec2 = recommendations[1];
                    const rec3 = recommendations[2];
                    router.push(`/compare?p1=${encodeURIComponent(rec1.product.image)}&p2=${encodeURIComponent(rec2.product.image)}&p3=${encodeURIComponent(rec3.product.image)}`);
                  }}
                >
                  Compare All Three
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnRedOutline}`}
                  style={{ padding: "0.5rem 2.5rem", height: "42px", borderRadius: "21px", minWidth: "180px", textTransform: "none", fontSize: "0.85rem" }}
                  onClick={handleReset}
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      <div className={styles.toastWrapper}>
        {toastMessage && (
          <div className={styles.toast}>
            <div className={styles.toastText}>{toastMessage}</div>
            <div className={styles.toastActions}>
              <span className={styles.toastLink} onClick={() => { window.location.href = "/cart"; }}>View Bag</span>
              <button className={styles.toastClose} onClick={() => setToastMessage(null)}>Dismiss</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface FragranceProfile { name: string; description: string; tags: string[]; }

function getFragranceProfile(answers: Record<number, string | string[]>): FragranceProfile {
  const occasion = answers[2] as string | undefined;
  const scentStyles = (answers[5] as string[]) || [];
  const personality = answers[7] as string | undefined;

  if (personality === "Bold" || scentStyles.includes("Oud") || scentStyles.includes("Leather")) {
    return { name: "Bold & Intense", description: "A powerful statement of confidence and raw sophistication. Formulated for those who seek to command attention, combining deep woods and commanding accords that linger beautifully.", tags: ["Bold", "Woody", "Warm", "Confident"] };
  }
  if (personality === "Mysterious") {
    return { name: "Warm & Mysterious", description: "You prefer fragrances that carry a sense of intrigue, drawing others in slowly. The blend of rich spices, warm amber, and deep notes matches your desire for a magnetic presence that keeps people guessing.", tags: ["Warm", "Elegant", "Sophisticated", "Romantic"] };
  }
  if (personality === "Romantic" || scentStyles.includes("Floral") || scentStyles.includes("Fruity")) {
    return { name: "Romantic & Charming", description: "You are drawn to soft, floral, and slightly sweet compositions that evoke warmth and intimacy. This profile is perfect for special dates and moments where you want to leave a gentle, charming trail.", tags: ["Romantic", "Fresh", "Elegant", "Sophisticated"] };
  }
  if (occasion === "Office" || personality === "Elegant") {
    return { name: "Professional & Refined", description: "Your taste leans towards structured, clean, and balanced accords. You appreciate fragrances that convey poise, polish, and understated elegance, making them suitable for professional environments and formal occasions.", tags: ["Elegant", "Sophisticated", "Minimal", "Confident"] };
  }
  if (scentStyles.includes("Citrus") || scentStyles.includes("Fresh") || scentStyles.includes("Aquatic")) {
    return { name: "Fresh & Energetic", description: "You enjoy bright, uplifting, and crisp notes that mimic the clean air of the ocean or citrus groves. This energetic profile matches an active, modern lifestyle where clean comfort is paramount.", tags: ["Fresh", "Minimal", "Modern", "Confident"] };
  }
  if (personality === "Minimal") {
    return { name: "Modern & Minimal", description: "You appreciate clean, subtle skin scents that whisper rather than shout. This minimal profile matches your modern, streamlined aesthetic, focusing on pure, high-quality ingredients that complement your natural presence.", tags: ["Minimal", "Modern", "Fresh", "Elegant"] };
  }
  return { name: "Classic & Timeless", description: "You appreciate balanced, traditional fragrance structures that never go out of style. Combining elements of citrus freshness with woody refinement, this classic profile matches your appreciation for quality and heritage.", tags: ["Classic", "Elegant", "Sophisticated"] };
}
