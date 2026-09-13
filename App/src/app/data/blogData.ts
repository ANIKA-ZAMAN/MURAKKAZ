export interface BlogPost {
  id: string;
  slug?: string;
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  content: string | string[];
  image: string;
  duration?: string;
  videoDuration?: string;
  videoUrl?: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  category: 'Guides' | 'Reviews' | 'Behind the Scenes' | 'Stories' | string;
  readTime?: string;
  quote?: string;
}

export interface PerfumeVideo {
  id: string;
  title: string;
  perfumeName: string;
  perfumeSlug: string;
  category: 'Bottle Showcase' | 'Scent Review' | 'Olfactory Notes' | 'Campaign Film';
  description: string;
  videoUrl: string;
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
    slug: "the-story-behind-murakkaz",
    date: "12 JUL 2025",
    title: "The Story Behind Murakkaz",
    subtitle: "Behind the scents, beyond the bottle.",
    description: "A closer look at our journey, inspiration and the art of creating timeless fragrances.",
    duration: "00:45",
    videoDuration: "00:45",
    category: "Behind the Scenes",
    content: "Murakkaz was born from an unwavering reverence for pure fragrance architecture. By balancing traditional oriental perfumery techniques with modern extraction science, every creation is composed as an olfactory masterpiece designed to linger and resonate.",
    image: "/images/events/blog1.jpg",
    author: "Eliyash Hossain",
    authorRole: "Founder & Master Blender",
    readTime: "4 min read"
  },
  {
    id: "2",
    slug: "how-to-choose-your-signature-scent",
    date: "08 JUL 2025",
    title: "How to Choose Your Signature Scent",
    subtitle: "A personal guide to olfactory resonance.",
    description: "A simple guide to finding the fragrance that matches your personality.",
    duration: "00:45",
    videoDuration: "00:45",
    category: "Guides",
    content: "Selecting a signature fragrance goes far beyond first impressions. It involves understanding how top, heart, and base notes react with your individual skin chemistry over several hours of wear.",
    image: "/images/events/blog2.jpg",
    author: "Zaman Al-Hassan",
    authorRole: "Fragrance Architect",
    readTime: "5 min read"
  },
  {
    id: "3",
    slug: "layering-scents-like-a-pro",
    date: "02 JUL 2025",
    title: "Layering Scents Like a Pro",
    subtitle: "Harmonizing contrasting notes.",
    description: "Learn how to layer your perfumes for a longer-lasting and unique scent.",
    duration: "00:45",
    videoDuration: "00:45",
    category: "Guides",
    content: "Layering fragrances creates a bespoke olfactory silhouette. Start with heavier base notes like ambergris or cedarwood, and balance them with refreshing citrus or floral overtones.",
    image: "/images/events/blog3.jpg",
    author: "Eliyash Hossain",
    authorRole: "Master Blender",
    readTime: "4 min read"
  },
  {
    id: "4",
    slug: "top-5-fragrances-for-summer",
    date: "28 JUN 2025",
    title: "Top 5 Fragrances for Summer",
    subtitle: "Effortless freshness under the sun.",
    description: "Our handpicked selection of refreshing scents perfect for the sunny days.",
    duration: "00:45",
    videoDuration: "00:45",
    category: "Reviews",
    content: "Summer calls for crisp citruses, airy sea salts, and green mineral notes that stay crisp and vibrant through intense heat without becoming cloying.",
    image: "/images/events/event_gallery_1.jpg",
    author: "Sadid Admin",
    authorRole: "Editorial Director",
    readTime: "3 min read"
  },
  {
    id: "5",
    slug: "behind-the-bottle",
    date: "20 JUN 2025",
    title: "Behind the Bottle",
    subtitle: "Precision engineering meets timeless craftsmanship.",
    description: "Take a peek into our production process and what makes Murakkaz special.",
    duration: "00:45",
    videoDuration: "00:45",
    category: "Behind the Scenes",
    content: "From hand-blown weighted glass to custom engraved magnetic caps, every Murakkaz bottle is designed to elevate the tactile ritual of personal scent application.",
    image: "/images/events/event_gallery_2.jpg",
    author: "Eliyash Hossain",
    authorRole: "Master Blender",
    readTime: "6 min read"
  },
  {
    id: "6",
    slug: "long-lasting-fragrance-tips",
    date: "15 JUN 2025",
    title: "Long-Lasting Fragrance Tips",
    subtitle: "Maximize projection and skin longevity.",
    description: "Simple tips to make your perfume last all day.",
    duration: "00:45",
    videoDuration: "00:45",
    category: "Guides",
    content: "Hydrated skin holds fragrance molecules significantly longer. Applying an unscented moisturising balm to pulse points prior to applying concentrated perfume oil increases longevity up to sixteen hours.",
    image: "/images/events/eliyas.jpg",
    author: "Zaman Al-Hassan",
    authorRole: "Fragrance Architect",
    readTime: "4 min read"
  },
  {
    id: "7",
    slug: "secrets-of-amber-and-royal-oud",
    date: "10 JUN 2025",
    title: "The Secrets of Amber & Royal Oud",
    subtitle: "Ancient resin traditions.",
    description: "Unraveling the sacred history and artisanal distillation of deep oriental treasures.",
    duration: "00:50",
    videoDuration: "00:50",
    category: "Stories",
    content: "Ambergris and agarwood hold centuries of mystique. Sourced from sustainable, ethically aged woods, these precious essences form the profound backbone of luxury perfumery.",
    image: "/images/events/blog1.jpg",
    author: "Eliyash Hossain",
    authorRole: "Master Blender",
    readTime: "5 min read"
  },
  {
    id: "8",
    slug: "why-concentrated-perfume-oils-last-longer",
    date: "04 JUN 2025",
    title: "Why Concentrated Perfume Oils Last Longer",
    subtitle: "The purity of oil formulations.",
    description: "The chemistry of oil versus alcohol sprays and how sillage projects on the skin.",
    duration: "01:05",
    videoDuration: "01:05",
    category: "Guides",
    content: "Commercial perfumes dilute fragrance oils with up to 80% denatured alcohol. In contrast, pure concentrated perfume oils fuse with natural body warmth, releasing layers gradually.",
    image: "/images/events/blog2.jpg",
    author: "Zaman Al-Hassan",
    authorRole: "Fragrance Architect",
    readTime: "5 min read"
  },
  {
    id: "9",
    slug: "blue-talisman-olfactory-review",
    date: "29 MAY 2025",
    title: "Blue Talisman: In-Depth Olfactory Review",
    subtitle: "A modern talisman of confidence.",
    description: "Exploring radiant bergamot, crisp ginger, and hypnotic modern woods in our iconic blend.",
    duration: "00:45",
    videoDuration: "00:45",
    category: "Reviews",
    content: "Blue Talisman opens with an electrifying burst of Italian bergamot and candied pear before settling into a warm cocoon of akigalawood and sensual ambroxan.",
    image: "/images/products/blue_talisman.jpg",
    author: "Sadid Admin",
    authorRole: "Editorial Director",
    readTime: "4 min read"
  },
  {
    id: "10",
    slug: "crafting-bespoke-bottles",
    date: "22 MAY 2025",
    title: "Crafting Bespoke Bottles: From Sketch to Glass",
    subtitle: "Form following olfactory art.",
    description: "The craftsmanship behind Murakkaz weighted caps, geometric glass, and gold embossing.",
    duration: "01:15",
    videoDuration: "01:15",
    category: "Behind the Scenes",
    content: "Each bespoke flacon undergoes multiple inspection checkpoints to ensure optical clarity, leak-proof precision collars, and balanced hand ergonomics.",
    image: "/images/events/blog3.jpg",
    author: "Eliyash Hossain",
    authorRole: "Master Blender",
    readTime: "6 min read"
  },
  {
    id: "11",
    slug: "the-art-of-olfactory-memory",
    date: "16 MAY 2025",
    title: "The Art of Olfactory Memory & Emotions",
    subtitle: "The limbic link between scent and memory.",
    description: "How scents trigger nostalgia and shape our most intimate personal connections.",
    duration: "00:55",
    videoDuration: "00:55",
    category: "Stories",
    content: "The human olfactory bulb is directly connected to the amygdala and hippocampus, making scent the most evocative sensory trigger for memory and nostalgia.",
    image: "/images/events/event_gallery_1.jpg",
    author: "Zaman Al-Hassan",
    authorRole: "Fragrance Architect",
    readTime: "4 min read"
  },
  {
    id: "12",
    slug: "the-rise-of-gourmand-fragrances",
    date: "09 MAY 2025",
    title: "The Rise of Gourmand Fragrances",
    subtitle: "Decadence redefined.",
    description: "Rich vanillas, roasted tonka bean, and praline notes redefining contemporary high perfumery.",
    duration: "01:10",
    videoDuration: "01:10",
    category: "Reviews",
    content: "Modern gourmands transcend sugary sweetness by balancing creamy Bourbon vanilla with smoky woods, dark cocoa, and bitter almond accords.",
    image: "/images/events/event_gallery_2.jpg",
    author: "Sadid Admin",
    authorRole: "Editorial Director",
    readTime: "4 min read"
  },
  {
    id: "13",
    slug: "distilling-rare-florals",
    date: "02 MAY 2025",
    title: "Distilling Rare Florals: Taif Rose & Jasmine",
    subtitle: "Dawn harvest traditions.",
    description: "Dawn harvesting in high-altitude valleys to capture volatile floral aromatics.",
    duration: "00:48",
    videoDuration: "00:48",
    category: "Behind the Scenes",
    content: "Taif roses must be plucked by hand before dawn breaks to prevent morning heat from evaporating the delicate, honeyed essential oils trapped within petal cells.",
    image: "/images/events/blog1.jpg",
    author: "Eliyash Hossain",
    authorRole: "Master Blender",
    readTime: "5 min read"
  },
  {
    id: "14",
    slug: "mastering-evening-fragrances",
    date: "25 APR 2025",
    title: "Mastering Evening & Formal Fragrances",
    subtitle: "Commanding evening presence.",
    description: "Choosing bold silhouettes that project elegance in cooler night air.",
    duration: "00:52",
    videoDuration: "00:52",
    category: "Guides",
    content: "Evening environments allow for deeper, more resinous perfumes with bold sillage. Learn how spices, incense, and leather notes project best in conditioned or night air.",
    image: "/images/events/blog2.jpg",
    author: "Zaman Al-Hassan",
    authorRole: "Fragrance Architect",
    readTime: "4 min read"
  },
  {
    id: "15",
    slug: "sultani-the-sovereign-scent",
    date: "18 APR 2025",
    title: "Sultani: The Sovereign Scent Profile",
    subtitle: "Opulence in a single drop.",
    description: "A detailed breakdown of smoky incense, rare ambergris, and aged Cambodian oud.",
    duration: "01:20",
    videoDuration: "01:20",
    category: "Reviews",
    content: "Sultani commands respect with its rich amber opening, transitioning to leathery Cambodian agarwood and a drydown that stays on clothes for multiple days.",
    image: "/images/events/blog3.jpg",
    author: "Sadid Admin",
    authorRole: "Editorial Director",
    readTime: "5 min read"
  },
  {
    id: "16",
    slug: "the-heritage-of-attar-craft",
    date: "11 APR 2025",
    title: "The Heritage of Attar Craftsmanship",
    subtitle: "Slow hydro-distillation.",
    description: "Centuries-old deg and bhapka hydro-distillation traditions preserved in modern luxury.",
    duration: "01:00",
    videoDuration: "01:00",
    category: "Stories",
    content: "Authentic attar distillation takes weeks of meticulous fire management, condensing raw botanicals directly into sandalwood oil without synthetic accelerants.",
    image: "/images/events/eliyas.jpg",
    author: "Eliyash Hossain",
    authorRole: "Master Blender",
    readTime: "6 min read"
  },
  {
    id: "legacy-1",
    slug: "art-of-concentrated-perfume-oils",
    date: "19 MAY 2026",
    title: "The Art of Concentrated Perfume Oils in Modern Luxury",
    subtitle: "Why pure oil concentrations outperform traditional alcohol sprays in projection and longevity.",
    description: "Discover why pure concentrated perfume oils (Attar & Extrait) provide a richer, skin-intimate scent trail without the harsh synthetic blast of commercial alcohol sprays.",
    duration: "01:00",
    videoDuration: "01:00",
    category: "Guides",
    content: "Concentrated perfume oils represent the purest, most historic form of fragrance. Unlike standard eau de parfum sprays that are diluted with 80% alcohol, pure perfume oils interact directly with your skin warmth to create a dynamic, lingering sillage that evolves smoothly over 12 to 18 hours.",
    image: "/images/events/blog1.jpg",
    author: "Eliyash Hossain",
    authorRole: "Master Blender",
    readTime: "5 min read"
  },
  {
    id: "legacy-2",
    slug: "mastering-scent-layering",
    date: "12 MAY 2026",
    title: "Mastering Scent Layering: How to Create Your Bespoke Signature",
    subtitle: "A practical guide to combining woody and citrus profiles for an unforgettable personal scent.",
    description: "Learn the secrets of bespoke fragrance pairing. Combine fresh top notes like bergamot with deep amber bases to design a unique identity that cannot be bought off a shelf.",
    duration: "00:45",
    videoDuration: "00:45",
    category: "Guides",
    content: "Fragrance layering is an ancient art made effortless with concentrated oils. Begin by applying your heavier base oil—such as oud, amber, or cedarwood—onto pulse points. Follow with a lighter citrus or floral aura to create a multi-dimensional fragrance signature.",
    image: "/images/events/blog2.jpg",
    author: "Zaman Al-Hassan",
    authorRole: "Fragrance Architect",
    readTime: "4 min read"
  },
  {
    id: "legacy-3",
    slug: "fragrance-care-storage",
    date: "28 APR 2026",
    title: "Preserving Precious Notes: The Golden Rules of Fragrance Storage",
    subtitle: "How heat, humidity, and sunlight degrade perfume molecules, and how to keep them pristine.",
    description: "High-grade perfume compositions contain delicate natural essences. Discover how to protect your collection from degradation and ensure every drop remains as vibrant as day one.",
    duration: "00:45",
    videoDuration: "00:45",
    category: "Guides",
    content: "Sunlight and fluctuating temperatures are the primary enemies of fine fragrance molecules. To preserve the vibrancy of delicate top notes and the warmth of base accords, store your bottles in cool, dark environments away from bathroom moisture.",
    image: "/images/events/blog3.jpg",
    author: "Sadid Admin",
    authorRole: "Editorial Director",
    readTime: "3 min read"
  }
];
