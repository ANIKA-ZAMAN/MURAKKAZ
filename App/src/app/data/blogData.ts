export interface BlogPost {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    date: "18th May, 2026",
    title: "Best perfumes for summer in Bangladesh",
    description: "Summers in Bangladesh are notoriously brutal, combining high heat with extreme humidity. This combination accelerates evaporation, causing standard fresh fragrances to completely disappear within an hour...",
    image: "/images/events/sadid.jpg", // mock photo fallback
  },
  {
    id: "post-2",
    date: "16th May, 2026",
    title: "How to Choose a Perfume & The Difference Between EDP and EDT",
    description: "Choosing the right scent comes down to understanding concentration levels and matching them to your daily environment.",
    image: "/images/events/sadid.jpg",
  },
  {
    id: "post-3",
    date: "15th May, 2026",
    title: "The Master Guide to Fragrance Layering",
    description: "Fragrance layering is the ultimate insider trick to ensure you never smell like anyone else in the room. It involves combining two distinct perfumes to create a custom, signature scent trail.",
    image: "/images/events/sadid.jpg",
  },
  {
    id: "post-4",
    date: "18th May, 2026",
    title: "Best perfumes for summer in Bangladesh",
    description: "Summers in Bangladesh are notoriously brutal, combining high heat with extreme humidity. This combination accelerates evaporation, causing standard fresh fragrances to completely disappear within an hour...",
    image: "/images/events/sadid.jpg",
  },
  {
    id: "post-5",
    date: "16th May, 2026",
    title: "How to Choose a Perfume & The Difference Between EDP and EDT",
    description: "Choosing the right scent comes down to understanding concentration levels and matching them to your daily environment.",
    image: "/images/events/sadid.jpg",
  },
  {
    id: "post-6",
    date: "15th May, 2026",
    title: "The Master Guide to Fragrance Layering",
    description: "Fragrance layering is the ultimate insider trick to ensure you never smell like anyone else in the room. It involves combining two distinct perfumes to create a custom, signature scent trail.",
    image: "/images/events/sadid.jpg",
  },
];
