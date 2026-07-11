"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import QuizCard from "./QuizCard";
import {
  quizQuestions,
  getQuizRecommendation,
  type QuizRecommendation,
} from "../data/scentIndexData";
import styles from "./ScentIndex.module.css";

export default function ScentIndex() {
  const [phase, setPhase] = useState<"intro" | "consultation" | "loading" | "results">("intro");
  const [isTransitioningIntro, setIsTransitioningIntro] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [transitioningStep, setTransitioningStep] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<QuizRecommendation | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; left: string; top: string; delay: string; size: string }>>([]);

  // Generate random particles positions on mount
  useEffect(() => {
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
        const rec = getQuizRecommendation(answers);
        setRecommendation(rec);

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
    setRecommendation(null);
    setPhase("intro");
  };

  const handleBuyNow = () => {
    if (!recommendation) return;
    const prod = recommendation.product;

    const saved = localStorage.getItem("cart-items");
    let cart = [];
    if (saved) {
      try {
        cart = JSON.parse(saved);
      } catch (e) {
        cart = [];
      }
    }
    const existing = cart.find((item: any) => item.id === prod.id);
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
      <main className={styles.mainContent}>
        {(phase === "intro" || isTransitioningIntro) && (
          <div className={`${styles.introContainer} ${isTransitioningIntro ? styles.introLeaving : ""}`}>
            {/* The split wooden/paper doors */}
            <div className={`${styles.introDoor} ${styles.introDoorLeft}`}>
              {/* Left broken seal half attached to the edge */}
              {isSealedCracked && (
                <div className={`${styles.waxSealHalf} ${styles.waxSealLeft}`}>
                  <span className={styles.sealMonogramHalf}>M</span>
                </div>
              )}
            </div>
            
            <div className={`${styles.introDoor} ${styles.introDoorRight}`}>
              {/* Right broken seal half attached to the edge */}
              {isSealedCracked && (
                <div className={`${styles.waxSealHalf} ${styles.waxSealRight}`}>
                  <span className={styles.sealMonogramHalf}>M</span>
                </div>
              )}
            </div>

            {/* The content overlay */}
            <div className={styles.introContent}>
              <div className={styles.introHeader}>
                <span className={styles.introLabel}>MURAKKAZ</span>
                <h1 className={styles.introHeading}>Discover Your Signature Fragrance</h1>
              </div>
              
              <p className={styles.introBody}>
                Every fragrance tells a different story. Answer seven carefully curated questions and we'll recommend the fragrances that best match your personality, preferences, and lifestyle.
              </p>
              
              {/* Wax Seal Interaction Section (instead of button) */}
              <div className={styles.sealInteractionArea} suppressHydrationWarning>
                {!isTransitioningIntro && (
                  <div 
                    className={`${styles.waxSealWrapper} ${isSealPressed ? styles.sealPressed : ""} ${isSealedCracked ? styles.sealCracked : ""}`}
                    onClick={handleSealClick}
                    suppressHydrationWarning
                  >
                    {/* The intact wax seal */}
                    <div className={styles.waxSealIntact}>
                      <span className={styles.sealMonogram}>M</span>
                      <div className={styles.sealCrackLine} />
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
        {phase === "results" && recommendation && (
          <div className={styles.resultsContainer}>
            <div className={styles.resultsInnerCard}>
              <div className={styles.resultsHeader}>
                <span className={styles.resultsLabel}>RECOMMENDED FOR YOU</span>
                <span className={styles.matchBadge}>
                  {recommendation.matchScore}% MATCH
                </span>
              </div>

              <div className={styles.resultsContentLayout}>
                {/* Left Side: Mockup Image */}
                <div className={styles.resultsImgWrapper}>
                  <Image
                    src={recommendation.product.image}
                    alt={recommendation.product.name}
                    width={320}
                    height={320}
                    className={styles.resultsImg}
                    priority
                  />
                </div>

                {/* Right Side: Consultation Breakdown */}
                <div className={styles.resultsDetails}>
                  <h1 className={styles.resultsTitle}>
                    Why {recommendation.product.name}?
                  </h1>
                  <p className={styles.resultsText}>{recommendation.reason}</p>

                  <div className={styles.traitPills}>
                    <div className={styles.traitPill}>
                      <span className={styles.pillLabel}>Family:</span>{" "}
                      {recommendation.product.family}
                    </div>
                    <div className={styles.traitPill}>
                      <span className={styles.pillLabel}>Occasion:</span>{" "}
                      {recommendation.product.occasion}
                    </div>
                    <div className={styles.traitPill}>
                      <span className={styles.pillLabel}>Intensity:</span>{" "}
                      {recommendation.product.meter}
                    </div>
                  </div>

                  <div className={styles.resultsActions}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnBack}`}
                      onClick={handleReset}
                    >
                      Try More
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnNext}`}
                      onClick={handleBuyNow}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
