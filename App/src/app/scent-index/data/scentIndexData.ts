import { productsCatalog, Product } from "../../data/products";

export interface ConsultationQuestion {
  id: number;
  question: string;
  type: "single" | "multi";
  options: string[];
}

export const quizQuestions: ConsultationQuestion[] = [
  {
    id: 1,
    question: "Who will be wearing this fragrance?",
    type: "single",
    options: ["Men", "Women", "Unisex"],
  },
  {
    id: 2,
    question: "What occasion are you shopping for?",
    type: "single",
    options: [
      "Everyday",
      "Office",
      "Date Night",
      "Party",
      "Formal Event",
      "Special Occasion",
      "Cozy Evening",
    ],
  },
  {
    id: 3,
    question: "Which fragrance notes are you naturally drawn to?",
    type: "multi",
    options: [
      "Rose",
      "Vanilla",
      "Oud",
      "Sandalwood",
      "Bergamot",
      "Jasmine",
      "Musk",
      "Amber",
      "Saffron",
      "Tonka Bean",
      "Leather",
      "Coffee",
    ],
  },
  {
    id: 4,
    question: "How intense do you prefer your fragrance?",
    type: "single",
    options: ["Soft & Skin-like", "Moderate", "Strong", "Very Strong"],
  },
  {
    id: 5,
    question: "Which scent style do you like?",
    type: "multi",
    options: [
      "Floral",
      "Citrus",
      "Fruity",
      "Sweet",
      "Woody",
      "Spicy",
      "Oud",
      "Fresh",
      "Leather",
      "Aquatic",
    ],
  },
  {
    id: 6,
    question: "Which season will you wear it most?",
    type: "single",
    options: ["Spring", "Summer", "Rainy Season", "Autumn", "Winter", "All Year"],
  },
  {
    id: 7,
    question: "Which style best reflects your personality?",
    type: "single",
    options: ["Minimal", "Elegant", "Romantic", "Bold", "Mysterious", "Classic"],
  },
];

export interface QuizRecommendation {
  product: Product;
  matchScore: number;
  reason: string;
  inspiration?: string;
  profileTags?: string[];
  keyNotes?: string[];
  performance?: string;
}

const NOTE_SYNONYMS: Record<string, string[]> = {
  rose: ["rose", "rosewater", "damascena", "may rose", "bulgarian rose", "taif"],
  vanilla: ["vanilla", "bourbon vanilla", "vanilla sugar", "vanilla bean", "madagascar"],
  oud: ["oud", "agarwood", "cambodian", "oud wood", "dukhan"],
  sandalwood: ["sandalwood", "santal", "sandal"],
  bergamot: ["bergamot", "citrus", "calabrian bergamot"],
  jasmine: ["jasmine", "sambac", "jasmine bud", "white floral"],
  musk: ["musk", "white musk", "ambrofix", "cashmeran"],
  amber: ["amber", "ambergris", "cistus", "labdanum", "ambroxan"],
  saffron: ["saffron", "crocus"],
  "tonka bean": ["tonka", "tonka bean", "coumarin"],
  leather: ["leather", "suede", "cuir"],
  coffee: ["coffee", "qahwa", "espresso", "roasted coffee"],
};

/**
 * Score how well the user's chosen notes match the product's actual notes array,
 * taking advantage of olfactory synonyms and weighting heart & base notes.
 */
function scoreNoteMatch(userNotes: string[], productNotes: any[]): { score: number; matchedNotes: string[] } {
  if (!userNotes.length || !productNotes.length) return { score: 0, matchedNotes: [] };

  let rawScore = 0;
  const matchedUserNotes = new Set<string>();
  const total = productNotes.length;

  userNotes.forEach((uNote) => {
    const cleanUser = uNote.toLowerCase().trim();
    const synonyms = NOTE_SYNONYMS[cleanUser] || [cleanUser];

    productNotes.forEach((pNote, idx) => {
      const noteName = typeof pNote === "string" ? pNote : (pNote?.name || "");
      const cleanProd = noteName.toLowerCase().trim();

      const isMatch = synonyms.some((syn) => cleanProd.includes(syn) || syn.includes(cleanProd));
      if (isMatch) {
        matchedUserNotes.add(uNote);
        const isHeartOrBase = idx >= Math.floor(total / 3);
        rawScore += isHeartOrBase ? 3 : 1.5;
      }
    });
  });

  const matchRatio = matchedUserNotes.size / Math.max(1, userNotes.length);
  const finalScore = Math.min(30, Math.round(matchRatio * 18 + rawScore * 2));

  return { score: finalScore, matchedNotes: Array.from(matchedUserNotes) };
}

/**
 * Generates an eloquent, personalized editorial rationale reflecting the user's exact selections.
 */
function generatePersonalizedReason(
  prod: Product,
  answers: Record<number, string | string[]>,
  matchedNotes: string[] = []
): string {
  const occasionAns = answers[2] as string | undefined;
  const intensityAns = answers[4] as string | undefined;
  const styleAns = answers[7] as string | undefined;

  const highlights: string[] = [];

  // 1. Notes Highlight
  if (matchedNotes.length > 0) {
    if (matchedNotes.length === 1) {
      highlights.push(`celebrates your fondness for luscious ${matchedNotes[0].toLowerCase()}`);
    } else {
      const allExceptLast = matchedNotes.slice(0, -1).map((n) => n.toLowerCase()).join(", ");
      const last = matchedNotes[matchedNotes.length - 1].toLowerCase();
      highlights.push(`celebrates your love for ${allExceptLast} and ${last}`);
    }
  } else if (prod.family) {
    highlights.push(`unfolds radiant ${prod.family.toLowerCase()} accords`);
  }

  // 2. Occasion Highlight
  const OCCASION_PHRASING: Record<string, string> = {
    "Everyday": "serves as your effortless daily signature",
    "Office": "effortlessly suits polished executive and office settings",
    "Date Night": "is intoxicatingly crafted for romantic evenings and date nights",
    "Party": "stands out vibrantly at celebrations and lively parties",
    "Formal Event": "elevates black-tie galas and prestigious formal events",
    "Special Occasion": "is reserved for cherished, unforgettable milestone moments",
    "Cozy Evening": "delivers warm, comforting intimacy for relaxed evenings",
  };
  if (occasionAns && OCCASION_PHRASING[occasionAns]) {
    highlights.push(OCCASION_PHRASING[occasionAns]);
  }

  // 3. Intensity Highlight
  const INTENSITY_PHRASING: Record<string, string> = {
    "Soft & Skin-like": "embraces an intimate, whisper-soft skin presence",
    "Moderate": "projects a balanced, versatile sillage",
    "Strong": "radiates a commanding, persistent sillage",
    "Very Strong": "unleashes an intense, room-filling beast-mode aura",
  };
  if (intensityAns && INTENSITY_PHRASING[intensityAns]) {
    highlights.push(INTENSITY_PHRASING[intensityAns]);
  }

  // 4. Personality / Style Highlight
  const STYLE_PHRASING: Record<string, string> = {
    "Minimal": "complements your clean, understated aesthetic",
    "Elegant": "accentuates your poised, sophisticated elegance",
    "Romantic": "speaks directly to your affectionate, poetic nature",
    "Bold": "embodies a daring, fearless confidence",
    "Mysterious": "radiates an enigmatic, hypnotic allure",
    "Classic": "resonates with timeless, distinguished heritage",
  };
  if (styleAns && STYLE_PHRASING[styleAns]) {
    highlights.push(STYLE_PHRASING[styleAns]);
  }

  if (highlights.length === 0) {
    return `We handpicked ${prod.name} as a distinguished signature creation engineered with opulent fragrance accords.`;
  }
  if (highlights.length === 1) {
    return `We handpicked ${prod.name} because it ${highlights[0]}.`;
  }
  if (highlights.length === 2) {
    return `We handpicked ${prod.name} because it ${highlights[0]} and ${highlights[1]}.`;
  }

  const initial = highlights.slice(0, -1).join(", ");
  const final = highlights[highlights.length - 1];
  return `We handpicked ${prod.name} because it ${initial}, and ${final}.`;
}

/**
 * Recommendation algorithm matching quiz answers to productsCatalog, returning top 3 matches
 */
export function getTop3Recommendations(
  answers: Record<number, string | string[]>,
  customCatalog?: Product[]
): QuizRecommendation[] {
  const catalogToUse = (customCatalog && customCatalog.length > 0) ? customCatalog : productsCatalog;

  const genderAns = answers[1] as string | undefined;
  const occasionAns = answers[2] as string | undefined;
  const notesAns = (answers[3] as string[]) || [];
  const intensityAns = answers[4] as string | undefined;
  const styleScentAns = (answers[5] as string[]) || [];
  const seasonAns = answers[6] as string | undefined;
  const styleAns = answers[7] as string | undefined;

  // 1. Occasion mapping (matches actual catalog string patterns)
  let targetOccasions: string[] = [];
  if (occasionAns === "Everyday") {
    targetOccasions = ["Daily & Executive", "Versatile", "Summer Signature & Daily", "Casual"];
  } else if (occasionAns === "Office") {
    targetOccasions = ["Daily & Executive", "Executive & Formal", "Formal"];
  } else if (occasionAns === "Date Night") {
    targetOccasions = ["Romantic & Daytime", "Sensual Evening", "Night Out"];
  } else if (occasionAns === "Party") {
    targetOccasions = ["Outdoor & Evening", "Versatile", "Winter & Evening", "Night Out"];
  } else if (occasionAns === "Formal Event") {
    targetOccasions = ["Luxury Gala & Formal", "Executive & Formal", "Royalty & Special Occasions"];
  } else if (occasionAns === "Special Occasion") {
    targetOccasions = ["Royalty & Special Occasions", "Signature & High Art", "Luxury Gala & Formal"];
  } else if (occasionAns === "Cozy Evening") {
    targetOccasions = ["Cozy Winter", "Winter & Evening", "Sensual Evening"];
  }

  // 2. Note & Style mapping to Fragrance Families
  const targetFamilies: string[] = [];
  notesAns.forEach((note) => {
    if (["Rose", "Jasmine"].includes(note)) targetFamilies.push("FLORAL");
    if (["Vanilla", "Amber", "Saffron", "Tonka Bean", "Coffee"].includes(note)) targetFamilies.push("ORIENTAL", "GOURMAND");
    if (["Bergamot"].includes(note)) targetFamilies.push("CITRUS", "FRESH");
    if (["Oud", "Sandalwood", "Leather", "Musk"].includes(note)) targetFamilies.push("WOODY", "SPICY");
  });

  styleScentAns.forEach((styleScent) => {
    if (styleScent === "Floral" || styleScent === "Fruity") targetFamilies.push("FLORAL");
    else if (styleScent === "Citrus") targetFamilies.push("CITRUS", "FRESH");
    else if (styleScent === "Sweet" || styleScent === "Spicy") targetFamilies.push("ORIENTAL", "GOURMAND", "SPICY");
    else if (styleScent === "Woody" || styleScent === "Oud" || styleScent === "Leather") targetFamilies.push("WOODY");
    else if (styleScent === "Fresh" || styleScent === "Aquatic") targetFamilies.push("FRESH", "AQUATIC");
  });

  // 3. Performance Meter mapping
  let targetMeters: string[] = [];
  if (intensityAns === "Soft & Skin-like") targetMeters = ["MODERATE", "LONG_LASTING"];
  else if (intensityAns === "Moderate") targetMeters = ["MODERATE", "LONG_LASTING"];
  else if (intensityAns === "Strong") targetMeters = ["LONG_LASTING", "BEAST_MODE"];
  else if (intensityAns === "Very Strong") targetMeters = ["BEAST_MODE"];

  // 4. Personality to Family Map
  const personalityFamilyMap: Record<string, string[]> = {
    Minimal: ["FRESH", "AQUATIC", "CITRUS"],
    Elegant: ["FLORAL", "WOODY"],
    Romantic: ["FLORAL", "GOURMAND"],
    Bold: ["WOODY", "SPICY", "ORIENTAL"],
    Mysterious: ["ORIENTAL", "WOODY"],
    Classic: ["WOODY", "FRESH"],
  };

  // 5. Season to Family & Note Keyword Map
  const seasonFamilyMap: Record<string, { families: string[]; noteKeywords: string[] }> = {
    Summer: { families: ["FRESH", "CITRUS", "AQUATIC"], noteKeywords: ["bergamot", "citrus", "marine", "mint", "green"] },
    Winter: { families: ["ORIENTAL", "WOODY", "GOURMAND"], noteKeywords: ["oud", "amber", "vanilla", "tobacco", "cinnamon"] },
    Spring: { families: ["FLORAL", "FRESH"], noteKeywords: ["rose", "jasmine", "green", "blossom", "peony"] },
    Autumn: { families: ["WOODY", "SPICY", "ORIENTAL"], noteKeywords: ["leather", "tobacco", "cinnamon", "patchouli", "vetiver"] },
    "Rainy Season": { families: ["FRESH", "AQUATIC", "CITRUS"], noteKeywords: ["marine", "bergamot", "grapefruit", "mint", "green tea"] },
    "All Year": { families: [], noteKeywords: [] },
  };

  const scoredProducts: Array<{ product: Product; score: number; matchedNotes: string[] }> = [];

  catalogToUse.forEach((prod) => {
    let score = 0;

    // A. Direct Note Match (up to 30 pts) with Synonym Support
    const { score: noteScore, matchedNotes } = scoreNoteMatch(notesAns, prod.notes);
    score += noteScore;

    // B. Gender Match (15 pts / 10 pts)
    if (genderAns && prod.gender) {
      const pGender = prod.gender.toUpperCase();
      const uGender = genderAns.toUpperCase();
      if (pGender === uGender) score += 15;
      else if (pGender === "UNISEX" || uGender === "UNISEX") score += 10;
    }

    // C. Occasion Match (12 pts)
    if (targetOccasions.length > 0 && prod.occasion) {
      const prodOccasion = prod.occasion.toLowerCase();
      const isMatch = targetOccasions.some((t) => prodOccasion.includes(t.toLowerCase())) ||
        (occasionAns && prodOccasion.includes(occasionAns.toLowerCase()));
      if (isMatch) score += 12;
    }

    // D. Fragrance Family Match (10 pts)
    if (targetFamilies.length > 0 && prod.family) {
      const pFamily = prod.family.toUpperCase();
      if (targetFamilies.includes(pFamily)) score += 10;
    }

    // E. Performance / Intensity Match (10 pts)
    if (intensityAns && prod.intensity) {
      const cleanAns = intensityAns.toLowerCase().split(' ')[0]; // e.g. "soft", "moderate", "strong", "very"
      if (prod.intensity.toLowerCase().includes(cleanAns)) {
        score += 10;
      }
    } else if (targetMeters.length > 0 && prod.meter) {
      const pMeter = prod.meter.toUpperCase().replace(/[\s_]+/g, "");
      const isMeterMatch = targetMeters.some((tm) => tm.replace(/[\s_]+/g, "") === pMeter);
      if (isMeterMatch) score += 10;
    }

    // F. Season/Climate Affinity Match (up to 8 pts)
    if (seasonAns) {
      if (prod.season) {
        const prodSeason = prod.season.toLowerCase();
        const cleanSeason = seasonAns.toLowerCase();
        if (cleanSeason === "all year" || prodSeason.includes("year-round") || prodSeason.includes("all season") || prodSeason.includes(cleanSeason)) {
          score += 8;
        }
      } else if (seasonAns !== "All Year" && seasonFamilyMap[seasonAns]) {
        const sData = seasonFamilyMap[seasonAns];
        if (sData.families.includes(prod.family.toUpperCase())) score += 5;

        let keywordMatch = 0;
        sData.noteKeywords.forEach((kw) => {
          if (prod.notes.some((n) => (typeof n === 'string' ? n : n?.name || '').toLowerCase().includes(kw))) keywordMatch++;
        });
        score += Math.min(3, keywordMatch);
      }
    }

    // G. Personality Profile Match (up to 7 pts)
    if (styleAns) {
      if (prod.personality && prod.personality.toLowerCase().includes(styleAns.toLowerCase())) {
        score += 7;
      } else if (personalityFamilyMap[styleAns]) {
        const targetPFamilies = personalityFamilyMap[styleAns];
        if (targetPFamilies.includes(prod.family.toUpperCase())) score += 5;
      }
    }

    // H. Scent Vibe Affinity (+6 pts)
    if (prod.vibe && styleScentAns.length > 0) {
      const prodVibe = prod.vibe.toLowerCase();
      const matchingVibes = styleScentAns.filter(s => prodVibe.includes(s.toLowerCase()));
      if (matchingVibes.length > 0) {
        score += Math.min(6, matchingVibes.length * 3);
      }
    }

    // I. Tiebreakers (up to 3 pts)
    if (prod.badge) score += 2;
    if (prod.rating && prod.rating >= 4.9) score += 1;

    scoredProducts.push({ product: prod, score, matchedNotes });
  });

  // Sort descending by score
  scoredProducts.sort((a, b) => b.score - a.score);

  // Take top 3 distinct products
  const top3 = scoredProducts.slice(0, 3);
  const maxPossibleScore = 96;

  return top3.map((item, index) => {
    const rawScore = item.score;
    const bestProduct = { ...item.product };

    const matchPercentage = Math.min(
      99 - index * 3,
      Math.max(83, Math.round((rawScore / maxPossibleScore) * 14 + 85) - index * 3)
    );

    const inspiration = bestProduct.inspiredBy 
      ? `Inspired by ${bestProduct.inspiredBy.replace(/^inspired by /i, '')}`
      : `Artisanal Creation by ${bestProduct.brand}`;

    const profileTags = [
      bestProduct.family,
      bestProduct.gender,
      bestProduct.season ? bestProduct.season.split(',')[0].trim() : undefined,
      bestProduct.personality ? bestProduct.personality.split(',')[0].trim() : undefined,
      bestProduct.meter ? bestProduct.meter.replace(/_/g, " ") : undefined,
    ].filter(Boolean) as string[];

    const performance = (bestProduct.longevity && bestProduct.projection)
      ? `${bestProduct.longevity} • ${bestProduct.projection}`
      : bestProduct.meter === "BEAST_MODE"
      ? "8+ Hours • Powerful Room Projection"
      : bestProduct.meter === "LONG_LASTING"
      ? "6-8 Hours • Strong Presence"
      : "4-6 Hours • Elegant Skin Presence";

    const keyNotes = bestProduct.notes ? bestProduct.notes.slice(0, 4).map((n: any) => typeof n === 'string' ? n : n.name) : [];
    const reason = generatePersonalizedReason(bestProduct, answers, item.matchedNotes);

    return {
      product: bestProduct,
      matchScore: matchPercentage,
      reason,
      inspiration,
      profileTags,
      keyNotes,
      performance,
    };
  });
}

/**
 * Single top recommendation wrapper for compatibility
 */
export function getQuizRecommendation(
  answers: Record<number, string | string[]>,
  customCatalog?: Product[]
): QuizRecommendation {
  const top3 = getTop3Recommendations(answers, customCatalog);
  return top3[0];
}
