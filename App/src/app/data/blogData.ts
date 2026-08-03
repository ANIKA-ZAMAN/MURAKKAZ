export interface BlogPost {
  id: string;
  slug?: string;
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  content: string | string[];
  image: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  category: string;
  readTime: string;
  quote?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "best-perfumes-summer-bangladesh",
    slug: "best-perfumes-summer-bangladesh",
    date: "19th May, 2026",
    title: "Best perfumes for summer in Bangladesh",
    subtitle: "Beast-mode fresh extraits tailored for extreme heat & high humidity.",
    description: "Summers in Bangladesh are notoriously brutal, combining high heat with extreme humidity. This combination accelerates evaporation, causing standard fresh fragrances to completely disappear within an hour...",
    content: "Summers in Bangladesh are notoriously brutal, combining high heat with extreme humidity. This combination accelerates evaporation, causing standard fresh fragrances to completely disappear within an hour. High-concentration Extraits de Parfum with sharp citrus and vetiver bases perform best under local weather conditions.",
    image: "/images/events/event1.jpg",
    author: "Eliyash Hossain",
    category: "Fragrance Guide",
    readTime: "4 min read"
  },
  {
    id: "how-to-choose-perfume-edp-edt",
    slug: "how-to-choose-perfume-edp-edt",
    date: "18th May, 2026",
    title: "How to Choose a Perfume & The Difference Between EDP and EDT",
    subtitle: "Understanding oil concentration, projection radius, and skin chemistry.",
    description: "Choosing the right scent comes down to understanding concentration levels and matching them to your daily environment.",
    content: "Choosing the right scent comes down to understanding concentration levels and matching them to your daily environment. Eau de Toilette offers lighter daily projection, whereas Extrait de Parfum delivers beast-mode longevity through high essential oil ratios.",
    image: "/images/events/event2.jpg",
    author: "Eliyash Hossain",
    category: "Science of Scent",
    readTime: "5 min read"
  },
  {
    id: "master-guide-fragrance-layering",
    slug: "master-guide-fragrance-layering",
    date: "15th May, 2026",
    title: "The Master Guide to Fragrance Layering",
    subtitle: "Create your unique, unrepeatable signature scent signature.",
    description: "Fragrance layering is the ultimate insider trick to ensure you never smell like anyone else in the room. It involves combining two distinct perfumes to create a custom, signature scent trail.",
    content: "Fragrance layering is the ultimate insider trick to ensure you never smell like anyone else in the room. It involves combining two distinct perfumes to create a custom, signature scent trail.",
    image: "/images/events/event3.jpg",
    author: "Eliyash Hossain",
    category: "Artisanal Craft",
    readTime: "6 min read"
  },
  {
    id: "best-perfumes-summer-bangladesh-2",
    slug: "best-perfumes-summer-bangladesh-2",
    date: "19th May, 2026",
    title: "Best perfumes for summer in Bangladesh",
    subtitle: "Beast-mode fresh extraits tailored for extreme heat & high humidity.",
    description: "Summers in Bangladesh are notoriously brutal, combining high heat with extreme humidity. This combination accelerates evaporation, causing standard fresh fragrances to completely disappear within an hour...",
    content: "Summers in Bangladesh are notoriously brutal, combining high heat with extreme humidity. This combination accelerates evaporation, causing standard fresh fragrances to completely disappear within an hour.",
    image: "/images/events/event1.jpg",
    author: "Eliyash Hossain",
    category: "Fragrance Guide",
    readTime: "4 min read"
  },
  {
    id: "how-to-choose-perfume-edp-edt-2",
    slug: "how-to-choose-perfume-edp-edt-2",
    date: "18th May, 2026",
    title: "How to Choose a Perfume & The Difference Between EDP and EDT",
    subtitle: "Understanding oil concentration, projection radius, and skin chemistry.",
    description: "Choosing the right scent comes down to understanding concentration levels and matching them to your daily environment.",
    content: "Choosing the right scent comes down to understanding concentration levels and matching them to your daily environment.",
    image: "/images/events/event2.jpg",
    author: "Eliyash Hossain",
    category: "Science of Scent",
    readTime: "5 min read"
  },
  {
    id: "master-guide-fragrance-layering-2",
    slug: "master-guide-fragrance-layering-2",
    date: "15th May, 2026",
    title: "The Master Guide to Fragrance Layering",
    subtitle: "Create your unique, unrepeatable signature scent signature.",
    description: "Fragrance layering is the ultimate insider trick to ensure you never smell like anyone else in the room. It involves combining two distinct perfumes to create a custom, signature scent trail.",
    content: "Fragrance layering is the ultimate insider trick to ensure you never smell like anyone else in the room. It involves combining two distinct perfumes to create a custom, signature scent trail.",
    image: "/images/events/event3.jpg",
    author: "Eliyash Hossain",
    category: "Artisanal Craft",
    readTime: "6 min read"
  }
];
