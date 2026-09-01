"use client";

import * as React from "react";
import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "../../components/ProductCard";
import FragranceNotes from "../../components/FragranceNotes";
import { productsCatalog, slugify, getNoteImage, getProductsApiBaseUrl } from "../../data/products";
import styles from "./page.module.css";

// Dynamic database mapping for premium details page content
const productsDetailMap: Record<string, {
  name: string;
  inspiredBy: string;
  badge?: string;
  description: string;
  image: string;
  family: string;
  galleryImages: string[];
  topNotes: Array<{ name: string; image: string }>;
  middleNotes: Array<{ name: string; image: string }>;
  baseNotes: Array<{ name: string; image: string }>;
  accords: Array<{ name: string; pct: number; color: string; path: string }>;
  bestFor: Array<{ name: string; pct: number }>;
  ourTake: string;
}> = {
  "jade-serenity": {
    name: "Jade Serenity",
    inspiredBy: "Inspired by Creed Original Vetiver",
    badge: undefined,
    description: "Jade Serenity is a masterclass in clean, sophisticated freshness engineered explicitly to conquer hot and humid weather. Opening with a crisp, rejuvenating burst of green tea and sharp citrus, it effortlessly settles into a calming, earthy base of rich vetiver and smooth cedarwood. This isn't just a fragrance—it's an invisible suit of armor that keeps you feeling fresh, composed, and undeniably premium from morning meetings to late-night lounge sessions.",
    image: "/images/products/jade_serenity.png",
    family: "Citrus",
    galleryImages: [
      "/images/products/jade_serenity.png",
      "/images/products/amber_gold.png",
      "/images/products/velvet_oud.png",
    ],
    topNotes: [
      { name: "Osmanthus", image: "osmanthus.png" },
      { name: "Peach", image: "peach.png" },
      { name: "Neroli", image: "neroli.png" },
      { name: "Bergamot", image: "bergamot.png" },
      { name: "Mandarin", image: "mandarin.png" },
      { name: "Cinnamon", image: "cinnamon.png" },
    ],
    middleNotes: [
      { name: "Indian Tuberose", image: "indian_tuberose.png" },
      { name: "Jasmine", image: "jasmine.png" },
      { name: "Narcissus", image: "narcissus.png" },
      { name: "May Rose", image: "may_rose.png" },
    ],
    baseNotes: [
      { name: "Amber", image: "amber.png" },
      { name: "Cedar", image: "cedar.png" },
      { name: "Sandalwood", image: "sandalwood.png" },
      { name: "Patchouli", image: "patchouli.png" },
      { name: "Vetiver", image: "vetiver.png" },
    ],
    accords: [
      { name: "Citrus", pct: 100, color: "#e2cc9e", path: "M12 12c2.5-4 5.5-5 7-3s0 5-3 7L12 12z" },
      { name: "Fresh", pct: 80, color: "#b9cad7", path: "M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" },
      { name: "Green", pct: 60, color: "#8fb39c", path: "M3 10c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z" },
      { name: "Aromatic", pct: 40, color: "#a28c73", path: "M4 18L18 4" },
    ],
    bestFor: [
      { name: "Summer & Spring", pct: 90 },
      { name: "Winter & Autumn", pct: 40 },
      { name: "Daytime Wear", pct: 80 },
      { name: "Nightly Occasions", pct: 50 },
    ],
    ourTake: "An ultra-clean summer workhorse. Rejuvenating and sharp green-citrus freshness that outlasts typical fresh perfumes."
  },
  "coral-sea": {
    name: "Coral Sea",
    inspiredBy: "Inspired by Jo Malone Wood Sage & Sea Salt",
    badge: undefined,
    description: "Coral Sea transports you to windswept coastal shores. A mineral, fresh scent blending sea salt spray, earthy wood sage, and a light grapefruit undertone. Perfect for daily wear, it feels airy, natural, and refreshingly clean, evoking the spirit of freedom and raw nature.",
    image: "/images/products/coral_sea.png",
    family: "Fresh",
    galleryImages: [
      "/images/products/coral_sea.png",
      "/images/products/jade_serenity.png",
      "/images/products/magnetism.png",
    ],
    topNotes: [
      { name: "Bergamot", image: "bergamot.png" },
      { name: "Mandarin", image: "mandarin.png" },
    ],
    middleNotes: [
      { name: "Peach", image: "peach.png" },
      { name: "Neroli", image: "neroli.png" },
    ],
    baseNotes: [
      { name: "Cedar", image: "cedar.png" },
      { name: "Sandalwood", image: "sandalwood.png" },
      { name: "Amber", image: "amber.png" },
    ],
    accords: [
      { name: "Marine", pct: 100, color: "#b9cad7", path: "M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" },
      { name: "Salty", pct: 85, color: "#e2e2e5", path: "M3 10c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z" },
      { name: "Aromatic", pct: 70, color: "#a28c73", path: "M4 18L18 4" },
      { name: "Woody", pct: 55, color: "#8a735c", path: "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" },
    ],
    bestFor: [
      { name: "Summer & Spring", pct: 85 },
      { name: "Winter & Autumn", pct: 45 },
      { name: "Daytime Wear", pct: 90 },
      { name: "Nightly Occasions", pct: 40 },
    ],
    ourTake: "The perfect casual signature. Mineral, salty, and wonderfully breezy—highly versatile for any office or daytime setting."
  },
  "murakkaz-noir": {
    name: "Murakkaz Noir",
    inspiredBy: "Inspired by Dior Sauvage Elixir",
    badge: undefined,
    description: "Murakkaz Noir is an intense, concentrated fragrance for the bold and sophisticated. Opening with sweet cardamoms, hot cinnamon, and fiery spices, it transitions smoothly into a calming lavender heart and a deep base of dark cedar, patchouli, and licorice. A true masterpiece of projection and longevity.",
    image: "/images/products/magnetism.png",
    family: "Woody",
    galleryImages: [
      "/images/products/magnetism.png",
      "/images/products/hellenist.png",
      "/images/products/velvet_oud.png",
    ],
    topNotes: [
      { name: "Cinnamon", image: "cinnamon.png" },
      { name: "Bergamot", image: "bergamot.png" },
      { name: "Mandarin", image: "mandarin.png" },
    ],
    middleNotes: [
      { name: "Neroli", image: "neroli.png" },
      { name: "May Rose", image: "may_rose.png" },
    ],
    baseNotes: [
      { name: "Sandalwood", image: "sandalwood.png" },
      { name: "Vetiver", image: "vetiver.png" },
      { name: "Amber", image: "amber.png" },
      { name: "Patchouli", image: "patchouli.png" },
      { name: "Cedar", image: "cedar.png" },
    ],
    accords: [
      { name: "Warm Spicy", pct: 100, color: "#e89f65", path: "M4 18L18 4" },
      { name: "Woody", pct: 90, color: "#a28c73", path: "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" },
      { name: "Aromatic", pct: 80, color: "#b9cad7", path: "M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" },
      { name: "Lavender", pct: 60, color: "#b8a3e0", path: "M3 10c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z" },
    ],
    bestFor: [
      { name: "Winter & Autumn", pct: 95 },
      { name: "Summer & Spring", pct: 50 },
      { name: "Daytime Wear", pct: 40 },
      { name: "Nightly Occasions", pct: 85 },
    ],
    ourTake: "A powerhouse elixir dupe. Dark, rich, and commanding with beast-mode performance that draws attention instantly."
  },
  "hellenist": {
    name: "Hellenist",
    inspiredBy: "Inspired by Baccarat Rouge 540",
    badge: "Exclusive",
    description: "Hellenist is an exquisite, glowing amber floral fragrance that lays on the skin like a warm, sugary breeze. Precious saffron and sweet jasmine notes fuse with rich, warm ambergris and freshly cut cedarwood to create a poetic, highly addictive fragrance signature.",
    image: "/images/products/hellenist.png",
    family: "Oriental",
    galleryImages: [
      "/images/products/hellenist.png",
      "/images/products/magnetism.png",
      "/images/products/amber_gold.png",
    ],
    topNotes: [
      { name: "Jasmine", image: "jasmine.png" },
      { name: "Mandarin", image: "mandarin.png" },
    ],
    middleNotes: [
      { name: "Neroli", image: "neroli.png" },
      { name: "May Rose", image: "may_rose.png" },
    ],
    baseNotes: [
      { name: "Cedar", image: "cedar.png" },
      { name: "Amber", image: "amber.png" },
    ],
    accords: [
      { name: "Amber", pct: 100, color: "#e2cc9e", path: "M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" },
      { name: "Woody", pct: 80, color: "#a28c73", path: "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" },
      { name: "Warm Spicy", pct: 65, color: "#e89f65", path: "M4 18L18 4" },
      { name: "Floral", pct: 50, color: "#e2e2e5", path: "M3 10c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z" },
    ],
    bestFor: [
      { name: "Winter & Autumn", pct: 85 },
      { name: "Summer & Spring", pct: 60 },
      { name: "Daytime Wear", pct: 50 },
      { name: "Nightly Occasions", pct: 90 },
    ],
    ourTake: "Stunningly sweet amber profile. Highly projecting and elegant, ideal for special occasions and luxury events."
  }
};

function ProductDetailsContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromQuiz = searchParams.get("from") === "quiz";
  const { id } = React.use(params);
  const [countdown, setCountdown] = useState(9026); // 2 hours, 30 minutes, 26 seconds
  const [isMounted, setIsMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("performance");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  const [liveProduct, setLiveProduct] = useState<any>(null);

  // Dynamic targeting logic based on URL route ID or SLUG
  const catalogItem = React.useMemo(() => {
    if (!id) return null;
    const cleanId = id.toLowerCase().trim();
    return productsCatalog.find(
      (p) =>
        (p.slug && p.slug.toLowerCase() === cleanId) ||
        p.id.toLowerCase() === cleanId ||
        p.name.toLowerCase() === cleanId ||
        slugify(p.name) === cleanId ||
        p.name.toLowerCase().replace(/\s+/g, "-") === cleanId ||
        cleanId.includes(p.id.toLowerCase()) ||
        p.id.toLowerCase().includes(cleanId)
    );
  }, [id]);

  const EXCLUSIVE_SLUGS = React.useMemo(() => new Set([
    "irish-leather", "baccarat-rouge-540", "tobacco-vanille", "by-the-fireplace",
    "resala", "sultani", "guidance", "rosewood", "sakura-dior", "imagination",
    "prod-irish-leather-01", "prod-baccarat-rouge-540-02", "prod-tobacco-vanille-03",
    "prod-by-the-fireplace-04", "prod-resala-05", "prod-sultani-06", "prod-guidance-07",
    "prod-rosewood-08", "prod-sakura-dior-09", "prod-imagination-10"
  ]), []);

  const isExclusive = React.useMemo(() => {
    if (catalogItem && catalogItem.category) {
      return catalogItem.category.toLowerCase() === "exclusive";
    }
    if (liveProduct && liveProduct.category) {
      return liveProduct.category.toLowerCase() === "exclusive";
    }
    const cleanId = id ? id.toLowerCase().trim() : "";
    return EXCLUSIVE_SLUGS.has(cleanId);
  }, [catalogItem, liveProduct, id, EXCLUSIVE_SLUGS]);

  const sizeOptions = React.useMemo(() => {
    const sizeOrder = ["6ml", "10ml", "30ml", "50ml"];
    // 1. Check liveProduct from DB
    if (liveProduct && liveProduct.sizes && Array.isArray(liveProduct.sizes) && liveProduct.sizes.length > 0) {
      const mapped = liveProduct.sizes.map((s: any) => ({
        label: s.size || `${s.volume}ml`,
        price: Number(s.price),
        originalPrice: s.originalPrice ? Number(s.originalPrice) : undefined
      }));
      return mapped.sort((a: any, b: any) => sizeOrder.indexOf(a.label) - sizeOrder.indexOf(b.label));
    }
    // 2. Check catalogItem from local catalog
    if (catalogItem && catalogItem.sizes && Array.isArray(catalogItem.sizes) && catalogItem.sizes.length > 0) {
      const mapped = catalogItem.sizes.map((s: any) => ({
        label: s.size || `${s.volume}ml`,
        price: Number(s.price),
        originalPrice: s.originalPrice ? Number(s.originalPrice) : undefined
      }));
      return mapped.sort((a: any, b: any) => sizeOrder.indexOf(a.label) - sizeOrder.indexOf(b.label));
    }
    // 3. Fallback based on category
    if (isExclusive) {
      return [
        { label: "6ml", price: 300, originalPrice: 400 },
        { label: "10ml", price: 500, originalPrice: 650 },
        { label: "30ml", price: 1500, originalPrice: 1900 },
        { label: "50ml", price: 2500, originalPrice: 3200 },
      ];
    }
    return [
      { label: "6ml", price: 300, originalPrice: 400 },
      { label: "10ml", price: 500, originalPrice: 650 },
      { label: "30ml", price: 900, originalPrice: 1100 },
      { label: "50ml", price: 1500, originalPrice: 1900 },
    ];
  }, [liveProduct, catalogItem, isExclusive]);

  const [selectedSizeOpt, setSelectedSizeOpt] = useState<{ label: string; price: number }>(() => {
    return sizeOptions.find((s: any) => s.label === "10ml") || sizeOptions[1] || sizeOptions[0];
  });

  useEffect(() => {
    setSelectedSizeOpt((prev) => {
      if (prev && prev.label) {
        const matching = sizeOptions.find((s: any) => s.label === prev.label);
        if (matching) return matching;
      }
      return sizeOptions.find((s: any) => s.label === "10ml") || sizeOptions[1] || sizeOptions[0];
    });
  }, [sizeOptions]);

  // Dynamic API fetch for custom products created via Admin
  useEffect(() => {
    if (!id) return;
    const apiBase = getProductsApiBaseUrl();
    fetch(`${apiBase}/products/${id}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.data) {
          const p = json.data;
          setLiveProduct({
            name: p.name || 'Unnamed Fragrance',
            inspiredBy: p.inspiredBy ? `Inspired by ${p.inspiredBy}` : `Inspired by ${p.brand || 'Murakkaz'}`,
            badge: (p.category === 'Exclusive' || p.category === 'exclusive' || isExclusive) ? "EXCLUSIVE" : undefined,
            description: p.description || `${p.name} by ${p.brand || 'Murakkaz'}. High concentration artisanal fragrance engineered for luxury projection and long-lasting sillage.`,
            image: p.image || '/images/products/jade_serenity.png',
            family: p.family || 'Woody',
            galleryImages: p.galleryImages && p.galleryImages.length > 0 
              ? p.galleryImages.map((g: any) => g.url) 
              : [p.image || '/images/products/jade_serenity.png'],
            topNotes: (() => {
              const top = p.notes?.filter((n: any) => n.type === 'TOP').map((n: any) => ({ name: typeof n === 'string' ? n : n.name, image: getNoteImage(typeof n === 'string' ? n : n.name) })) || [];
              if (top.length > 0) return top;
              if (Array.isArray(p.notes) && p.notes.length > 0) {
                const names = p.notes.map((n: any) => typeof n === 'string' ? n : n.name);
                const oneThird = Math.max(1, Math.floor(names.length / 3));
                return names.slice(0, oneThird).map((n: string) => ({ name: n, image: getNoteImage(n) }));
              }
              return [{ name: "Bergamot", image: "bergamot.png" }];
            })(),
            middleNotes: (() => {
              const mid = p.notes?.filter((n: any) => n.type === 'MIDDLE').map((n: any) => ({ name: typeof n === 'string' ? n : n.name, image: getNoteImage(typeof n === 'string' ? n : n.name) })) || [];
              if (mid.length > 0) return mid;
              if (Array.isArray(p.notes) && p.notes.length > 0) {
                const names = p.notes.map((n: any) => typeof n === 'string' ? n : n.name);
                const oneThird = Math.max(1, Math.floor(names.length / 3));
                return names.slice(oneThird, oneThird * 2).map((n: string) => ({ name: n, image: getNoteImage(n) }));
              }
              return [{ name: "Jasmine", image: "jasmine.png" }];
            })(),
            baseNotes: (() => {
              const base = p.notes?.filter((n: any) => n.type === 'BASE').map((n: any) => ({ name: typeof n === 'string' ? n : n.name, image: getNoteImage(typeof n === 'string' ? n : n.name) })) || [];
              if (base.length > 0) return base;
              if (Array.isArray(p.notes) && p.notes.length > 0) {
                const names = p.notes.map((n: any) => typeof n === 'string' ? n : n.name);
                const oneThird = Math.max(1, Math.floor(names.length / 3));
                return names.slice(oneThird * 2).map((n: string) => ({ name: n, image: getNoteImage(n) }));
              }
              return [{ name: "Amber", image: "amber.png" }];
            })(),
            accords: p.accords && p.accords.length > 0 
              ? p.accords.map((a: any) => ({ name: a.name, pct: a.percentage, color: a.color || '#C5A880', path: 'M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z' }))
              : [{ name: "Woody", pct: 80, color: "#C5A880", path: "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" }],
            bestFor: p.bestFor && p.bestFor.length > 0
              ? p.bestFor.map((b: any) => ({ name: b.name, pct: b.percentage }))
              : [{ name: "Spring", pct: 70 }, { name: "Summer", pct: 40 }, { name: "Autumn", pct: 85 }, { name: "Winter", pct: 95 }],
            ourTake: p.ourTake || p.description || 'An extraordinary fragrance formulation crafted by Murakkaz.'
          });
        }
      })
      .catch(() => {});
  }, [id]);

  const targetKey = React.useMemo(() => {
    if (!id) return "jade-serenity";
    const idClean = id.toLowerCase();
    
    // Exact match or contains search
    if (idClean === "1" || idClean === "jade-serenity" || idClean.includes("jade")) {
      return "jade-serenity";
    }
    if (idClean === "2" || idClean === "coral-sea" || idClean.includes("coral")) {
      return "coral-sea";
    }
    if (idClean === "3" || idClean === "magnetism" || idClean === "murakkaz-noir" || idClean.includes("noir") || idClean.includes("magnet")) {
      return "murakkaz-noir";
    }
    if (idClean === "4" || idClean === "hellenist" || idClean.includes("hellenist")) {
      return "hellenist";
    }
    return "jade-serenity";
  }, [id]);

  const details = React.useMemo(() => {
    // 1. If catalog item exists in master luxury catalog:
    if (catalogItem) {
      const topRaw = (catalogItem.notes || []).filter((n: any) => typeof n === "object" && n?.type === "TOP").map((n: any) => n.name);
      const midRaw = (catalogItem.notes || []).filter((n: any) => typeof n === "object" && n?.type === "MIDDLE").map((n: any) => n.name);
      const baseRaw = (catalogItem.notes || []).filter((n: any) => typeof n === "object" && n?.type === "BASE").map((n: any) => n.name);

      const allNames: string[] = (catalogItem.notes || []).map((n: any) => (typeof n === "string" ? n : n?.name || "")).filter(Boolean);
      const fallbackNames = allNames.length > 0 ? allNames : ["Bergamot", "Jasmine", "Amber"];
      const oneThird = Math.max(1, Math.floor(fallbackNames.length / 3));

      const topNotes = (topRaw.length > 0 ? topRaw : fallbackNames.slice(0, oneThird)).map((n: string) => ({ name: n, image: getNoteImage(n) }));
      const middleNotes = (midRaw.length > 0 ? midRaw : fallbackNames.slice(oneThird, oneThird * 2)).map((n: string) => ({ name: n, image: getNoteImage(n) }));
      const baseNotes = (baseRaw.length > 0 ? baseRaw : fallbackNames.slice(oneThird * 2)).map((n: string) => ({ name: n, image: getNoteImage(n) }));

      const accords = (catalogItem.accords && catalogItem.accords.length > 0)
        ? catalogItem.accords.map((a: any) => ({
            name: a.name,
            pct: a.percentage || a.pct || 80,
            color: a.color || "#e2cc9e",
            path: a.path || "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z"
          }))
        : [
            { name: catalogItem.family || "Woody", pct: 90, color: "#e2cc9e", path: "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" },
            { name: "Aromatic", pct: 75, color: "#b9cad7", path: "M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" },
            { name: "Spicy", pct: 60, color: "#e89f65", path: "M4 18L18 4" }
          ];

      const bestFor = (catalogItem.bestFor && catalogItem.bestFor.length > 0)
        ? catalogItem.bestFor.map((b: any) => ({
            name: b.name,
            pct: b.percentage || b.pct || 80
          }))
        : [
            { name: "Spring & Summer", pct: 80 },
            { name: "Autumn & Winter", pct: 85 },
            { name: "Daytime Wear", pct: 75 },
            { name: "Nightly Occasions", pct: 90 }
          ];

      return {
        name: catalogItem.name,
        inspiredBy: catalogItem.inspiredBy ? `Inspired by ${catalogItem.inspiredBy}` : (catalogItem.brand ? `Inspired by ${catalogItem.brand}` : ""),
        badge: isExclusive ? "EXCLUSIVE" : undefined,
        description: catalogItem.description || `${catalogItem.name} by ${catalogItem.brand}. High concentration artisanal fragrance engineered for luxury projection and long-lasting sillage.`,
        image: catalogItem.image,
        family: catalogItem.family || "Woody",
        galleryImages: [catalogItem.image],
        topNotes,
        middleNotes,
        baseNotes,
        accords,
        bestFor,
        ourTake: catalogItem.ourTake || catalogItem.description || `${catalogItem.name} is a captivating fragrance formulation.`
      };
    }

    // 2. If it's a dynamic product created via admin dashboard (liveProduct):
    if (liveProduct) {
      return liveProduct;
    }

    // 3. Fallback to signature products detail map
    if (productsDetailMap[id]) return productsDetailMap[id];
    if (productsDetailMap[targetKey]) return productsDetailMap[targetKey];
    
    return productsDetailMap["jade-serenity"];
  }, [liveProduct, targetKey, id, catalogItem]);

  // Reset indices on product change
  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    setSelectedSizeOpt(sizeOptions[1] || sizeOptions[0]);
  }, [targetKey, sizeOptions]);

  // Dynamic countdown timer loop & screen size check for accordion default
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setIsDescOpen(window.innerWidth >= 1024);
    }
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 9026));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper to format countdown into HH.MM.SS
  const formatCountdown = (totalSeconds: number) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hrs}.${mins}.${secs}`;
  };

  // Auto-hide toast messages
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "inc") {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const handleAddToCart = () => {
    const savedCart = localStorage.getItem("cart-items");
    let cartItems = [];
    if (savedCart) {
      try {
        cartItems = JSON.parse(savedCart);
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }

    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

    const existingIndex = cartItems.findIndex(
      (item: any) => item.name === details.name && item.selectedSize === selectedSizeOpt.label
    );

    if (existingIndex > -1) {
      cartItems[existingIndex].quantity += quantity;
    } else {
      const priceMap: Record<string, number> = {};
      sizeOptions.forEach((s: { label: string; price: number }) => {
        priceMap[s.label] = s.price;
      });
      const defaultMap = isExclusive ? {
        "6ml": 300,
        "10ml": 500,
        "30ml": 1500,
        "50ml": 2500,
      } : {
        "6ml": 300,
        "10ml": 500,
        "30ml": 900,
        "50ml": 1500,
      };

      const newItem = {
        id: `cart-${targetKey}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: details.name,
        image: details.image,
        inspiredBy: details.inspiredBy,
        selectedSize: selectedSizeOpt.label,
        quantity: quantity,
        prices: {
          ...defaultMap,
          ...priceMap,
        },
        selected: true,
      };
      cartItems.push(newItem);
    }

    localStorage.setItem("cart-items", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cart-updated"));
    triggerToast(`Added ${quantity}x ${details.name} (${selectedSizeOpt.label}) to your bag!`);
  };

  const handleTryNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    triggerToast(
      !isWishlisted
        ? `Added ${details.name} to your wishlist!`
        : `Removed ${details.name} from your wishlist.`
    );
  };

  const [isHovered, setIsHovered] = useState(false);

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const firstChild = container.children[0] as HTMLElement;
      const cardWidth = firstChild ? firstChild.offsetWidth + 24 : 280;

      if (direction === "right") {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 20) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      } else {
        if (container.scrollLeft <= 10) {
          container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
        } else {
          container.scrollBy({ left: -cardWidth, behavior: "smooth" });
        }
      }
    }
  };

  // Auto-scroll recommendations one by one every 3.5 seconds
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      scrollSlider("right");
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Dynamic recommendations list (pulling from 63 master PDF fragrances)
  const recommendations = productsCatalog.slice(0, 8).map(p => ({
    name: p.name,
    inspiredBy: p.inspiredBy || `Inspired by ${p.brand}`,
    rating: p.rating || 4.9,
    reviews: p.reviews || 50,
    price: p.price,
    volume: p.volume || "10ml",
    image: p.image,
    id: p.id
  }));

  return (
    <div className={styles.pageBackground}>
      {/* Toast Alert Box Wrapper (stable parent node prevents removeChild hydration/unmount crashes) */}
      <div className={styles.toastWrapper}>
        {toastMessage && (
          <div className={styles.toast}>
            <div className={styles.toastContent}>
              <span className={styles.toastCheck}>✓</span>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.mainContainer}>
        {/* Breadcrumbs */}
        <div className={styles.breadcrumbs}>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/shop");
              }
            }}
            className={styles.breadcrumbLink}
            style={{ cursor: "pointer", background: "none", border: "none", padding: 0 }}
          >
            <span className={styles.arrowLeft}>←</span> Store
          </button>
          <span className={styles.breadcrumbDivider}>/</span>
          <span className={styles.currentBreadcrumb}>{details.name}</span>
        </div>

        {/* Product Details Section */}
        <section className={styles.productSection}>
          {/* Images Column */}
          <div className={styles.imageColumn}>
            <div className={styles.mainImageWrapper}>
              <Image
                src={
                  (details.galleryImages && details.galleryImages[activeImageIndex]) 
                    ? details.galleryImages[activeImageIndex] 
                    : details.image
                }
                alt={`${details.name} Perfume Main`}
                width={600}
                height={600}
                className={styles.mainImage}
                priority
              />
            </div>

            {/* 3 Mini Images Row */}
            <div className={styles.thumbnailRow}>
              {[0, 1, 2].map((idx) => {
                const img = (details.galleryImages && details.galleryImages[idx]) 
                  ? details.galleryImages[idx] 
                  : (idx === 0 ? details.image : null);

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (img) setActiveImageIndex(idx);
                    }}
                    className={`${styles.thumbnail} ${
                      activeImageIndex === idx ? styles.thumbnailActive : ""
                    } ${!img ? styles.thumbnailPlaceholder : ""}`}
                    aria-label={`View product image ${idx + 1}`}
                  >
                    {img ? (
                      <Image
                        src={img}
                        alt={`${details.name} thumbnail ${idx + 1}`}
                        width={180}
                        height={180}
                        className={styles.thumbnailImg}
                      />
                    ) : (
                      <div className={styles.emptyThumbnailBox} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details Column */}
          <div className={styles.detailsColumn}>
            <div className={styles.titlePriceRow}>
              <div>
                <h1 className={styles.title}>{details.name}</h1>
                <p className={styles.subtitle}>{details.inspiredBy}</p>
                {details.badge && (
                  <div className={styles.badgeRow}>
                    <span className={styles.badge}>{details.badge}</span>
                  </div>
                )}
              </div>
              <div className={styles.price}>{selectedSizeOpt.price.toLocaleString()}tk</div>
            </div>



            {/* Size Selector */}
            <div className={styles.optionSection}>
              <span className={styles.optionLabel}>Select Size</span>
              <div className={styles.sizeRow}>
                {sizeOptions.map((opt: { label: string; price: number }) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setSelectedSizeOpt(opt);
                      triggerToast(`Selected size: ${opt.label} (${opt.price}tk)`);
                    }}
                    className={`${styles.sizeBtn} ${
                      selectedSizeOpt.label === opt.label ? styles.sizeBtnActive : ""
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector + Heart Icon */}
            <div className={styles.optionSection}>
              <span className={styles.optionLabel}>Select Quantity</span>
              <div className={styles.quantityHeartRow}>
                <div className={styles.quantityWrapper}>
                  <button
                    onClick={() => handleQuantityChange("dec")}
                    className={styles.quantityBtn}
                  >
                    —
                  </button>
                  <span className={styles.quantityVal}>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("inc")}
                    className={styles.quantityBtn}
                  >
                    +
                  </button>
                </div>

                {/* Wishlist Heart Icon (Inline, right side of quantity box, NOT in a box) */}
                <button
                  onClick={handleWishlistToggle}
                  className={`${styles.heartInlineBtn} ${
                    isWishlisted ? styles.heartInlineBtnActive : ""
                  }`}
                  aria-label="Add to wishlist"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={isWishlisted ? "#820011" : "none"}
                    stroke={isWishlisted ? "#820011" : "#313134"}
                    strokeWidth="2"
                    className={styles.heartInlineIcon}
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionRow}>
              <button
                onClick={handleTryNow}
                className={styles.buyNowBtn}
              >
                Buy now
              </button>
              <button
                onClick={handleAddToCart}
                className={styles.addToCartBtn}
              >
                Add To Cart
              </button>
            </div>

            {/* Accordion description */}
            <div className={styles.accordion}>
              <button
                onClick={() => setIsDescOpen(!isDescOpen)}
                className={styles.accordionHeader}
              >
                <span>Description & Fit</span>
                <span
                  className={`${styles.caret} ${
                    isDescOpen ? styles.caretOpen : ""
                  }`}
                >
                  ▲
                </span>
              </button>
              {isDescOpen && (
                <div className={styles.accordionContent}>
                  <p>{details.description}</p>
                </div>
              )}
            </div>

            {/* Fragrance Notes – same column as description, right below */}
            <FragranceNotes
              topNotes={details.topNotes}
              middleNotes={details.middleNotes}
              baseNotes={details.baseNotes}
            />
          </div>
        </section>
        {/* Tab section: Performance / Ratings & Reviews */}
        <section className={styles.tabsSection}>
          <div className={styles.tabHeaders}>
            <button
              onClick={() => setActiveTab("performance")}
              className={`${styles.tabHeaderBtn} ${
                activeTab === "performance" ? styles.tabHeaderBtnActive : ""
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`${styles.tabHeaderBtn} ${
                activeTab === "reviews" ? styles.tabHeaderBtnActive : ""
              }`}
            >
              Ratings & Reviews
            </button>
          </div>

          {/* Stable Tab Content Wrapper */}
          <div className={styles.tabContentWrapper}>
            {activeTab === "performance" && (
              <div className={styles.performanceGrid}>
                {/* Card 1: Main Accords */}
                <div className={styles.performanceCard}>
                  <h3 className={styles.cardTitle}>Main Accords</h3>
                  {details.accords.map((accord: any) => (
                    <div key={accord.name} className={styles.barGroup}>
                      <div className={styles.barLabelRow}>
                        <span className={styles.accordLabel}>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={accord.color}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={styles.accordIcon}
                          >
                            <path d={accord.path} />
                          </svg>
                          {accord.name}
                        </span>
                        <span>{accord.pct}%</span>
                      </div>
                      <div className={styles.barOuter}>
                        <div
                          className={styles.barInner}
                          style={{ width: `${accord.pct}%`, backgroundColor: accord.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <div className={styles.sourceText}>Source: Murakkaz</div>
                </div>

                {/* Card 2: Best For */}
                <div className={styles.performanceCard}>
                  <h3 className={styles.cardTitle}>Best For</h3>
                  {details.bestFor.map((bf: any) => (
                    <div key={bf.name} className={styles.barGroup}>
                      <div className={styles.barLabelRow}>
                        <span>{bf.name}</span>
                        <span>{bf.pct}%</span>
                      </div>
                      <div className={styles.barOuter}>
                        <div
                          className={styles.barInner}
                          style={{ width: `${bf.pct}%`, backgroundColor: "#313134" }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <div className={styles.sourceText}>Source: Murakkaz</div>
                </div>

                {/* Card 3: Our Take */}
                <div className={styles.performanceCard}>
                  <h3 className={styles.cardTitle}>Our Take</h3>
                  <p className={styles.ourTakeText}>
                    "{details.ourTake}"
                  </p>
                  <div className={styles.compareBtnContainer}>
                    <button
                      onClick={() => router.push(`/compare?p1=${targetKey}`)}
                      className={styles.compareBtn}
                    >
                      Compare Now <span className={styles.btnArrow}>→</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className={styles.reviewsPlaceholder}>
                <p>No reviews yet for this product.</p>
              </div>
            )}
          </div>
        </section>

        {/* Founder Review Section */}
        <section className={styles.founderSection}>
          <h2 className={styles.sectionTitle}>Founder Review</h2>
          <div className={styles.videoPlaceholder}>
            <button
              onClick={() => triggerToast("Founder fragrance review video playback starting...")}
              className={styles.playButton}
              aria-label="Play video"
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="32" fill="white" fillOpacity="0.8" />
                <path d="M42 32L26 42V22L42 32Z" fill="#313134" />
              </svg>
            </button>
          </div>
        </section>

        {/* Recommendations Slider Section */}
        <section className={styles.recommendationSection}>
          <h2 className={styles.sectionTitle}>You May Also Like</h2>
          <div className={styles.sliderWrapper}>
            {/* Left Nav Button */}
            <button
              onClick={() => scrollSlider("left")}
              className={styles.navBtn}
              aria-label="Previous"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="15.5" stroke="#820011" />
                <path
                  d="M18 10L12 16L18 22"
                  stroke="#820011"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Slider items */}
            <div
              className={styles.sliderGrid}
              ref={sliderRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)}
              onTouchEnd={() => setIsHovered(false)}
            >
              {recommendations.map((item: any, idx: number) => (
                <ProductCard
                  key={idx}
                  id={item.id}
                  slug={item.slug}
                  brand="Murakkaz"
                  name={item.name}
                  category={item.category}
                  badge={item.badge}
                  inspiredBy={item.inspiredBy}
                  rating={item.rating}
                  reviews={item.reviews}
                  price={item.price}
                  volume={item.volume}
                  image={item.image}
                />
              ))}
            </div>

            {/* Right Nav Button */}
            <button
              onClick={() => scrollSlider("right")}
              className={styles.navBtn}
              aria-label="Next"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="15.5" stroke="#820011" />
                <path
                  d="M14 10L20 16L14 22"
                  stroke="#820011"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Centered View All Button */}
          <div className={styles.viewAllWrapper}>
            <Link href="/shop" className={styles.viewAllBtn}>
              View All
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ProductDetailsPage(props: any) {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: '#8c8c90' }}>
        Loading product...
      </div>
    }>
      <ProductDetailsContent {...props} />
    </Suspense>
  );
}
