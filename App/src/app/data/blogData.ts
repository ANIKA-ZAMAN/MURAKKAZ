export interface BlogPost {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  content: string[];
  author: string;
  authorRole: string;
  authorAvatar: string;
  readTime: string;
  category: string;
  image: string;
  quote?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    date: "18th May, 2026",
    title: "The Art of Slow Living & Minimalist Design",
    subtitle: "Finding stillness and luxury in purposeful simplicity.",
    description: "In a fast-paced world, designing spaces and routines around intentionality brings clarity. We explore how minimalist design and heritage elements combine to create serene, thoughtful environments.",
    author: "Anika Zaman",
    authorRole: "Creative Director",
    authorAvatar: "/images/events/sadid.jpg",
    readTime: "5 min read",
    category: "Design Philosophy",
    image: "/images/events/sadid.jpg",
    quote: "True luxury is not about abundance—it is about the refinement of what remains.",
    content: [
      "In a fast-paced world dominated by sensory overload, the concept of slow living has transformed from a niche lifestyle trend into a fundamental design philosophy. Slow living invites us to slow down, curate our surroundings with intention, and appreciate the intrinsic beauty of well-crafted objects.",
      "When we pare back the superfluous, every single element in a room must justify its existence through function, form, or emotional resonance. In interior design and personal aesthetics, minimalism is not about empty white rooms; it is about creating breathing room for meaningful experiences.",
      "Heritage elements play a vital role in grounding minimalist spaces. An antique wooden chest, a hand-poured artisan fragrance bottle, or a woven linen drape brings warmth and tactile richness that prevents clean lines from feeling clinical.",
      "At Murakkaz, we apply these principles to fragrance design. A signature scent should not overwhelm the room—it should serve as an invisible architecture, subtly framing your presence and bringing a sense of grounded tranquility to your daily rituals."
    ]
  },
  {
    id: "post-2",
    date: "16th May, 2026",
    title: "Creation & The Value of Heritage Craftsmanship",
    subtitle: "Honoring centuries of mastery through modern articulation.",
    description: "Craftsmanship is the preservation of time and skill. By focusing on handmade details and local materials, we honor the legacy of creators who define premium design.",
    author: "Sadid Ahmed",
    authorRole: "Master Artisan",
    authorAvatar: "/images/events/sadid.jpg",
    readTime: "6 min read",
    category: "Craftsmanship",
    image: "/images/events/sadid.jpg",
    quote: "Every hand-carved detail carries the heartbeat of the maker who refusal to compromise.",
    content: [
      "Craftsmanship is ultimately the art of honoring time. In an era where mass production prioritizes speed and cost efficiency, true luxury stands apart by embracing the patient dedication required to craft something extraordinary.",
      "The value of heritage craftsmanship lies in the subtle imperfections and human touch that no machine can replicate. From hand-selected raw botanicals in perfumery to hand-blown glass flagons, the relationship between maker and material is intimate and respectful.",
      "By preserving traditional techniques passed down through generations, master artisans ensure that cultural storytelling remains vibrant. Each creation becomes a living archive of skill, patience, and unyielding passion.",
      "When you choose handcrafted creations, you are not merely purchasing an object—you are participating in a narrative of devotion and timeless quality."
    ]
  },
  {
    id: "post-3",
    date: "15th May, 2026",
    title: "Aesthetic Harmony in Modern Living Spaces",
    subtitle: "Balancing texture, light, and fragrance for serene living.",
    description: "Aesthetically rich spaces require a careful balance of textures, lighting, and placement. Discover the key principles of creating layouts that inspire and soothe the mind.",
    author: "Anika Zaman",
    authorRole: "Creative Director",
    authorAvatar: "/images/events/sadid.jpg",
    readTime: "4 min read",
    category: "Atmosphere",
    image: "/images/events/sadid.jpg",
    quote: "Atmosphere is an orchestral composition of sight, touch, and subtle scent.",
    content: [
      "Creating aesthetic harmony in modern living environments requires thinking beyond visual appeal alone. A truly harmonious space engages all five senses, seamlessly blending light, texture, proportion, and olfactive ambiance.",
      "Natural lighting acts as the primary sculptor of interior moods. Soft morning sunlight filtering through sheer linen creates an entirely different emotional state than warm ambient lamps glowing against polished wood in the evening.",
      "Texture provides depth where color remains understated. Combining raw stone, brushed brass, matte ceramics, and rich velvet creates tactile intrigue that invites touch and exploration.",
      "Finally, scent completes the spatial composition. A ambient fragrance infused with warm sandalwood, bergamot, or fresh sage ties visual elements together, creating an unforgettable sensory sanctuary."
    ]
  },
  {
    id: "post-4",
    date: "18th May, 2026",
    title: "The Olfactive Journey: Notes, Accords & Memory",
    subtitle: "How scent activates deep memory and emotional resonance.",
    description: "Fragrance is the most powerful sensory key to human memory. Learn how perfumers construct top, heart, and base notes to evoke distant horizons and cherished moments.",
    author: "Sadid Ahmed",
    authorRole: "Nose & Perfumer",
    authorAvatar: "/images/events/sadid.jpg",
    readTime: "7 min read",
    category: "Fragrance Science",
    image: "/images/events/sadid.jpg",
    quote: "A single whiff can transport you across decades in a fraction of a second.",
    content: [
      "The olfactory system is directly wired to the limbic system—the brain's emotional and memory center. This unique biological link explains why a fragrance can instantly evoke vivid memories and deep emotions far more powerfully than sight or sound.",
      "Perfumery is the art of orchestrating volatile molecules into a harmonious time-release sequence. Top notes provide the initial sparkling impression, heart notes define the fragrance's core identity, and base notes anchor the composition on your skin for hours.",
      "Building a signature fragrance accord is akin to composing music. Individual notes must balance each other, creating resonance rather than dissonance.",
      "Understanding your personal fragrance profile allows you to select scents that align with your mood, occasion, and self-expression."
    ]
  },
  {
    id: "post-5",
    date: "16th May, 2026",
    title: "Sustainably Sourced Botanicals & Ethical Luxury",
    subtitle: "Protecting rare flora and honoring local harvesting communities.",
    description: "True luxury respects the earth. Explore how Murakkaz sources pure essential oils and rare woods while protecting ecosystems and supporting local farmers.",
    author: "Anika Zaman",
    authorRole: "Creative Director",
    authorAvatar: "/images/events/sadid.jpg",
    readTime: "5 min read",
    category: "Sustainability",
    image: "/images/events/sadid.jpg",
    quote: "Exclusivity should never come at the expense of ecological stewardship.",
    content: [
      "As discerning collectors seek greater authenticity, the luxury landscape is undergoing a profound evolution toward ethical transparency and environmental responsibility.",
      "From rare Indian Tuberose to sustainably harvested Cedarwood, every natural botanical carries a footprint. Ethical luxury ensures that harvesting methods preserve wild populations and support fair economic partnerships with indigenous farming communities.",
      "At Murakkaz, sustainability is integral to our formulation standard. We prioritize renewable botanical extractions and eco-conscious packaging while maintaining uncompromising aesthetic elegance.",
      "By honoring nature's rhythms, we ensure that future generations can continue to experience the rare olfactive treasures of our world."
    ]
  },
  {
    id: "post-6",
    date: "15th May, 2026",
    title: "Curating a Personal Fragrance Wardrobe",
    subtitle: "Selecting versatile scents for every season and mood.",
    description: "Just as a tailored wardrobe serves different occasions, a thoughtfully curated scent collection matches your daily transitions from professional daytime focus to evening sophistication.",
    author: "Sadid Ahmed",
    authorRole: "Style Specialist",
    authorAvatar: "/images/events/sadid.jpg",
    readTime: "5 min read",
    category: "Lifestyle",
    image: "/images/events/sadid.jpg",
    quote: "Your fragrance wardrobe is an invisible extension of your personal style.",
    content: [
      "Relying on a single signature scent year-round can limit your self-expression. Building a personal fragrance wardrobe allows you to tailor your scent to seasons, weather, time of day, and emotional mindset.",
      "For crisp mornings and professional environments, fresh citrus, aquatic, and green accords promote clarity and understated confidence. For evening occasions and cold winter months, amber, rich spices, and rare woods evoke warmth and intriguing depth.",
      "Layering complementary scents is an advanced technique that allows you to craft a custom scent identity entirely unique to you.",
      "Explore our Scent Index consultation to discover the core pillars of your personal fragrance wardrobe."
    ]
  }
];
