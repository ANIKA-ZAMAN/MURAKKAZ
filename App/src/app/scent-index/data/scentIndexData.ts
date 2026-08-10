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

/**
 * Score how well the user's chosen notes match the product's actual notes array.
 * Heart & base notes (latter 2/3 of array) receive 3x weight (3 pts), top notes receive 1pt.
 */
function scoreNoteMatch(userNotes: string[], productNotes: string[]): number {
  if (!userNotes.length || !productNotes.length) return 0;
  let score = 0;
  const total = productNotes.length;

  userNotes.forEach((uNote) => {
    const cleanUser = uNote.toLowerCase().trim();
    productNotes.forEach((pNote, idx) => {
      const cleanProd = pNote.toLowerCase().trim();
      if (cleanProd.includes(cleanUser) || cleanUser.includes(cleanProd)) {
        const isHeartOrBase = idx >= Math.floor(total / 3);
        score += isHeartOrBase ? 3 : 1;
      }
    });
  });

  return Math.min(30, score);
}

/**
 * Generate a dynamic personalized reason based on user answers and matching catalog attributes.
 */
function generatePersonalizedReason(
  prod: Product,
  answers: Record<number, string | string[]>
): string {
  const notesAns = (answers[3] as string[]) || [];
  const occasionAns = answers[2] as string | undefined;
  const intensityAns = answers[4] as string | undefined;
  const styleAns = answers[7] as string | undefined;

  const matchedNotes = notesAns.filter((n) =>
    prod.notes.some((pn) => pn.toLowerCase().includes(n.toLowerCase()))
  );

  const highlights: string[] = [];

  if (matchedNotes.length > 0) {
    highlights.push(`matches your love for ${matchedNotes.join(", ")}`);
  } else {
    highlights.push(`features rich ${prod.family.toLowerCase()} accords`);
  }

  if (occasionAns) {
    highlights.push(`fits your ${occasionAns.toLowerCase()} wear`);
  }

  if (intensityAns) {
    highlights.push(`delivers your desired ${intensityAns.toLowerCase()} presence`);
  }

  if (styleAns) {
    highlights.push(`complements your ${styleAns.toLowerCase()} style`);
  }

  return `We handpicked ${prod.name} because it ${highlights.join(", ")}.`;
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

  const scoredProducts: Array<{ product: Product; score: number }> = [];

  catalogToUse.forEach((prod) => {
    let score = 0;

    // A. Direct Note Match (up to 30 pts)
    score += scoreNoteMatch(notesAns, prod.notes);

    // B. Gender Match (15 pts / 10 pts)
    if (genderAns) {
      const pGender = prod.gender.toUpperCase();
      const uGender = genderAns.toUpperCase();
      if (pGender === uGender) score += 15;
      else if (pGender === "UNISEX" || uGender === "UNISEX") score += 10;
    }

    // C. Occasion Match (12 pts)
    if (targetOccasions.length > 0 && prod.occasion) {
      const prodOccasion = prod.occasion.toLowerCase();
      const isMatch = targetOccasions.some((t) => prodOccasion.includes(t.toLowerCase()));
      if (isMatch) score += 12;
    }

    // D. Fragrance Family Match (10 pts)
    if (targetFamilies.length > 0 && prod.family) {
      const pFamily = prod.family.toUpperCase();
      if (targetFamilies.includes(pFamily)) score += 10;
    }

    // E. Performance Meter Match (10 pts)
    if (targetMeters.length > 0 && prod.meter) {
      const pMeter = prod.meter.toUpperCase().replace(/[\s_]+/g, "");
      const isMeterMatch = targetMeters.some((tm) => tm.replace(/[\s_]+/g, "") === pMeter);
      if (isMeterMatch) score += 10;
    }

    // F. Season/Climate Affinity Match (up to 8 pts)
    if (seasonAns && seasonAns !== "All Year" && seasonFamilyMap[seasonAns]) {
      const sData = seasonFamilyMap[seasonAns];
      if (sData.families.includes(prod.family.toUpperCase())) score += 5;

      let keywordMatch = 0;
      sData.noteKeywords.forEach((kw) => {
        if (prod.notes.some((n) => n.toLowerCase().includes(kw))) keywordMatch++;
      });
      score += Math.min(3, keywordMatch);
    }

    // G. Personality Profile Match (5 pts)
    if (styleAns && personalityFamilyMap[styleAns]) {
      const targetPFamilies = personalityFamilyMap[styleAns];
      if (targetPFamilies.includes(prod.family.toUpperCase())) score += 5;
    }

    // H. Tiebreakers (up to 3 pts)
    if (prod.badge) score += 2;
    if (prod.rating && prod.rating >= 4.9) score += 1;

    scoredProducts.push({ product: prod, score });
  });

  // Sort descending by score
  scoredProducts.sort((a, b) => b.score - a.score);

  // Take top 3 distinct products
  const top3 = scoredProducts.slice(0, 3);
  const maxPossibleScore = 90;

  return top3.map((item, index) => {
    const rawScore = item.score;
    const bestProduct = { ...item.product };

    const matchPercentage = Math.min(
      99 - index * 2,
      Math.max(82, Math.round((rawScore / maxPossibleScore) * 15 + 84) - index * 3)
    );

    const inspiration = bestProduct.inspiredBy 
      ? `Inspired by ${bestProduct.inspiredBy.replace(/^inspired by /i, '')}`
      : `Artisanal Creation by ${bestProduct.brand}`;

    const profileTags = [
      bestProduct.family,
      bestProduct.gender,
      bestProduct.meter.replace("_", " "),
    ];

    const performance =
      bestProduct.meter === "BEAST_MODE"
        ? "8+ Hours • Powerful Room Projection"
        : bestProduct.meter === "LONG_LASTING"
        ? "6-8 Hours • Strong Presence"
        : "4-6 Hours • Elegant Skin Presence";

    const keyNotes = bestProduct.notes ? bestProduct.notes.slice(0, 4) : [];
    const reason = generatePersonalizedReason(bestProduct, answers);

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
