export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  rating: number;
  reviews: number;
  price: string;
  priceVal: number;
  volume: string;
  image: string;
  family: string;
  gender: string;
  occasion: string;
  meter: string;
}

// Mock data templates — replace with real API data later
const mockProducts: Array<{
  name: string;
  brand: string;
  description: string;
  rating: number;
  reviews: number;
  priceVal: number;
  image: string;
  family: string;
  gender: string;
  occasion: string;
  meter: string;
}> = [
  {
    name: "Orvi Soq",
    brand: "Dior",
    description: "Beautifully sofisticare and lasting perfume, crafted to be their creation inspired by the gone collection. Must have in your collection.",
    rating: 4.5,
    reviews: 195,
    priceVal: 1720,
    image: "/images/products/jade_serenity.png",
    family: "Citrus",
    gender: "Unisex",
    occasion: "Casual",
    meter: "Moderate",
  },
  {
    name: "Orvi Soq",
    brand: "Dior",
    description: "Beautifully sofisticare and lasting perfume crafted from the first inspiration to turn your emotions. Must have in your collection.",
    rating: 4.5,
    reviews: 195,
    priceVal: 1420,
    image: "/images/products/coral_sea.png",
    family: "Fresh",
    gender: "Men",
    occasion: "Formal",
    meter: "Long Lasting",
  },
  {
    name: "Orvi Soq",
    brand: "Dior",
    description: "The perfect scent was large from the dior sofisticate crafted, the first dior creation inspired by original milestone. Daily use perfume.",
    rating: 4.5,
    reviews: 195,
    priceVal: 1220,
    image: "/images/products/magnetism.png",
    family: "Woody",
    gender: "Men",
    occasion: "Night Out",
    meter: "Moderate",
  },
  {
    name: "Orvi Soq",
    brand: "Dior",
    description: "Beautifully sofisticare and crafted perfume, crafted to be their creation inspired by the gone collection. Must have in your collection.",
    rating: 4.5,
    reviews: 195,
    priceVal: 1320,
    image: "/images/products/hellenist.png",
    family: "Oriental",
    gender: "Women",
    occasion: "Date Night",
    meter: "Beast Mode",
  },
  {
    name: "Orvi Soq",
    brand: "Dior",
    description: "Beautifully sofisticare and lasting perfume of its creation, must have in your gone collection. The perfect addition to dior tradition. Must for all.",
    rating: 4.5,
    reviews: 195,
    priceVal: 1150,
    image: "/images/products/jade_serenity.png",
    family: "Citrus",
    gender: "Men",
    occasion: "Daily Wear",
    meter: "Intimate",
  },
  {
    name: "Orvi Soq",
    brand: "Dior",
    description: "Beautifully sofisticare and lasting perfume crafted from the first inspiration to turn your emotions. An era of perfection.",
    rating: 4.5,
    reviews: 195,
    priceVal: 1650,
    image: "/images/products/coral_sea.png",
    family: "Oriental",
    gender: "Women",
    occasion: "Formal",
    meter: "Beast Mode",
  },
  {
    name: "Orvi Soq",
    brand: "Dior",
    description: "The perfect scent was large from sofisticate crafted perfume, the first dior creation inspired by the gone collection. Must try in out of time era.",
    rating: 4.5,
    reviews: 195,
    priceVal: 1520,
    image: "/images/products/magnetism.png",
    family: "Citrus",
    gender: "Unisex",
    occasion: "Casual",
    meter: "Moderate",
  },
  {
    name: "Orvi Soq",
    brand: "Dior",
    description: "Beautifully sofisticare and lasting perfume of its creation, must have in your collection. The sofisticated addition crafted in era of perfume.",
    rating: 4.5,
    reviews: 195,
    priceVal: 1580,
    image: "/images/products/hellenist.png",
    family: "Fresh",
    gender: "Men",
    occasion: "Daily Wear",
    meter: "Long Lasting",
  },
];

// Generate catalog by repeating mock data across pages
export const productsCatalog: Product[] = Array.from({ length: 24 }, (_, i) => {
  const template = mockProducts[i % mockProducts.length];

  return {
    id: (i + 1).toString(),
    name: template.name,
    brand: template.brand,
    description: template.description,
    rating: template.rating,
    reviews: template.reviews,
    price: `${template.priceVal.toLocaleString()}tk`,
    priceVal: template.priceVal,
    volume: "100ml",
    image: template.image,
    family: template.family,
    gender: template.gender,
    occasion: template.occasion,
    meter: template.meter,
  };
});
