export interface Product {
  id: string;
  name: string;
  brand: string;
  inspiredBy?: string;
  description: string;
  rating: number;
  reviews: number;
  price: string;
  originalPrice?: string;
  priceVal: number;
  originalPriceVal?: number;
  volume: string;
  image: string;
  family: string;
  gender: string;
  occasion: string;
  meter: string;
  notes: string[];
}

// Rich Mock Data Catalog with 84 perfumes for 7 full pages
const mockProducts: Array<{
  name: string;
  brand: string;
  inspiredBy: string;
  description: string;
  rating: number;
  reviews: number;
  priceVal: number;
  originalPriceVal: number;
  image: string;
  family: string;
  gender: string;
  occasion: string;
  meter: string;
  notes: string[];
}> = [
  {
    name: "Jade Serenity",
    brand: "Dior",
    inspiredBy: "Inspired by Dio Savotage",
    description: "Beautifully sofisticare and lasting perfume, crafted to be their creation inspired by the gone collection. Must have in your collection.",
    rating: 4.5,
    reviews: 195,
    priceVal: 1630,
    originalPriceVal: 1920,
    image: "/images/products/jade_serenity.png",
    family: "Citrus",
    gender: "Unisex",
    occasion: "Casual",
    meter: "Moderate",
    notes: ["Bergamot", "Lemon", "Amber", "Vetiver"],
  },
  {
    name: "Coral Sea",
    brand: "Jo Malone",
    inspiredBy: "Inspired by Jo Malone Wood Sage & Sea Salt",
    description: "Beautifully sofisticare and lasting perfume crafted from the first inspiration to turn your emotions. Must have in your collection.",
    rating: 4.5,
    reviews: 195,
    priceVal: 1420,
    originalPriceVal: 1680,
    image: "/images/products/coral_sea.png",
    family: "Fresh",
    gender: "Men",
    occasion: "Formal",
    meter: "Long Lasting",
    notes: ["Sea Salt", "Sage", "Bergamot", "Grapefruit"],
  },
  {
    name: "Murakkaz Noir",
    brand: "Dior",
    inspiredBy: "Inspired by Dior Sauvage Elixir",
    description: "The perfect scent was large from the dior sofisticate crafted, the first dior creation inspired by original milestone. Daily use perfume.",
    rating: 4.8,
    reviews: 245,
    priceVal: 1850,
    originalPriceVal: 2200,
    image: "/images/products/magnetism.png",
    family: "Woody",
    gender: "Men",
    occasion: "Night Out",
    meter: "Moderate",
    notes: ["Lavender", "Sandalwood", "Amber", "Vanilla", "Leather"],
  },
  {
    name: "Hellenist",
    brand: "Maison Francis",
    inspiredBy: "Inspired by Baccarat Rouge 540",
    description: "Beautifully sofisticare and crafted perfume, crafted to be their creation inspired by the gone collection. Must have in your collection.",
    rating: 4.9,
    reviews: 310,
    priceVal: 1950,
    originalPriceVal: 2350,
    image: "/images/products/hellenist.png",
    family: "Oriental",
    gender: "Women",
    occasion: "Date Night",
    meter: "Beast Mode",
    notes: ["Saffron", "Jasmine", "Amberwood", "Cedarwood", "Rose"],
  },
  {
    name: "Orvi Soq",
    brand: "Dior",
    inspiredBy: "Inspired by Dio Savotage",
    description: "Beautifully sofisticare and lasting perfume of its creation, must have in your gone collection. The perfect addition to dior tradition. Must for all.",
    rating: 4.2,
    reviews: 150,
    priceVal: 1630,
    originalPriceVal: 1920,
    image: "/images/products/jade_serenity.png",
    family: "Citrus",
    gender: "Men",
    occasion: "Daily Wear",
    meter: "Intimate",
    notes: ["Bergamot", "Mandarin", "Vetiver", "Patchouli"],
  },
  {
    name: "Amber Gold",
    brand: "Tom Ford",
    inspiredBy: "Inspired by Tom Ford Tobacco Vanille",
    description: "Beautifully sofisticare and lasting perfume crafted from the first inspiration to turn your emotions. An era of perfection.",
    rating: 4.6,
    reviews: 210,
    priceVal: 1750,
    originalPriceVal: 2100,
    image: "/images/products/amber_gold.png",
    family: "Oriental",
    gender: "Women",
    occasion: "Formal",
    meter: "Beast Mode",
    notes: ["Vanilla", "Orchid", "Amber", "Sandalwood"],
  },
  {
    name: "Velvet Oud",
    brand: "Lattafa",
    inspiredBy: "Inspired by Tom Ford Oud Wood",
    description: "The perfect scent was large from sofisticate crafted perfume, the first dior creation inspired by the gone collection. Must try in out of time era.",
    rating: 4.4,
    reviews: 180,
    priceVal: 1520,
    originalPriceVal: 1800,
    image: "/images/products/velvet_oud.png",
    family: "Citrus",
    gender: "Unisex",
    occasion: "Casual",
    meter: "Moderate",
    notes: ["Bergamot", "Neroli", "Amber", "Musk"],
  },
  {
    name: "Silver Mountain",
    brand: "Creed",
    inspiredBy: "Inspired by Creed Silver Mountain Water",
    description: "Beautifully sofisticare and lasting perfume of its creation, must have in your collection. The sofisticated addition crafted in era of perfume.",
    rating: 4.7,
    reviews: 240,
    priceVal: 1890,
    originalPriceVal: 2250,
    image: "/images/products/silver_mountain.png",
    family: "Fresh",
    gender: "Men",
    occasion: "Daily Wear",
    meter: "Long Lasting",
    notes: ["Mint", "Green Apple", "Lemon", "Rose", "Vanilla"],
  },
  {
    name: "Royal Aventus",
    brand: "Creed",
    inspiredBy: "Inspired by Creed Aventus",
    description: "Empowering blend of pineapple, birch, and musk. Icon of modern perfumery.",
    rating: 4.9,
    reviews: 380,
    priceVal: 2100,
    originalPriceVal: 2500,
    image: "/images/products/magnetism.png",
    family: "Chypre",
    gender: "Men",
    occasion: "Formal",
    meter: "Beast Mode",
    notes: ["Pineapple", "Birch", "Blackcurrant", "Oakmoss"],
  },
  {
    name: "Midnight Blossom",
    brand: "YSL",
    inspiredBy: "Inspired by YSL Black Opium",
    description: "Addictive coffee and vanilla blossom composition for unforgettable nights out.",
    rating: 4.7,
    reviews: 290,
    priceVal: 1680,
    originalPriceVal: 1980,
    image: "/images/products/hellenist.png",
    family: "Gourmand",
    gender: "Women",
    occasion: "Night Out",
    meter: "Long Lasting",
    notes: ["Black Coffee", "White Flowers", "Vanilla", "Cedarwood"],
  },
  {
    name: "Sapphire Sky",
    brand: "Chanel",
    inspiredBy: "Inspired by Bleu de Chanel",
    description: "A timeless aromatic woody fragrance with vibrant grapefruit and incense.",
    rating: 4.8,
    reviews: 320,
    priceVal: 1780,
    originalPriceVal: 2100,
    image: "/images/products/coral_sea.png",
    family: "Woody",
    gender: "Men",
    occasion: "Daily Wear",
    meter: "Moderate",
    notes: ["Grapefruit", "Incense", "Ginger", "Cedar"],
  },
  {
    name: "Imperial Oud",
    brand: "Initio",
    inspiredBy: "Inspired by Oud for Greatness",
    description: "Majestic natural oud, lavender, and nutmeg for a powerful royal presence.",
    rating: 4.9,
    reviews: 260,
    priceVal: 2250,
    originalPriceVal: 2700,
    image: "/images/products/velvet_oud.png",
    family: "Woody",
    gender: "Unisex",
    occasion: "Special Occasion",
    meter: "Beast Mode",
    notes: ["Oud", "Saffron", "Nutmeg", "Lavender"],
  },
];

// Generate 84 perfumes (7 full pages of 12 items each)
export const productsCatalog: Product[] = Array.from({ length: 84 }, (_, i) => {
  const template = mockProducts[i % mockProducts.length];
  const cycleIndex = Math.floor(i / mockProducts.length);
  const variationPrice = template.priceVal + ((i % 7) * 35 - 105);
  const variationOrigPrice = template.originalPriceVal + ((i % 7) * 45 - 135);

  const name = cycleIndex > 0 ? `${template.name} Vol. ${cycleIndex + 1}` : template.name;

  return {
    id: (i + 1).toString(),
    name: name,
    brand: template.brand,
    inspiredBy: template.inspiredBy,
    description: template.description,
    rating: parseFloat(Math.min(5.0, Math.max(4.0, template.rating + ((i % 5) * 0.1 - 0.2))).toFixed(1)),
    reviews: template.reviews + (i * 4),
    price: `${variationPrice.toLocaleString()}tk`,
    originalPrice: `${variationOrigPrice.toLocaleString()}tk`,
    priceVal: variationPrice,
    originalPriceVal: variationOrigPrice,
    volume: "100ml",
    image: template.image,
    family: template.family,
    gender: template.gender,
    occasion: template.occasion,
    meter: template.meter,
    notes: template.notes || [],
  };
});
