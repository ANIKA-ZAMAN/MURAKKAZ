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
    id: "lifestyle",
    question: "How would you describe your daily rhythm?",
    caption: "Your lifestyle shapes the scent that becomes your second skin.",
    multiSelect: false,
    columns: 2,
    options: [
      { id: "minimalist", title: "The Minimalist", subtitle: "Clean lines, quiet confidence, less is more", icon: "◯" },
      { id: "explorer", title: "The Explorer", subtitle: "Bold adventures, new horizons, untamed spirit", icon: "◇" },
      { id: "connoisseur", title: "The Connoisseur", subtitle: "Refined taste, cultural depth, quiet luxury", icon: "□" },
      { id: "dreamer", title: "The Dreamer", subtitle: "Creative soul, artistic vision, boundless imagination", icon: "△" },
    ],
  },
  {
    id: "occasion",
    question: "When will this fragrance accompany you?",
    caption: "Every moment deserves its own olfactory signature.",
    multiSelect: false,
    columns: 2,
    options: [
      { id: "daily", title: "Daily Ritual", subtitle: "Your everyday signature, from dawn to dusk", icon: "☀" },
      { id: "evening", title: "Grand Soirée", subtitle: "Evening elegance, memorable entrances", icon: "✦" },
      { id: "professional", title: "The Boardroom", subtitle: "Commanding presence, understated power", icon: "▣" },
      { id: "intimate", title: "Intimate Hours", subtitle: "Close encounters, whispered conversations", icon: "❋" },
    ],
  },
  {
    id: "intensity",
    question: "How do you prefer your scent to speak?",
    caption: "From a whisper to a crescendo — find your volume.",
    multiSelect: false,
    columns: 4,
    options: [
      { id: "whisper", title: "Whisper", subtitle: "A secret between you and your skin", icon: "·" },
      { id: "murmur", title: "Murmur", subtitle: "Discovered only in closeness", icon: ":" },
      { id: "resonance", title: "Resonance", subtitle: "Your confident signature trail", icon: "∴" },
      { id: "crescendo", title: "Crescendo", subtitle: "Bold, commanding, unforgettable", icon: "∷" },
    ],
  },
  {
    id: "families",
    question: "Which scent families resonate with you?",
    caption: "Select all that call to you. There are no wrong answers.",
    multiSelect: true,
    columns: 4,
    options: [
      { id: "woody", title: "Woody", subtitle: "Cedar, sandalwood, vetiver", icon: "🪵" },
      { id: "floral", title: "Floral", subtitle: "Rose, jasmine, iris", icon: "❀" },
      { id: "oriental", title: "Oriental", subtitle: "Amber, incense, vanilla", icon: "✧" },
      { id: "fresh", title: "Fresh", subtitle: "Green tea, mint, cucumber", icon: "❊" },
      { id: "citrus", title: "Citrus", subtitle: "Bergamot, neroli, lemon", icon: "◉" },
      { id: "aromatic", title: "Aromatic", subtitle: "Lavender, sage, rosemary", icon: "❁" },
      { id: "spicy", title: "Spicy", subtitle: "Saffron, cardamom, pepper", icon: "✺" },
      { id: "gourmand", title: "Gourmand", subtitle: "Tonka, praline, coffee", icon: "◈" },
    ],
  },
  {
    id: "memories",
    question: "Which atmosphere speaks to your soul?",
    caption: "Scent is the most intimate form of memory.",
    multiSelect: false,
    columns: 3,
    options: [
      { id: "petrichor", title: "Petrichor", subtitle: "Rain on sun-warmed earth after a summer storm", icon: "☁" },
      { id: "bibliotheque", title: "Bibliothèque", subtitle: "Aged leather, pressed pages, tobacco wood", icon: "📖" },
      { id: "jardin", title: "Jardin Secret", subtitle: "Morning dew on roses, fresh herbs, warm soil", icon: "🌿" },
      { id: "feudebois", title: "Feu de Bois", subtitle: "Crackling fire, smoked cedar, autumn twilight", icon: "🔥" },
      { id: "brisemarine", title: "Brise Marine", subtitle: "Salt air, driftwood, sun-bleached linen", icon: "🌊" },
      { id: "souk", title: "Le Souk", subtitle: "Cardamom, saffron, aged oud, market spice", icon: "✴" },
    ],
  },
  {
    id: "style",
    question: "How would you define your personal aesthetic?",
    caption: "Your fragrance should be an extension of who you are.",
    multiSelect: false,
    columns: 2,
    options: [
      { id: "heritage", title: "Heritage", subtitle: "Timeless elegance, tailored precision, enduring classics", icon: "◆" },
      { id: "avantgarde", title: "Avant-Garde", subtitle: "Future-forward, breaking conventions, architectural beauty", icon: "◭" },
      { id: "naturalist", title: "Naturalist", subtitle: "Earth-conscious, organic textures, raw beauty", icon: "◎" },
      { id: "maximalist", title: "Maximalist", subtitle: "Unapologetic luxury, rich layers, dramatic presence", icon: "❖" },
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
      "A luminous, effortless composition that captures the first breath of morning. Orvi Soq Édition Lumière opens with sparkling bergamot and dewy green tea, unfolding into a heart of white iris and sheer jasmine. The dry-down reveals a whisper of blonde wood and clean musk — a fragrance that feels like sunlight on bare shoulders.",
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
    sillage: "Intimate to Moderate",
    season: "Spring / Summer",
  },
  balanced: {
    name: "Orvi Soq",
    collection: "Édition Classique",
    tagline: "The art of quiet command",
    description:
      "A masterfully balanced composition for those who understand that true luxury needs no announcement. Édition Classique opens with a refined accord of Italian bergamot and black cardamom, transitions through a heart of Bulgarian rose absolute and sacred oud, and settles into a profound base of Mysore sandalwood and amber resin — timeless, assured, unmistakable.",
    matchScore: 96,
    olfactoryProfile: [
      { label: "Woody", value: 85 },
      { label: "Spicy", value: 68 },
      { label: "Oriental", value: 75 },
      { label: "Floral", value: 52 },
      { label: "Sweet", value: 60 },
      { label: "Musky", value: 70 },
    ],
    fragranceDNA: [
      { family: "Woody", percentage: 32, color: "#8B7355" },
      { family: "Oriental", percentage: 28, color: "#C9A96E" },
      { family: "Spicy", percentage: 22, color: "#B85C3A" },
      { family: "Floral", percentage: 18, color: "#D4A0B9" },
    ],
    notes: {
      top: ["Italian Bergamot", "Black Cardamom", "Saffron"],
      heart: ["Rose Absolute", "Oud Assafi", "Iris Pallida"],
      base: ["Mysore Sandalwood", "Amber Resin", "Tonka Bean"],
    },
    longevity: 88,
    projection: 72,
    sillage: "Moderate to Heavy",
    season: "Autumn / Winter",
  },
  bold: {
    name: "Orvi Soq",
    collection: "Édition Noire",
    tagline: "Darkness, distilled",
    description:
      "An unapologetically bold composition for those who leave an indelible impression. Édition Noire erupts with a dark opening of Cambodian oud and smoked labdanum, layered over a beating heart of Turkish rose absolute and frankincense. The base is a profound meditation on aged sandalwood, benzoin, and civet musk — a fragrance that commands every room it enters.",
    matchScore: 94,
    olfactoryProfile: [
      { label: "Oriental", value: 92 },
      { label: "Woody", value: 88 },
      { label: "Spicy", value: 78 },
      { label: "Musky", value: 82 },
      { label: "Sweet", value: 65 },
      { label: "Smoky", value: 70 },
    ],
    fragranceDNA: [
      { family: "Oriental", percentage: 38, color: "#C9A96E" },
      { family: "Woody", percentage: 28, color: "#6B5240" },
      { family: "Spicy", percentage: 20, color: "#A0422A" },
      { family: "Musky", percentage: 14, color: "#7A6B60" },
    ],
    notes: {
      top: ["Cambodian Oud", "Smoked Labdanum", "Black Pepper"],
      heart: ["Turkish Rose", "Frankincense", "Cinnamon Bark"],
      base: ["Aged Sandalwood", "Benzoin", "Civet Musk"],
    },
    longevity: 95,
    projection: 88,
    sillage: "Heavy — Room-filling",
    season: "Late Autumn / Winter",
  },
};

/* ────────────────────── Recommendation Logic ────────────────────── */

export function getRecommendation(
  answers: Record<number, string | string[]>
): Recommendation {
  // Use intensity answer (step index 2) to pick recommendation tier
  const intensity = answers[2] as string | undefined;

  if (intensity === "whisper" || intensity === "murmur") {
    return recommendations.light;
  }
  if (intensity === "crescendo") {
    return recommendations.bold;
  }
  return recommendations.balanced;
}
