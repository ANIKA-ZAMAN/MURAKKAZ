"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./ScentIndex.module.css";
import {
  consultationSteps,
  getRecommendation,
  type Recommendation,
} from "../data/scentIndexData";

type Phase = "hero" | "consultation" | "results";

export default function ScentIndex() {
  /* ───── State ───── */
  const [phase, setPhase] = useState<Phase>("hero");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [fade, setFade] = useState(true); // true = visible
  const [displayScore, setDisplayScore] = useState(0);
  const [resultsReady, setResultsReady] = useState(false);

  const totalSteps = consultationSteps.length;
  const currentStep = consultationSteps[step];

  /* ───── Transition helper ───── */
  const transition = useCallback(
    (action: () => void) => {
      setFade(false);
      setTimeout(() => {
        action();
        setFade(true);
      }, 350);
    },
    []
  );

  /* ───── Handlers ───── */
  const beginConsultation = () => {
    transition(() => setPhase("consultation"));
  };

  const selectOption = (optionId: string) => {
    if (currentStep.multiSelect) {
      const prev = (answers[step] as string[]) || [];
      const next = prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId];
      setAnswers({ ...answers, [step]: next });
    } else {
      setAnswers({ ...answers, [step]: optionId });
    }
  };

  const isSelected = (optionId: string): boolean => {
    const answer = answers[step];
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.includes(optionId);
    return answer === optionId;
  };

  const canProceed = (): boolean => {
    const answer = answers[step];
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return true;
  };

  const nextStep = () => {
    if (step < totalSteps - 1) {
      transition(() => setStep(step + 1));
    } else {
      // Final step — calculate results
      const result = getRecommendation(answers);
      transition(() => {
        setRecommendation(result);
        setPhase("results");
      });
    }
  };

  const prevStep = () => {
    if (step > 0) {
      transition(() => setStep(step - 1));
    } else {
      transition(() => setPhase("hero"));
    }
  };

  const startOver = () => {
    transition(() => {
      setAnswers({});
      setStep(0);
      setDisplayScore(0);
      setResultsReady(false);
      setRecommendation(null);
      setPhase("hero");
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ───── Match score counter animation ───── */
  useEffect(() => {
    if (phase !== "results" || !recommendation) return;
    setDisplayScore(0);
    setResultsReady(false);

    const target = recommendation.matchScore;
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setDisplayScore(current);
      if (current >= target) clearInterval(interval);
    }, 18);

    const timer = setTimeout(() => setResultsReady(true), 400);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [phase, recommendation]);

  /* ───── Scroll to top on phase change ───── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  /* ═══════════════════════════════════════════════
     RENDER: HERO
     ═══════════════════════════════════════════════ */
  const renderHero = () => (
    <section className={`${styles.hero} ${fade ? styles.fadeIn : styles.fadeOut}`}>
      <div className={styles.heroInner}>
        <div className={styles.heroBrandMark}>M</div>
        <div className={styles.heroLine} />
        <h1 className={styles.heroTitle}>Scent Index</h1>
        <p className={styles.heroTagline}>
          An intimate consultation to discover
          <br />
          your perfect Murakkaz fragrance
        </p>
        <p className={styles.heroDescription}>
          Six questions. One signature scent. Your olfactory identity, decoded.
        </p>
        <button className={styles.heroCta} onClick={beginConsultation}>
          Begin Your Journey
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.heroCtaArrow}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className={styles.heroScroll}>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );

  /* ═══════════════════════════════════════════════
     RENDER: CONSULTATION
     ═══════════════════════════════════════════════ */
  const renderConsultation = () => (
    <section className={styles.consultation}>
      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <div className={styles.progressLabel}>
          {String(step + 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
        </div>
      </div>

      {/* Step Content */}
      <div className={`${styles.stepContent} ${fade ? styles.fadeIn : styles.fadeOut}`}>
        <div className={styles.stepHeader}>
          <span className={styles.stepId}>{currentStep.id}</span>
          <h2 className={styles.stepQuestion}>{currentStep.question}</h2>
          <p className={styles.stepCaption}>{currentStep.caption}</p>
        </div>

        {/* Options Grid */}
        <div
          className={styles.optionsGrid}
          data-columns={currentStep.columns}
        >
          {currentStep.options.map((option) => (
            <button
              key={option.id}
              className={`${styles.optionCard} ${isSelected(option.id) ? styles.optionSelected : ""}`}
              onClick={() => selectOption(option.id)}
            >
              <span className={styles.optionIcon}>{option.icon}</span>
              <span className={styles.optionTitle}>{option.title}</span>
              <span className={styles.optionSubtitle}>{option.subtitle}</span>
              {isSelected(option.id) && (
                <span className={styles.optionCheck}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>

        {currentStep.multiSelect && (
          <p className={styles.multiHint}>Select all that apply</p>
        )}

        {/* Navigation */}
        <div className={styles.stepNav}>
          <button className={styles.navBack} onClick={prevStep}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.navIcon}>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            className={`${styles.navNext} ${!canProceed() ? styles.navDisabled : ""}`}
            onClick={nextStep}
            disabled={!canProceed()}
          >
            {step < totalSteps - 1 ? "Continue" : "Reveal My Scent"}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.navIcon}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );

  /* ═══════════════════════════════════════════════
     RENDER: RESULTS
     ═══════════════════════════════════════════════ */
  const renderResults = () => {
    if (!recommendation) return null;

    const circumference = 2 * Math.PI * 54;
    const offset = circumference * (1 - displayScore / 100);

    return (
      <section className={`${styles.results} ${fade ? styles.fadeIn : styles.fadeOut}`}>
        {/* Results Header */}
        <div className={styles.resultsHeader}>
          <div className={styles.resultsLine} />
          <span className={styles.resultsEyebrow}>Your Signature Scent</span>
          <h2 className={styles.resultsTitle}>{recommendation.name}</h2>
          <p className={styles.resultsCollection}>{recommendation.collection}</p>
          <p className={styles.resultsTagline}>&ldquo;{recommendation.tagline}&rdquo;</p>
        </div>

        {/* Score + Perfume Hero Row */}
        <div className={`${styles.resultsHeroRow} ${resultsReady ? styles.animateIn : ""}`}>
          {/* Match Score */}
          <div className={styles.scoreCard}>
            <svg viewBox="0 0 120 120" className={styles.scoreRing}>
              <circle cx="60" cy="60" r="54" className={styles.scoreTrack} />
              <circle
                cx="60"
                cy="60"
                r="54"
                className={styles.scoreFill}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: offset,
                }}
              />
            </svg>
            <div className={styles.scoreValue}>
              <span className={styles.scoreNumber}>{displayScore}</span>
              <span className={styles.scorePercent}>%</span>
            </div>
            <span className={styles.scoreLabel}>Match Score</span>
          </div>

          {/* Perfume Visual */}
          <div className={styles.perfumeCard}>
            <div className={styles.perfumeImage}>
              <div className={styles.perfumePlaceholder}>
                <span className={styles.perfumeInitial}>M</span>
              </div>
            </div>
            <p className={styles.perfumeDescription}>{recommendation.description}</p>
          </div>
        </div>

        {/* Olfactory Profile */}
        <div className={`${styles.profileSection} ${resultsReady ? styles.animateIn : ""}`}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Olfactory Profile</h3>
            <div className={styles.sectionLine} />
          </div>
          <div className={styles.profileBars}>
            {recommendation.olfactoryProfile.map((bar, i) => (
              <div key={bar.label} className={styles.profileBar} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={styles.profileBarHeader}>
                  <span className={styles.profileBarLabel}>{bar.label}</span>
                  <span className={styles.profileBarValue}>{bar.value}%</span>
                </div>
                <div className={styles.profileBarTrack}>
                  <div
                    className={styles.profileBarFill}
                    style={{
                      width: resultsReady ? `${bar.value}%` : "0%",
                      transitionDelay: `${0.5 + i * 0.1}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fragrance DNA */}
        <div className={`${styles.dnaSection} ${resultsReady ? styles.animateIn : ""}`}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Fragrance DNA</h3>
            <div className={styles.sectionLine} />
          </div>
          <div className={styles.dnaBars}>
            {recommendation.fragranceDNA.map((dna, i) => (
              <div key={dna.family} className={styles.dnaBar} style={{ animationDelay: `${i * 0.12}s` }}>
                <div className={styles.dnaBarVisual}>
                  <div
                    className={styles.dnaBarFill}
                    style={{
                      height: resultsReady ? `${dna.percentage * 2.5}px` : "0px",
                      backgroundColor: dna.color,
                      transitionDelay: `${0.6 + i * 0.12}s`,
                    }}
                  />
                </div>
                <span className={styles.dnaBarLabel}>{dna.family}</span>
                <span className={styles.dnaBarPercent}>{dna.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className={`${styles.notesSection} ${resultsReady ? styles.animateIn : ""}`}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Composition</h3>
            <div className={styles.sectionLine} />
          </div>
          <div className={styles.notesGrid}>
            {(["top", "heart", "base"] as const).map((tier, i) => (
              <div
                key={tier}
                className={styles.noteCard}
                style={{ animationDelay: `${0.7 + i * 0.15}s` }}
              >
                <span className={styles.noteLabel}>
                  {tier === "top" ? "Top Notes" : tier === "heart" ? "Heart Notes" : "Base Notes"}
                </span>
                <span className={styles.noteTier}>
                  {tier === "top" ? "The Opening" : tier === "heart" ? "The Journey" : "The Signature"}
                </span>
                <ul className={styles.noteList}>
                  {recommendation.notes[tier].map((note) => (
                    <li key={note} className={styles.noteItem}>{note}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Performance */}
        <div className={`${styles.performanceSection} ${resultsReady ? styles.animateIn : ""}`}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Performance</h3>
            <div className={styles.sectionLine} />
          </div>
          <div className={styles.perfGrid}>
            <div className={styles.perfItem}>
              <div className={styles.perfHeader}>
                <span className={styles.perfLabel}>Longevity</span>
                <span className={styles.perfValue}>{recommendation.longevity}%</span>
              </div>
              <div className={styles.perfTrack}>
                <div
                  className={styles.perfFill}
                  style={{
                    width: resultsReady ? `${recommendation.longevity}%` : "0%",
                    transitionDelay: "0.8s",
                  }}
                />
              </div>
            </div>
            <div className={styles.perfItem}>
              <div className={styles.perfHeader}>
                <span className={styles.perfLabel}>Projection</span>
                <span className={styles.perfValue}>{recommendation.projection}%</span>
              </div>
              <div className={styles.perfTrack}>
                <div
                  className={styles.perfFill}
                  style={{
                    width: resultsReady ? `${recommendation.projection}%` : "0%",
                    transitionDelay: "0.95s",
                  }}
                />
              </div>
            </div>
            <div className={styles.perfMeta}>
              <div className={styles.perfMetaItem}>
                <span className={styles.perfMetaLabel}>Sillage</span>
                <span className={styles.perfMetaValue}>{recommendation.sillage}</span>
              </div>
              <div className={styles.perfMetaItem}>
                <span className={styles.perfMetaLabel}>Best Season</span>
                <span className={styles.perfMetaValue}>{recommendation.season}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className={`${styles.resultsCtas} ${resultsReady ? styles.animateIn : ""}`}>
          <button className={styles.ctaSecondary} onClick={startOver}>
            Start Over
          </button>
          <button className={styles.ctaPrimary}>
            Add to Collection
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.navIcon}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    );
  };

  /* ═══════════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════ */
  return (
    <div className={styles.container}>
      {phase === "hero" && renderHero()}
      {phase === "consultation" && renderConsultation()}
      {phase === "results" && renderResults()}
    </div>
  );
}
