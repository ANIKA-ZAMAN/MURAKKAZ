"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import QuizCard from "./QuizCard";
import {
  quizQuestions,
  getQuizRecommendation,
  getTop3Recommendations,
  type QuizRecommendation,
} from "../data/scentIndexData";
import { Product } from "../../data/products";
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
        }, 2500); // Elegant loading delay
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

  const handleAddToCart = (prod: Product) => {
    const saved = localStorage.getItem("cart-items");
    let cart = [];
    if (saved) {
      try {
        cart = JSON.parse(saved);
      } catch (e) {
        cart = [];
      }
    }
    const existing = cart.find((item: any) => item.name === prod.name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        priceVal: prod.priceVal,
        image: prod.image,
        quantity: 1,
        selectedSize: "100ml", // default size for quiz results
        prices: {
          "100ml": prod.priceVal
        },
        originalPrices: {
          "100ml": prod.priceVal * 1.2
        },
        selected: true
      });
    }
    localStorage.setItem("cart-items", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    setToastMessage(`Added 1x ${prod.name} (100ml) to your bag!`);
  };

  const handleBuyNow = (prod: Product) => {
    // Add item to cart
    const saved = localStorage.getItem("cart-items");
    let cart = [];
    if (saved) {
      try {
        cart = JSON.parse(saved);
      } catch (e) {
        cart = [];
      }
    }
    const existing = cart.find((item: any) => item.name === prod.name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        priceVal: prod.priceVal,
        image: prod.image,
        quantity: 1,
        selectedSize: "100ml",
        prices: {
          "100ml": prod.priceVal
        },
        originalPrices: {
          "100ml": prod.priceVal * 1.2
        },
        selected: true
      });
    }
    localStorage.setItem("cart-items", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    window.location.href = "/cart";
  };

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
                  Every fragrance tells a different story. Answer seven carefully created questions and we'll recommend the fragrances that best match your personality, preferences, and lifestyle.
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
            <div className={styles.resultsGrid}>
              {recommendations.map((rec, index) => {
                const handleCardClick = (e: React.MouseEvent) => {
                  const target = e.target as HTMLElement;
                  if (target.closest(`.${styles.btnNext}`)) {
                    return;
                  }
                  router.push(`/product/${rec.product.id}`);
                };

                return (
                  <div 
                    key={rec.product.id} 
                    className={styles.cardEntryWrapper}
                    style={{ animationDelay: `${0.38 * index}s` }}
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
                          className={styles.quizAddBagBtn}
                          onClick={() => handleAddToCart(rec.product)}
                        >
                          Add to Bag
                        </button>
                        <button
                          type="button"
                          className={styles.quizBuyNowBtn}
                          onClick={() => handleBuyNow(rec.product)}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
            })}
            </div>

            {/* Centered Action Buttons at the bottom */}
            <div className={styles.resultsResetContainer}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnRedOutline}`}
                style={{ padding: "0.5rem 2rem", height: "40px", borderRadius: "20px" }}
                onClick={handleReset}
              >
                Try Quiz Again
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnRedOutline}`}
                style={{ padding: "0.5rem 2rem", height: "40px", borderRadius: "20px" }}
                onClick={() => { window.location.href = "/compare"; }}
              >
                Compare Scents
              </button>
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
