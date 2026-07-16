"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import QuizCard from "./QuizCard";
import {
  quizQuestions,
  getTop3Recommendations,
  type QuizRecommendation,
} from "../data/scentIndexData";
import styles from "./ScentIndex.module.css";

export default function ScentIndex() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "consultation" | "loading" | "results">("intro");
  const [isTransitioningIntro, setIsTransitioningIntro] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [transitioningStep, setTransitioningStep] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<QuizRecommendation[]>([]);
  const [particles, setParticles] = useState<Array<{ id: number; left: string; top: string; delay: string; size: string }>>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Restore quiz state from sessionStorage on mount
  useEffect(() => {
    try {
      const savedPhase = sessionStorage.getItem("scent-quiz-phase");
      const savedAnswers = sessionStorage.getItem("scent-quiz-answers");
      const savedRecommendations = sessionStorage.getItem("scent-quiz-recommendations");
      const savedCurrentStep = sessionStorage.getItem("scent-quiz-current-step");

      if (savedPhase) {
        setPhase(savedPhase as any);
      }
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
      if (savedRecommendations) {
        setRecommendations(JSON.parse(savedRecommendations));
      }
      if (savedCurrentStep) {
        setCurrentStep(Number(savedCurrentStep));
      }
    } catch (e) {
      console.error("Failed to restore quiz state", e);
    }
  }, []);

  // Save quiz state to sessionStorage when it changes
  useEffect(() => {
    try {
      if (phase === "intro") {
        sessionStorage.removeItem("scent-quiz-phase");
        sessionStorage.removeItem("scent-quiz-answers");
        sessionStorage.removeItem("scent-quiz-recommendations");
        sessionStorage.removeItem("scent-quiz-current-step");
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

  // Generate random particles positions on mount
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
    

    
    // 1. Compress slightly
    setIsSealPressed(true);
    
    setTimeout(() => {
      // 2. Crack appears & fragments fall
      setIsSealPressed(false);
      setIsSealedCracked(true);
      
      // 3. Doors split and slide open
      setTimeout(() => {
        setIsTransitioningIntro(true);
        if (typeof window !== 'undefined') {
          const audio = new Audio('/audio/paper-sound.wav');
          audio.volume = 0.8;
          audio.play().catch((err) => console.log('Audio play failed:', err));
        }
        setTimeout(() => {
          setPhase("consultation");
          setIsTransitioningIntro(false);
        }, 900); // 850ms transition duration
      }, 500); // Wait 500ms for fragments to drop
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

  const handleNext = () => {
    // Validate that current question has a selection
    const currentQ = quizQuestions[currentStep];
    const currentAns = answers[currentQ.id];
    if (!currentAns || (Array.isArray(currentAns) && currentAns.length === 0)) return;

    if (currentStep < quizQuestions.length - 1) {
      // Trigger leave animation on current card and advance immediately
      setTransitioningStep(currentStep);
      setCurrentStep((prev) => prev + 1);

      // Clear leaving state after animation completes
      setTimeout(() => {
        setTransitioningStep(null);
      }, 600); // Match physicalRemove animation duration
    } else {
      // Final step - transition to loading
      setTransitioningStep(currentStep);
      
      setTimeout(() => {
        setPhase("loading");
        setTransitioningStep(null);

        // Calculate recommendation and transition to results
        const recs = getTop3Recommendations(answers);
        setRecommendations(recs);

        setTimeout(() => {
          setPhase("results");
        }, 1500); // Elegant loading delay (1-2 seconds)
      }, 500);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setRecommendations([]);
    setPhase("intro");
  };

  // Auto-hide toast messages
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
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
      {/* Background Ambient Particles & Vignette */}
      <div className={styles.vignette} />
      <div className={styles.particlesContainer}>
        {particles.map((pt) => (
          <div
            key={pt.id}
            className={styles.particle}
            style={{
              left: pt.left,
              top: pt.top,
              animationDelay: pt.delay,
              width: pt.size,
              height: pt.size,
            }}
          />
        ))}
      </div>

      {/* Main Page Layout Wrapper */}
      <main className={`${styles.mainContent} ${phase === "results" ? styles.mainContentResults : ""}`}>
        {(phase === "intro" || isTransitioningIntro) && (
          <div 
            className={`${styles.introContainer} ${isTransitioningIntro ? styles.introLeaving : ""}`}
            onClick={handleSealClick}
            style={{ cursor: (!isSealPressed && !isSealedCracked) ? "pointer" : "default" }}
          >
            {/* The split wooden/paper doors */}
            <div className={`${styles.introDoor} ${styles.introDoorLeft}`}>
              {/* Left broken seal half attached to the edge */}
              {isSealedCracked && (
                <div className={`${styles.waxSealHalf} ${styles.waxSealLeft}`}>
                  <div className={styles.sealLogoWrapperHalfLeft}>
                    <Image
                      src="/images/logo-murakkaz.svg"
                      alt="Murakkaz Logo Left"
                      width={88}
                      height={38}
                      priority
                      className={styles.sealLogo}
                      suppressHydrationWarning
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className={`${styles.introDoor} ${styles.introDoorRight}`}>
              {/* Right broken seal half attached to the edge */}
              {isSealedCracked && (
                <div className={`${styles.waxSealHalf} ${styles.waxSealRight}`}>
                  <div className={styles.sealLogoWrapperHalfRight}>
                    <Image
                      src="/images/logo-murakkaz.svg"
                      alt="Murakkaz Logo Right"
                      width={88}
                      height={38}
                      priority
                      className={styles.sealLogo}
                      suppressHydrationWarning
                    />
                  </div>
                </div>
              )}
            </div>

            {/* The content overlay */}
            <div className={styles.introContent}>
              <div className={styles.introTextGroup}>
                <div className={styles.introHeader}>
                  <span className={styles.introLabel}>MURAKKAZ</span>
                  <h1 className={styles.introHeading}>Discover Your Signature Fragrance</h1>
                </div>
                
                <p className={styles.introBody}>
                  Every fragrance tells a different story. Answer seven carefully created questions and we&apos;ll recommend the fragrances that best match your personality, preferences, and lifestyle.
                </p>
              </div>
              
              {/* Wax Seal Interaction Section (instead of button) */}
              <div className={styles.sealInteractionArea} suppressHydrationWarning>
                {!isTransitioningIntro && (
                  <div 
                    className={`${styles.waxSealWrapper} ${isSealPressed ? styles.sealPressed : ""} ${isSealedCracked ? styles.sealCracked : ""}`}
                    onClick={handleSealClick}
                    suppressHydrationWarning
                  >
                    {/* The intact wax seal with official logo */}
                    <div className={styles.waxSealIntact}>
                      <div className={styles.sealLogoWrapper}>
                        <Image
                          src="/images/logo-murakkaz.svg"
                          alt="Murakkaz Logo"
                          width={88}
                          height={38}
                          priority
                          className={styles.sealLogo}
                        />
                      </div>
                    </div>

                    {/* Falling wax fragments */}
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

        {(phase === "intro" || phase === "consultation" || isTransitioningIntro) && (
          <div className={`${styles.quizContainer} ${phase === "intro" && !isTransitioningIntro ? styles.quizHidden : ""} ${isTransitioningIntro ? styles.quizContainerEnter : ""}`}>
            {/* 1. Progress markers above the stack */}
            <div className={styles.progressMarkers}>
              {quizQuestions.map((_, idx) => (
                <div
                  key={idx}
                  className={`${styles.marker} ${idx === currentStep ? styles.markerActive : ""} ${idx < currentStep ? styles.markerPassed : ""}`}
                />
              ))}
            </div>

            {/* 2. Interactive Stack of 7 Cards */}
            <div className={styles.cardStack}>
              {quizQuestions.map((q, idx) => {
                const isLeaving = transitioningStep === idx;
                const isTop = idx === currentStep;
                const depth = idx - currentStep;

                // Render cards that are either active, upcoming, or currently leaving
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

        {/* 4. Elegant Loading Consultation Transition */}
        {phase === "loading" && (
          <div className={styles.loadingContainer}>
            <div className={styles.paperGrainTexture} />
            <div className={styles.loaderSpinner}>
              <div className={styles.spinnerCircle} />
            </div>
            <h2 className={styles.loadingText}>Analyzing your profile...</h2>
            <p className={styles.loadingSubtext}>
              Selecting the ideal signature notes to reflect your desired presence
            </p>
          </div>
        )}

        {/* 5. Consultation Results Page */}
        {phase === "results" && recommendations.length > 0 && (
          <div className={styles.resultsGridWrapper}>
            <div className={styles.fadeUpProfile}>
              {(() => {
                const profile = getFragranceProfile(answers);
                return (
                  <div className={styles.profileSection}>
                    <div className={styles.profileIcon}>✨ Your Fragrance Profile</div>
                    <h2 className={styles.profileHeading}>{profile.name}</h2>
                    <div className={styles.profileDivider} />
                    <p className={styles.profileDescription}>{profile.description}</p>
                    <div className={styles.profileDivider} />
                    <div className={styles.profileTags}>
                      {profile.tags.map((tag) => (
                        <span key={tag} className={styles.profileTag}>
                          {tag}
                        </span>
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
                  const handleCardClick = (e: React.MouseEvent) => {
                    const target = e.target as HTMLElement;
                    if (target.closest("button")) {
                      return;
                    }
                    router.push(`/product/${rec.product.id}?from=quiz`);
                  };

                  return (
                    <div 
                      key={rec.product.id} 
                      className={styles.cardEntryWrapper}
                    >
                      <div 
                        className={`${styles.resultsNarrowCard} ${index === 0 ? styles.resultsFirstCard : ""}`}
                        style={{ cursor: "pointer" }}
                        onClick={handleCardClick}
                      >
                        <div className={styles.cardHeader}>
                          <span className={`${styles.matchBadge} ${index > 0 ? styles.matchBadgeMuted : ""}`}>
                            {index === 0 ? "Best Match" : index === 1 ? "Second pick" : "Alternative Choice"}
                          </span>
                        </div>

                        <div className={styles.cardImgWrapper}>
                          <Image
                            src={rec.product.image}
                            alt={rec.product.name}
                            width={280}
                            height={200}
                            className={styles.cardImg}
                            priority={index === 0}
                          />
                        </div>

                        <h3 className={styles.cardTitle}>{rec.product.name}</h3>
                        <p className={styles.cardInspiration}>{rec.inspiration}</p>
                        <p className={styles.cardText}>{rec.reason}</p>

                        {/* Scent Profile Tags */}
                        <div className={styles.scentProfileTags}>
                          {rec.profileTags?.map((tag) => (
                            <span key={tag} className={styles.scentTag}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Performance */}
                        <div className={styles.performanceLine}>
                          {rec.performance}
                        </div>

                        <div className={styles.cardActions}>
                          <button
                            type="button"
                            className={styles.quizBuyNowBtn}
                            onClick={() => {
                              router.push(`/product/${rec.product.id}?from=quiz`);
                            }}
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            className={styles.quizAddBagBtn}
                            onClick={() => {
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
              {/* Premium Action Section Header */}
              <div className={styles.stillExploringHeader}>
                <h4 className={styles.stillExploringHeading}>Still exploring your signature scent?</h4>
              </div>

              {/* Centered Action Buttons at the bottom */}
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

      {/* Toast Alert Box Wrapper */}
      <div className={styles.toastWrapper}>
        {toastMessage && (
          <div className={styles.toast}>
            <div className={styles.toastText}>{toastMessage}</div>
            <div className={styles.toastActions}>
              <span className={styles.toastLink} onClick={() => { window.location.href = "/cart"; }}>
                View Bag
              </span>
              <button className={styles.toastClose} onClick={() => setToastMessage(null)}>
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface FragranceProfile {
  name: string;
  description: string;
  tags: string[];
}

function getFragranceProfile(answers: Record<number, string | string[]>): FragranceProfile {
  const occasion = answers[2] as string | undefined;
  const scentStyles = (answers[5] as string[]) || [];
  const personality = answers[7] as string | undefined;

  if (personality === "Bold" || scentStyles.includes("Oud") || scentStyles.includes("Leather")) {
    return {
      name: "Bold & Intense",
      description: "A powerful statement of confidence and raw sophistication. Formulated for those who seek to command attention, combining deep woods and commanding accords that linger beautifully.",
      tags: ["Bold", "Woody", "Warm", "Confident"]
    };
  }
  if (personality === "Mysterious") {
    return {
      name: "Warm & Mysterious",
      description: "You prefer fragrances that carry a sense of intrigue, drawing others in slowly. The blend of rich spices, warm amber, and deep notes matches your desire for a magnetic presence that keeps people guessing.",
      tags: ["Warm", "Elegant", "Sophisticated", "Romantic"]
    };
  }
  if (personality === "Romantic" || scentStyles.includes("Floral") || scentStyles.includes("Fruity")) {
    return {
      name: "Romantic & Charming",
      description: "You are drawn to soft, floral, and slightly sweet compositions that evoke warmth and intimacy. This profile is perfect for special dates and moments where you want to leave a gentle, charming trail.",
      tags: ["Romantic", "Fresh", "Elegant", "Sophisticated"]
    };
  }
  if (occasion === "Office" || personality === "Elegant") {
    return {
      name: "Professional & Refined",
      description: "Your taste leans towards structured, clean, and balanced accords. You appreciate fragrances that convey poise, polish, and understated elegance, making them suitable for professional environments and formal occasions.",
      tags: ["Elegant", "Sophisticated", "Minimal", "Confident"]
    };
  }
  if (scentStyles.includes("Citrus") || scentStyles.includes("Fresh") || scentStyles.includes("Aquatic")) {
    return {
      name: "Fresh & Energetic",
      description: "You enjoy bright, uplifting, and crisp notes that mimic the clean air of the ocean or citrus groves. This energetic profile matches an active, modern lifestyle where clean comfort is paramount.",
      tags: ["Fresh", "Minimal", "Modern", "Confident"]
    };
  }
  if (personality === "Minimal") {
    return {
      name: "Modern & Minimal",
      description: "You appreciate clean, subtle skin scents that whisper rather than shout. This minimal profile matches your modern, streamlined aesthetic, focusing on pure, high-quality ingredients that complement your natural presence.",
      tags: ["Minimal", "Modern", "Fresh", "Elegant"]
    };
  }
  return {
    name: "Classic & Timeless",
    description: "You appreciate balanced, traditional fragrance structures that never go out of style. Combining elements of citrus freshness with woody refinement, this classic profile matches your appreciation for quality and heritage.",
    tags: ["Classic", "Elegant", "Sophisticated", "Sophisticated"]
  };
}
