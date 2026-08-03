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
    description: "Summers in Bangladesh are notoriously brutal, combining high heat with extreme humidity. Discover how high-concentration extraits de parfum featuring sparkling bergamot, fresh vetiver, and cooling mint survive all-day wear without fading.",
    content: [
      "Summers in Bangladesh are notoriously brutal, combining high heat with extreme humidity. This combination accelerates evaporation, causing standard fresh fragrances to completely disappear within an hour.",
      "To combat intense humidity, opt for Extraits de Parfum formulated with heavy essential oil ratios (25% to 35% concentration). High-concentration fresh fragrances built around Haitian vetiver, Calabrian bergamot, and crisp sea salt spray create an impenetrable bubble of clean aura.",
      "Top recommended summer extraits include Jade Serenity and Coral Sea Extrait, engineered specifically to stay vibrant and sharp through sweltering afternoons."
    ],
    image: "/images/events/blog1.jpg",
    author: "Eliyash Hossain",
    category: "Fragrance Guide",
    readTime: "4 min read"
  },
  {
    id: "how-to-choose-perfume-edp-edt",
    slug: "how-to-choose-perfume-edp-edt",
    date: "18th May, 2026",
    title: "How to Choose a Perfume & The Difference Between EDP and EDT",
    subtitle: "Demystifying essential oil concentrations, projection radius, and skin chemistry.",
    description: "Choosing the right scent comes down to understanding concentration levels and matching them to your daily environment.",
    content: [
      "Choosing the right scent comes down to understanding concentration levels and matching them to your daily environment.",
      "Eau de Toilette (EDT) typically contains 5% to 15% fragrance oil, making it light and airy for short daytime wear. Eau de Parfum (EDP) bumps concentration to 15-20%, giving 6-8 hours of noticeable sillage.",
      "For true beast-mode longevity (12+ to 16+ hours), Extrait de Parfum reigns supreme with 25-35% pure essential oil content. It lays closer to the skin initially, blooming with body heat to create an alluring, long-lasting aura."
    ],
    image: "/images/events/blog2.jpg",
    author: "Eliyash Hossain",
    category: "Science of Scent",
    readTime: "5 min read"
  },
  {
    id: "master-guide-fragrance-layering",
    slug: "master-guide-fragrance-layering",
    date: "15th May, 2026",
    title: "The Master Guide to Fragrance Layering",
    subtitle: "Craft a bespoke, unrepeatable olfactory signature that belongs entirely to you.",
    description: "Fragrance layering is the ultimate insider trick to ensure you never smell like anyone else in the room. It involves combining two distinct perfumes to create a custom, signature scent trail.",
    content: [
      "Fragrance layering is the ultimate insider trick to ensure you never smell like anyone else in the room. It involves combining two distinct perfumes to create a custom, signature scent trail.",
      "Start by applying a heavier, base-rich perfume first (such as a warm woody amber or rich vanilla). Let it settle onto pulse points for 60 seconds. Then layer a lighter, top-note dominant scent (like crisp bergamot or sparkling jasmine) over the top.",
      "The contrast between deep resinous bases and bright fresh top notes produces a multi-dimensional fragrance signature that evolves uniquely on your skin."
    ],
    image: "/images/events/blog3.jpg",
    author: "Eliyash Hossain",
    category: "Artisanal Craft",
    readTime: "6 min read"
  },
  {
    id: "chemistry-of-longevity-beast-mode",
    slug: "chemistry-of-longevity-beast-mode",
    date: "12th May, 2026",
    title: "The Chemistry of Longevity: Why Some Scents Last 14+ Hours",
    subtitle: "From heavy molecular weights to maceration—the secrets behind beast-mode performance.",
    description: "Ever wondered why some fresh citrus scents fade within two hours while dark rose and oud extraits cling to your jacket for days? We examine how base-note molecular weights and small-batch aging dictate true lasting power.",
    content: [
      "Ever wondered why some fresh citrus scents fade within two hours while dark rose and oud extraits cling to your jacket for days?",
      "The answer lies in molecular weight and evaporation rates. Volatile citrus molecules like limonene evaporate quickly, whereas heavy aromatic resins like agarwood, patchouli, and synthetic ambergris possess large molecular structures that anchor to skin and fabric for days.",
      "Furthermore, proper batch maceration—allowing blended fragrance oils to mature in dark, temperature-controlled glass vessels for several weeks—ensures seamless harmony and maximum sillage."
    ],
    image: "/images/events/blog1.jpg",
    author: "Eliyash Hossain",
    category: "Science of Scent",
    readTime: "5 min read"
  },
  {
    id: "connoisseurs-guide-rare-oud-ambergris",
    slug: "connoisseurs-guide-rare-oud-ambergris",
    date: "08th May, 2026",
    title: "A Connoisseur's Guide to Rare Oud & Royal Ambergris",
    subtitle: "Unlocking the history and artistry of perfumery's most prized raw materials.",
    description: "Oud and ambergris have fascinated kings and master perfumers for centuries. Uncover how authentic Cambodian agarwood and ocean-cured ambergris provide rich depth, velvety warmth, and incomparable sillage.",
    content: [
      "Oud and ambergris have fascinated kings and master perfumers for centuries.",
      "Authentic oud oil, extracted from resinous Aquilaria heartwood, imparts a smoky, woody, and animalic warmth unlike any other aromatic ingredient on earth.",
      "When paired with precious ambergris and Turkish rose, it creates opulent Extraits de Parfum that exude luxury, authority, and timeless elegance."
    ],
    image: "/images/events/eliyas.jpg",
    author: "Eliyash Hossain",
    category: "Olfactory Journal",
    readTime: "7 min read"
  },
  {
    id: "signature-scents-date-nights-formal-affairs",
    slug: "signature-scents-date-nights-formal-affairs",
    date: "04th May, 2026",
    title: "Signature Scents for Date Nights & Formal Affairs",
    subtitle: "Intoxicating gourmands and seductive accords engineered to leave a lasting impression.",
    description: "When the sun sets and evening occasions demand quiet confidence, a well-chosen evening fragrance commands the room. Discover our curated selection of warm cinnamon, rich cognac, and creamy cashmere accords.",
    content: [
      "When the sun sets and evening occasions demand quiet confidence, a well-chosen evening fragrance commands the room.",
      "Gourmand profiles featuring warm cinnamon, sweet tonka bean, aged cognac barrels, and velvety vanilla project an inviting, sensual warmth that draws people in.",
      "Fragrances like Murakkaz Noir and Baccarat Rouge 540 offer high-impact sillage tailored for black-tie galas, romantic dinners, and private celebrations."
    ],
    image: "/images/events/blog2.jpg",
    author: "Eliyash Hossain",
    category: "Fragrance Guide",
    readTime: "4 min read"
  }
];
