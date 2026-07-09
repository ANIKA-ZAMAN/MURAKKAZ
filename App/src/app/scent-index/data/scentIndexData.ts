export interface StepOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export interface ConsultationStep {
  id: string;
  question: string;
  caption: string;
  multiSelect: boolean;
  columns: number;
  options: StepOption[];
}

export interface OlfactoryBar {
  label: string;
  value: number;
}

export interface FragranceDNA {
  family: string;
  percentage: number;
  color: string;
}

export interface Recommendation {
  name: string;
  collection: string;
  tagline: string;
  description: string;
  matchScore: number;
  olfactoryProfile: OlfactoryBar[];
  fragranceDNA: FragranceDNA[];
  notes: { top: string[]; heart: string[]; base: string[] };
  longevity: number;
  projection: number;
  sillage: string;
  season: string;
}

/* ────────────────────── Consultation Steps ────────────────────── */

export const consultationSteps: ConsultationStep[] = [
  {
    id: "daily-life",
    question: "Where do you spend most of your day?",
    caption: "This helps us pick a scent that fits your everyday life.",
    multiSelect: false,
    columns: 3,
    options: [
      { id: "office", title: "Office", subtitle: "Professional work environment", icon: "▣" },
      { id: "university", title: "University / College", subtitle: "Campus life and classes", icon: "◈" },
      { id: "home", title: "Home", subtitle: "Mostly at home during the day", icon: "⌂" },
      { id: "outside", title: "Outside", subtitle: "Outdoor work, travel, or fieldwork", icon: "◎" },
      { id: "different", title: "Different Places", subtitle: "Always on the move", icon: "⬡" },
    ],
  },
  {
    id: "occasion",
    question: "When will you wear this perfume most?",
    caption: "Different occasions call for different kinds of scents.",
    multiSelect: false,
    columns: 4,
    options: [
      { id: "everyday", title: "Every Day", subtitle: "A go-to scent for daily use", icon: "◯" },
      { id: "office_uni", title: "Office / University", subtitle: "Something professional and clean", icon: "▢" },
      { id: "wedding", title: "Wedding & Family Events", subtitle: "Special gatherings and celebrations", icon: "◆" },
      { id: "date", title: "Date or Special Day", subtitle: "Something memorable and attractive", icon: "✧" },
      { id: "evening", title: "Evening", subtitle: "Nights out, dinners, social events", icon: "◐" },
      { id: "eid", title: "Eid & Festivals", subtitle: "Festive occasions that deserve something rich", icon: "✦" },
      { id: "one_for_all", title: "One Perfume for Everything", subtitle: "A versatile scent for all occasions", icon: "∞" },
    ],
  },
  {
    id: "smell-preference",
    question: "What kind of smell do you like?",
    caption: "Pick up to 3 that you enjoy the most.",
    multiSelect: true,
    columns: 4,
    options: [
      { id: "fresh", title: "Fresh", subtitle: "Clean, airy, like after a shower", icon: "◇" },
      { id: "woody", title: "Woody", subtitle: "Warm wood, like sandalwood or cedar", icon: "▧" },
      { id: "sweet", title: "Sweet", subtitle: "Vanilla, caramel, cozy warmth", icon: "◈" },
      { id: "floral", title: "Floral", subtitle: "Flowers like rose, jasmine, or lily", icon: "❋" },
      { id: "citrus", title: "Citrus", subtitle: "Lemon, orange, bergamot — bright and zesty", icon: "◉" },
      { id: "musky", title: "Musky", subtitle: "Smooth, soft, skin-like warmth", icon: "◌" },
      { id: "spicy", title: "Spicy", subtitle: "Cinnamon, pepper, cardamom", icon: "✺" },
      { id: "clean", title: "Clean & Soapy", subtitle: "Fresh laundry, gentle soap, light and pure", icon: "○" },
    ],
  },
  {
    id: "strength",
    question: "How strong do you want your perfume?",
    caption: "Some people like a subtle scent, others want to leave a lasting impression.",
    multiSelect: false,
    columns: 3,
    options: [
      { id: "light", title: "Light", subtitle: "Soft and close to the skin, noticeable only up close", icon: "◦" },
      { id: "medium", title: "Medium", subtitle: "Balanced — people nearby can smell it nicely", icon: "◎" },
      { id: "strong", title: "Strong", subtitle: "Bold and powerful, leaves a trail behind you", icon: "◉" },
    ],
  },
  {
    id: "longevity",
    question: "How long should your perfume last?",
    caption: "This helps us choose the right concentration for you.",
    multiSelect: false,
    columns: 3,
    options: [
      { id: "short", title: "4–6 Hours", subtitle: "Good enough for half a day", icon: "◔" },
      { id: "allday", title: "All Day", subtitle: "Morning to evening without reapplying", icon: "◑" },
      { id: "maximum", title: "As Long As Possible", subtitle: "Maximum lasting power, even on clothes", icon: "●" },
    ],
  },
  {
    id: "weather",
    question: "What's the weather like where you usually live?",
    caption: "Heat and humidity affect how a perfume smells on your skin.",
    multiSelect: false,
    columns: 3,
    options: [
      { id: "hot", title: "Hot", subtitle: "Dry heat, mostly sunny and warm", icon: "△" },
      { id: "hot_humid", title: "Hot & Humid", subtitle: "Tropical — warm and moist, like Dhaka", icon: "▽" },
      { id: "mixed", title: "Mixed", subtitle: "Changes with the season — hot, cold, rainy", icon: "◇" },
    ],
  },
  {
    id: "style",
    question: "Which style suits you best?",
    caption: "Your perfume should match the way you carry yourself.",
    multiSelect: false,
    columns: 3,
    options: [
      { id: "simple", title: "Simple", subtitle: "Clean, minimal, no fuss", icon: "─" },
      { id: "modern", title: "Modern", subtitle: "Trendy, sharp, up-to-date", icon: "◧" },
      { id: "elegant", title: "Elegant", subtitle: "Sophisticated, polished, graceful", icon: "◆" },
      { id: "traditional", title: "Traditional", subtitle: "Classic taste, timeless choices", icon: "□" },
      { id: "trendy", title: "Trendy", subtitle: "Bold, eye-catching, fashion-forward", icon: "△" },
    ],
  },
  {
    id: "comfort-smell",
    question: "Which smell makes you feel comfortable?",
    caption: "Think about what naturally makes you feel calm or happy.",
    multiSelect: false,
    columns: 4,
    options: [
      { id: "rain", title: "Rain", subtitle: "The smell of earth right after it rains", icon: "◠" },
      { id: "fresh_clothes", title: "Fresh Clothes", subtitle: "Clean laundry, warm from the sun", icon: "▫" },
      { id: "garden", title: "Garden Flowers", subtitle: "A walk through a blooming garden", icon: "❁" },
      { id: "coffee", title: "Coffee", subtitle: "Rich, roasted, warm and cozy", icon: "◍" },
      { id: "forest", title: "Forest", subtitle: "Trees, moss, fresh green air", icon: "▲" },
      { id: "ocean", title: "Ocean Breeze", subtitle: "Salty sea air, cool and refreshing", icon: "≈" },
      { id: "luxury_hotel", title: "Luxury Hotel", subtitle: "That clean, premium smell in a fine hotel lobby", icon: "◇" },
    ],
  },
  {
    id: "priority",
    question: "What's most important to you in a perfume?",
    caption: "We'll prioritize this when choosing your recommendation.",
    multiSelect: false,
    columns: 3,
    options: [
      { id: "long_lasting", title: "Long-lasting", subtitle: "I want it to stay on all day", icon: "∞" },
      { id: "fresh_smell", title: "Fresh Smell", subtitle: "Clean and refreshing is my priority", icon: "◇" },
      { id: "compliments", title: "Gets Compliments", subtitle: "I want people to notice and ask about it", icon: "✧" },
      { id: "daily_use", title: "Good for Daily Use", subtitle: "Something I can wear every single day", icon: "◯" },
      { id: "unique", title: "Unique Scent", subtitle: "I don't want to smell like everyone else", icon: "◈" },
      { id: "premium", title: "Premium Quality", subtitle: "I want the best ingredients and craftsmanship", icon: "◆" },
    ],
  },
];

/* ────────────────────── Recommendations ────────────────────── */

const recommendations: Record<string, Recommendation> = {
  light: {
    name: "Orvi Soq",
    collection: "Édition Lumière",
    tagline: "Where light meets skin",
    description:
      "A clean, effortless perfume that feels like a fresh morning breeze. It opens with sparkling bergamot and dewy green tea, unfolds into soft white iris and jasmine, and settles into gentle blonde wood and clean musk. Perfect for everyday wear — light, airy, and beautifully refreshing.",
    matchScore: 92,
    olfactoryProfile: [
      { label: "Fresh", value: 90 },
      { label: "Floral", value: 72 },
      { label: "Woody", value: 45 },
      { label: "Citrus", value: 82 },
      { label: "Sweet", value: 30 },
      { label: "Musky", value: 55 },
    ],
    fragranceDNA: [
      { family: "Fresh", percentage: 35, color: "#A8C5A0" },
      { family: "Floral", percentage: 28, color: "#D4A0B9" },
      { family: "Citrus", percentage: 22, color: "#E8C87A" },
      { family: "Woody", percentage: 15, color: "#B8977A" },
    ],
    notes: {
      top: ["Bergamot", "Green Tea", "Pink Pepper"],
      heart: ["White Iris", "Jasmine Sambac", "Peony"],
      base: ["Blonde Wood", "White Musk", "Ambrette"],
    },
    longevity: 68,
    projection: 45,
    sillage: "Soft — noticed only up close",
    season: "Spring / Summer",
  },
  balanced: {
    name: "Orvi Soq",
    collection: "Édition Classique",
    tagline: "The art of quiet confidence",
    description:
      "A beautifully balanced perfume for someone who wants to smell premium without being too loud. It starts with Italian bergamot and cardamom, moves into rich rose and oud, and finishes with warm sandalwood and amber. Elegant, versatile, and perfect for both office and special occasions.",
    matchScore: 96,
    olfactoryProfile: [
      { label: "Woody", value: 85 },
      { label: "Spicy", value: 68 },
      { label: "Sweet", value: 75 },
      { label: "Floral", value: 52 },
      { label: "Warm", value: 60 },
      { label: "Musky", value: 70 },
    ],
    fragranceDNA: [
      { family: "Woody", percentage: 32, color: "#8B7355" },
      { family: "Warm", percentage: 28, color: "#C9A96E" },
      { family: "Spicy", percentage: 22, color: "#B85C3A" },
      { family: "Floral", percentage: 18, color: "#D4A0B9" },
    ],
    notes: {
      top: ["Italian Bergamot", "Black Cardamom", "Saffron"],
      heart: ["Rose Absolute", "Oud", "Iris"],
      base: ["Mysore Sandalwood", "Amber", "Tonka Bean"],
    },
    longevity: 88,
    projection: 72,
    sillage: "Moderate — people nearby will notice",
    season: "Autumn / Winter",
  },
  bold: {
    name: "Orvi Soq",
    collection: "Édition Noire",
    tagline: "Make every entrance unforgettable",
    description:
      "A bold, powerful perfume for those who want to leave a lasting impression. It opens with deep oud and smoky incense, layered over rich rose and frankincense, and settles into aged sandalwood and warm musk. This scent fills a room and stays on for hours — made for someone who wants to be remembered.",
    matchScore: 94,
    olfactoryProfile: [
      { label: "Warm", value: 92 },
      { label: "Woody", value: 88 },
      { label: "Spicy", value: 78 },
      { label: "Musky", value: 82 },
      { label: "Sweet", value: 65 },
      { label: "Smoky", value: 70 },
    ],
    fragranceDNA: [
      { family: "Warm", percentage: 38, color: "#C9A96E" },
      { family: "Woody", percentage: 28, color: "#6B5240" },
      { family: "Spicy", percentage: 20, color: "#A0422A" },
      { family: "Musky", percentage: 14, color: "#7A6B60" },
    ],
    notes: {
      top: ["Cambodian Oud", "Smoked Incense", "Black Pepper"],
      heart: ["Turkish Rose", "Frankincense", "Cinnamon Bark"],
      base: ["Aged Sandalwood", "Benzoin", "Warm Musk"],
    },
    longevity: 95,
    projection: 88,
    sillage: "Strong — fills the room",
    season: "Late Autumn / Winter",
  },
};

/* ────────────────────── Recommendation Logic ────────────────────── */

export function getRecommendation(
  answers: Record<number, string | string[]>
): Recommendation {
  // Use strength answer (step index 3) to pick recommendation tier
  const strength = answers[3] as string | undefined;

  if (strength === "light") {
    return recommendations.light;
  }
  if (strength === "strong") {
    return recommendations.bold;
  }
  return recommendations.balanced;
}
