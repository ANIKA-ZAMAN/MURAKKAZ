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

export interface PerfumeVideo {
  id: string;
  title: string;
  perfumeName: string;
  perfumeSlug: string;
  category: 'Bottle Showcase' | 'Scent Review' | 'Olfactory Notes' | 'Campaign Film';
  description: string;
  videoUrl: string; // Supports /videos/*.mp4, .webm, or YouTube/Vimeo URLs
  thumbnail: string;
  duration: string;
  views?: string;
  featured?: boolean;
  date?: string;
}

export const perfumeVideos: PerfumeVideo[] = [
  {
    id: "vid-blue-talisman",
    title: "Blue Talisman — Hypnotic Olfactory Jewel",
    perfumeName: "Blue Talisman",
    perfumeSlug: "blue-talisman",
    category: "Bottle Showcase",
    description: "An intimate visual capture of Blue Talisman: radiant bergamot and crisp pear meeting vibrant ginger and majestic modern woods.",
    videoUrl: "/videos/bottleAnimation.mp4",
    thumbnail: "/images/products/blue_talisman.jpg",
    duration: "0:45",
    views: "2.4k views",
    featured: true,
    date: "Sep 2026"
  },
  {
    id: "vid-jade-serenity",
    title: "The Art of Pure Concentrated Perfume Oils",
    perfumeName: "Jade Serenity",
    perfumeSlug: "jade-serenity",
    category: "Campaign Film",
    description: "Discover the craftsmanship, slow extraction, and concentrated purity engineered into every Murakkaz bottle.",
    videoUrl: "/videos/hero-video.mp4",
    thumbnail: "/images/events/video_thumbnail_1.png",
    duration: "1:20",
    views: "3.8k views",
    featured: true,
    date: "Sep 2026"
  },
  {
    id: "vid-sultani-resala",
    title: "Sultani & Resala — Royal Arabian Oud Heritage",
    perfumeName: "Sultani",
    perfumeSlug: "sultani",
    category: "Scent Review",
    description: "Exploring deep oriental ambergris, rare aged oud wood, and the majestic 14-hour projection of our exclusive line.",
    videoUrl: "/videos/bottleAnimation.mp4",
    thumbnail: "/images/events/video_thumbnail_2.png",
    duration: "1:05",
    views: "1.9k views",
    featured: false,
    date: "Aug 2026"
  },
  {
    id: "vid-coral-sea",
    title: "Coral Sea — Windswept Oceanic Mineral Woods",
    perfumeName: "Coral Sea",
    perfumeSlug: "coral-sea",
    category: "Olfactory Notes",
    description: "Sea salt spray, earthy wood sage, and crisp mineral breeze formulated specifically for humid tropical climates.",
    videoUrl: "/videos/hero-video.mp4",
    thumbnail: "/images/products/coral_sea.png",
    duration: "0:52",
    views: "1.2k views",
    featured: false,
    date: "Aug 2026"
  },
  {
    id: "vid-hellenist",
    title: "Hellenist — Golden Amber Crystal Sillage",
    perfumeName: "Hellenist",
    perfumeSlug: "hellenist",
    category: "Bottle Showcase",
    description: "Precious saffron and ethereal jasmine fuse with rich ambergris to create an addictive, room-filling fragrance trail.",
    videoUrl: "/videos/bottleAnimation.mp4",
    thumbnail: "/images/products/hellenist.png",
    duration: "1:15",
    views: "4.1k views",
    featured: true,
    date: "Jul 2026"
  },
  {
    id: "vid-pyramid-secrets",
    title: "Behind the Scent Pyramid: Top, Heart & Base Evolution",
    perfumeName: "Murakkaz Noir",
    perfumeSlug: "murakkaz-noir",
    category: "Olfactory Notes",
    description: "How high-concentration perfume oils unfold across twelve hours from crisp citrus to deep smoky cedar and patchouli.",
    videoUrl: "/videos/hero-video.mp4",
    thumbnail: "/images/products/magnetism.png",
    duration: "1:35",
    views: "2.1k views",
    featured: false,
    date: "Jul 2026"
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "art-of-concentrated-perfume-oils",
    date: "19th May, 2026",
    title: "The Art of Concentrated Perfume Oils in Modern Luxury",
    subtitle: "Why pure oil concentrations outperform traditional alcohol sprays in projection and longevity.",
    description: "Discover why pure concentrated perfume oils (Attar & Extrait) provide a richer, skin-intimate scent trail without the harsh synthetic blast of commercial alcohol sprays.",
    content: "Concentrated perfume oils represent the purest, most historic form of fragrance. Unlike standard eau de parfum sprays that are diluted with 80% alcohol, pure perfume oils interact directly with your skin warmth to create a dynamic, lingering sillage that evolves smoothly over 12 to 18 hours.",
    image: "/images/events/blog1.jpg",
    author: "Eliyash Hossain",
    authorRole: "Master Blender",
    category: "Olfactory Journal",
    readTime: "5 min read"
  },
  {
    id: "2",
    slug: "mastering-scent-layering",
    date: "12th May, 2026",
    title: "Mastering Scent Layering: How to Create Your Bespoke Signature",
    subtitle: "A practical guide to combining woody and citrus profiles for an unforgettable personal scent.",
    description: "Learn the secrets of bespoke fragrance pairing. Combine fresh top notes like bergamot with deep amber bases to design a unique identity that cannot be bought off a shelf.",
    content: "Fragrance layering is an ancient art made effortless with concentrated oils. Begin by applying your heavier base oil—such as oud, amber, or cedarwood—onto pulse points. Follow with a lighter citrus or floral aura to create a multi-dimensional fragrance signature.",
    image: "/images/events/blog2.jpg",
    author: "Zaman Al-Hassan",
    authorRole: "Fragrance Architect",
    category: "Fragrance Guide",
    readTime: "4 min read"
  },
  {
    id: "3",
    slug: "fragrance-care-storage",
    date: "28th April, 2026",
    title: "Preserving Precious Notes: The Golden Rules of Fragrance Storage",
    subtitle: "How heat, humidity, and sunlight degrade perfume molecules, and how to keep them pristine.",
    description: "High-grade perfume compositions contain delicate natural essences. Discover how to protect your collection from degradation and ensure every drop remains as vibrant as day one.",
    content: "Sunlight and fluctuating temperatures are the primary enemies of fine fragrance molecules. To preserve the vibrancy of delicate top notes and the warmth of base accords, store your bottles in cool, dark environments away from bathroom moisture.",
    image: "/images/events/blog3.jpg",
    author: "Sadid Admin",
    authorRole: "Editorial Director",
    category: "Artisanal Craft",
    readTime: "3 min read"
  }
];
