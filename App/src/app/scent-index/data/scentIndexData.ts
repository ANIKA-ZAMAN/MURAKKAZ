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
      "Patchouli",
      "Lavender",
      "Leather",
      "Tobacco",
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
    options: ["Spring", "Summer", "Autumn", "Winter", "All Year"],
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
 * Recommendation algorithm matching quiz answers to productsCatalog
 */
export function getQuizRecommendation(
  answers: Record<number, string | string[]>
): QuizRecommendation {
  const genderAns = answers[1] as string | undefined;
  const occasionAns = answers[2] as string | undefined;
  const notesAns = (answers[3] as string[]) || [];
  const intensityAns = answers[4] as string | undefined;
  const styleScentAns = (answers[5] as string[]) || [];
  const seasonAns = answers[6] as string | undefined;
  const styleAns = answers[7] as string | undefined;

  // Map quiz occasion to product catalog occasion
  let targetOccasions: string[] = [];
  if (occasionAns === "Everyday") targetOccasions = ["Casual", "Daily Wear"];
  else if (occasionAns === "Office") targetOccasions = ["Formal", "Daily Wear"];
  else if (occasionAns === "Date Night") targetOccasions = ["Date Night", "Night Out"];
  else if (occasionAns === "Party") targetOccasions = ["Night Out", "Casual"];
  else if (occasionAns === "Formal Event" || occasionAns === "Special Occasion") {
    targetOccasions = ["Formal"];
  }

  // Map notes to families
  const targetFamilies: string[] = [];
  notesAns.forEach((note) => {
    if (["Rose", "Jasmine", "Lavender"].includes(note)) targetFamilies.push("Floral");
    if (["Vanilla", "Amber"].includes(note)) targetFamilies.push("Oriental");
    if (["Bergamot"].includes(note)) targetFamilies.push("Citrus", "Fresh");
    if (["Oud", "Sandalwood", "Patchouli", "Leather", "Tobacco", "Musk"].includes(note)) {
      targetFamilies.push("Woody");
    }
  });

  // Map chosen scent style to families
  styleScentAns.forEach((styleScent) => {
    if (styleScent === "Floral" || styleScent === "Fruity") targetFamilies.push("Floral");
    else if (styleScent === "Citrus") targetFamilies.push("Citrus");
    else if (styleScent === "Sweet" || styleScent === "Spicy") targetFamilies.push("Oriental");
    else if (styleScent === "Woody" || styleScent === "Oud" || styleScent === "Leather") targetFamilies.push("Woody");
    else if (styleScent === "Fresh" || styleScent === "Aquatic") targetFamilies.push("Fresh");
  });

  // Map intensity/longevity to performance meters
  let targetMeters: string[] = [];
  if (intensityAns === "Soft & Skin-like") targetMeters = ["Intimate", "Moderate"];
  else if (intensityAns === "Moderate") targetMeters = ["Moderate", "Long Lasting"];
  else if (intensityAns === "Strong") targetMeters = ["Long Lasting", "Beast Mode"];
  else if (intensityAns === "Very Strong") targetMeters = ["Beast Mode"];

  let bestProduct = productsCatalog[0];
  let highestScore = -1;

  // Score all 120 products in the catalog to find the absolute best match
  productsCatalog.forEach((prod) => {
    let score = 0;

    // 1. Gender Match (High Priority)
    if (genderAns) {
      if (prod.gender === genderAns) score += 4;
      else if (prod.gender === "Unisex" || genderAns === "Unisex") score += 2;
    }

    // 2. Occasion Match
    if (targetOccasions.length > 0) {
      if (targetOccasions.includes(prod.occasion)) score += 3;
    }

    // 3. Performance Meter Match
    if (targetMeters.length > 0) {
      if (targetMeters.includes(prod.meter)) score += 3;
    }

    // 4. Fragrance Family Match
    if (targetFamilies.length > 0) {
      if (targetFamilies.includes(prod.family)) score += 2;
    }

    // 5. Season Affinity Match
    if (seasonAns && seasonAns !== "All Year") {
      if (prod.description.toLowerCase().includes(seasonAns.toLowerCase())) score += 1;
    }

    if (score > highestScore) {
      highestScore = score;
      bestProduct = prod;
    }
  });

  // Calculate dynamic match score out of 100
  const maxPossibleScore = 13;
  const matchPercentage = Math.min(
    99,
    Math.max(85, Math.round((highestScore / maxPossibleScore) * 15 + 85))
  );

  // Generate personalized consultation reasons
  let reason = `Based on your preferences, we selected ${bestProduct.name} for you. It perfectly aligns with your style and desired presence.`;
  if (bestProduct.family === "Woody") {
    reason = `Based on your choices, you need a scent that commands respect without overpowering the room. We handpicked ${bestProduct.name} for you because it perfectly bridges the gap between deep maturity and elegant comfort, utilizing rich ${bestProduct.family.toLowerCase()} undertones ideal for your chosen style.`;
  } else if (bestProduct.family === "Fresh" || bestProduct.family === "Citrus") {
    reason = `Based on your choices, you need a clean, refreshing presence. We handpicked ${bestProduct.name} for you because it offers a crisp, uplifting ${bestProduct.family.toLowerCase()} profile that feels light yet projectively sophisticated, keeping you clean and active all day.`;
  } else if (bestProduct.family === "Oriental" || bestProduct.family === "Floral") {
    reason = `Based on your choices, we selected ${bestProduct.name} because it wraps you in an alluring, warm, and romantic envelope. Its rich ${bestProduct.family.toLowerCase()} base notes create a captivating skin scent that stands out beautifully on dates and special gatherings.`;
  }

  return {
    product: bestProduct,
    matchScore: matchPercentage,
    reason,
  };
}

/**
 * Recommendation algorithm matching quiz answers to productsCatalog, returning top 3 matches
 */
export function getTop3Recommendations(
  answers: Record<number, string | string[]>
): QuizRecommendation[] {
  const genderAns = answers[1] as string | undefined;
  const occasionAns = answers[2] as string | undefined;
  const notesAns = (answers[3] as string[]) || [];
  const intensityAns = answers[4] as string | undefined;
  const styleScentAns = (answers[5] as string[]) || [];
  const seasonAns = answers[6] as string | undefined;
  const styleAns = answers[7] as string | undefined;

  // Map quiz occasion to product catalog occasion
  let targetOccasions: string[] = [];
  if (occasionAns === "Everyday") targetOccasions = ["Casual", "Daily Wear"];
  else if (occasionAns === "Office") targetOccasions = ["Formal", "Daily Wear"];
  else if (occasionAns === "Date Night") targetOccasions = ["Date Night", "Night Out"];
  else if (occasionAns === "Party") targetOccasions = ["Night Out", "Casual"];
  else if (occasionAns === "Formal Event" || occasionAns === "Special Occasion") {
    targetOccasions = ["Formal"];
  }

  // Map notes to families
  const targetFamilies: string[] = [];
  notesAns.forEach((note) => {
    if (["Rose", "Jasmine", "Lavender"].includes(note)) targetFamilies.push("Floral");
    if (["Vanilla", "Amber"].includes(note)) targetFamilies.push("Oriental");
    if (["Bergamot"].includes(note)) targetFamilies.push("Citrus", "Fresh");
    if (["Oud", "Sandalwood", "Patchouli", "Leather", "Tobacco", "Musk"].includes(note)) {
      targetFamilies.push("Woody");
    }
  });

  // Map chosen scent style to families
  styleScentAns.forEach((styleScent) => {
    if (styleScent === "Floral" || styleScent === "Fruity") targetFamilies.push("Floral");
    else if (styleScent === "Citrus") targetFamilies.push("Citrus");
    else if (styleScent === "Sweet" || styleScent === "Spicy") targetFamilies.push("Oriental");
    else if (styleScent === "Woody" || styleScent === "Oud" || styleScent === "Leather") targetFamilies.push("Woody");
    else if (styleScent === "Fresh" || styleScent === "Aquatic") targetFamilies.push("Fresh");
  });

  // Map intensity/longevity to performance meters
  let targetMeters: string[] = [];
  if (intensityAns === "Soft & Skin-like") targetMeters = ["Intimate", "Moderate"];
  else if (intensityAns === "Moderate") targetMeters = ["Moderate", "Long Lasting"];
  else if (intensityAns === "Strong") targetMeters = ["Long Lasting", "Beast Mode"];
  else if (intensityAns === "Very Strong") targetMeters = ["Beast Mode"];

  const scoredProducts: Array<{ product: Product; score: number }> = [];

  productsCatalog.forEach((prod) => {
    let score = 0;

    // 1. Gender Match (High Priority)
    if (genderAns) {
      if (prod.gender === genderAns) score += 4;
      else if (prod.gender === "Unisex" || genderAns === "Unisex") score += 2;
    }

    // 2. Occasion Match
    if (targetOccasions.length > 0) {
      if (targetOccasions.includes(prod.occasion)) score += 3;
    }

    // 3. Performance Meter Match
    if (targetMeters.length > 0) {
      if (targetMeters.includes(prod.meter)) score += 3;
    }

    // 4. Fragrance Family Match
    if (targetFamilies.length > 0) {
      if (targetFamilies.includes(prod.family)) score += 2;
    }

    // 5. Season Affinity Match
    if (seasonAns && seasonAns !== "All Year") {
      if (prod.description.toLowerCase().includes(seasonAns.toLowerCase())) score += 1;
    }

    scoredProducts.push({ product: prod, score });
  });

  // Sort by score descending
  scoredProducts.sort((a, b) => b.score - a.score);

  // Take top 3 distinct products
  const top3 = scoredProducts.slice(0, 3);
  const maxPossibleScore = 13;

  return top3.map((item, index) => {
    const highestScore = item.score;
    const bestProduct = item.product;

    const matchPercentage = Math.min(
      99 - index * 3,
      Math.max(82, Math.round((highestScore / maxPossibleScore) * 15 + 85) - index * 4)
    );

    // Generate personalized premium consultation reasons and inspirations
    let reason = `A seamless composition of delicate florals and soft musks, resting quietly on the skin like a light linen shirt in late summer.`;
    let inspiration = `Inspired by moments of stillness and memory`;
    let profileTags = ["Floral", "Musky", "Elegant"];
    let keyNotes = ["Jasmine", "Rose", "White Musk"];
    let performance = "7+ Hours • Elegant Presence";

    if (bestProduct.family === "Woody") {
      reason = `A grounding sanctuary of smoked woods and quiet resilience, evoking the scent of sun-warmed cedar and fresh rain over mossy forest beds.`;
      inspiration = `Inspired by misty cedar forests and damp earth`;
      profileTags = ["Woody", "Amber", "Smoky"];
      keyNotes = ["Sandalwood", "Cedarwood", "Vetiver"];
      performance = "8+ Hours • Strong Projection";
    } else if (bestProduct.family === "Citrus") {
      reason = `A bright, expansive breath of seaside air over open orchards. Crisp salinity paired with the sharp energy of freshly sliced citrus.`;
      inspiration = `Inspired by Mediterranean groves and coastal sea salt`;
      profileTags = ["Citrus", "Fresh", "Zesty"];
      keyNotes = ["Bergamot", "Neroli", "Mandarin"];
      performance = "6+ Hours • Moderate Projection";
    } else if (bestProduct.family === "Fresh") {
      reason = `A vibrant breath of morning air over sun-drenched orchards, capturing the crisp clarity of sea breeze and dew-kissed leaves.`;
      inspiration = `Inspired by Mediterranean groves and coastal sea salt`;
      profileTags = ["Fresh", "Aquatic", "Green"];
      keyNotes = ["Sea Salt", "Sage", "Mint"];
      performance = "6+ Hours • Moderate Projection";
    } else if (bestProduct.family === "Oriental" || bestProduct.family === "Floral") {
      reason = `A soft, whispered embrace of velvet petals and warm amber, weaving an intimate story of mystery, sweet warmth, and elegance.`;
      inspiration = `Inspired by midnight gardens and whispered secrets`;
      profileTags = ["Oriental", "Spicy", "Warm"];
      keyNotes = ["Amber", "Vanilla", "Cardamom"];
      performance = "8+ Hours • Strong Projection";
    }

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
