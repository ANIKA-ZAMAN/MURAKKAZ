export interface DifferencePoint {
  id: string;
  title: string;
  desc: string;
  iconType: "globe" | "leaf" | "clock" | "arrow";
}

export const differencePointsData: DifferencePoint[] = [
  {
    id: "iconic",
    title: "Inspired by Iconic Fragrances",
    desc: "Carefully matching the scent profile of history's most renowned creations, bringing premium luxury within reach.",
    iconType: "globe",
  },
  {
    id: "ingredients",
    title: "Premium Ingredients",
    desc: "Formulated using only high-grade, responsibly sourced essential oils and fine raw aromatics from across the globe.",
    iconType: "leaf",
  },
  {
    id: "performance",
    title: "Long Lasting Performance",
    desc: "Formulated as high-concentration Extraits de Parfum to ensure outstanding projection, sillage, and all-day longevity.",
    iconType: "clock",
  },
  {
    id: "craftsmanship",
    title: "Crafted with Care",
    desc: "Each bottle is hand-poured, quality-checked, and packaged in small batches to preserve consistency and olfactory purity.",
    iconType: "arrow",
  },
];
