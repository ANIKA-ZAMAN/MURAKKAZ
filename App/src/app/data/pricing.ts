/**
 * Reusable Perfume Pricing Configuration for Murakkaz
 * Supports dynamic pricing by category (Regular vs Exclusive) and sizes (6ml, 10ml, 30ml, 50ml).
 */

export type PerfumeCategory = 'regular' | 'exclusive';

export interface PricingTierConfig {
  category: PerfumeCategory;
  name: string;
  badge: string;
  defaultSize: string;
  sizesList: string[];
  prices: Record<string, number>;
  originalPrices?: Record<string, number>;
}

export const PERFUME_PRICING_CONFIG: Record<PerfumeCategory, PricingTierConfig> = {
  regular: {
    category: 'regular',
    name: 'Regular Collection',
    badge: 'REGULAR',
    defaultSize: '10ml',
    sizesList: ['6ml', '10ml', '30ml', '50ml'],
    prices: {
      '6ml': 300,
      '10ml': 500,
      '30ml': 900,
      '50ml': 1500,
    },
    originalPrices: {
      '6ml': 400,
      '10ml': 650,
      '30ml': 1100,
      '50ml': 1900,
    },
  },
  exclusive: {
    category: 'exclusive',
    name: 'Exclusive Collection',
    badge: 'EXCLUSIVE',
    defaultSize: '10ml',
    sizesList: ['6ml', '10ml', '30ml', '50ml'],
    prices: {
      '6ml': 300,
      '10ml': 500,
      '30ml': 1500,
      '50ml': 2500,
    },
    originalPrices: {
      '6ml': 400,
      '10ml': 650,
      '30ml': 1900,
      '50ml': 3200,
    },
  },
};

export const EXCLUSIVE_FRAGRANCES = new Set([
  'irish-leather',
  'baccarat-rouge-540',
  'tobacco-vanille',
  'by-the-fireplace',
  'resala',
  'sultani',
  'guidance',
  'rosewood',
  'sakura-dior',
  'imagination',
  'prod-irish-leather-01',
  'prod-baccarat-rouge-540-02',
  'prod-tobacco-vanille-03',
  'prod-by-the-fireplace-04',
  'prod-resala-05',
  'prod-sultani-06',
  'prod-guidance-07',
  'prod-rosewood-08',
  'prod-sakura-dior-09',
  'prod-imagination-10'
]);

function slugifyName(text?: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export function resolvePerfumeCategory(product: {
  category?: string;
  slug?: string;
  name?: string;
  id?: string;
  badge?: string;
  sizes?: Array<{ price?: number | string }>;
}): PerfumeCategory {
  if (product.category && product.category.toLowerCase() === 'exclusive') {
    return 'exclusive';
  }
  if (product.badge && product.badge.toLowerCase().includes('exclusive')) {
    return 'exclusive';
  }
  const cleanSlug = (product.slug || '').toLowerCase().trim();
  const cleanId = (product.id || '').toLowerCase().trim();
  const nameSlug = slugifyName(product.name);
  if (
    EXCLUSIVE_FRAGRANCES.has(cleanSlug) ||
    EXCLUSIVE_FRAGRANCES.has(cleanId) ||
    EXCLUSIVE_FRAGRANCES.has(nameSlug)
  ) {
    return 'exclusive';
  }
  if (product.sizes && Array.isArray(product.sizes) && product.sizes.some((s) => Number(s.price) >= 2500)) {
    return 'exclusive';
  }
  return 'regular';
}

export function getPricingForCategory(category: PerfumeCategory): PricingTierConfig {
  return PERFUME_PRICING_CONFIG[category] || PERFUME_PRICING_CONFIG.regular;
}

export function getProductPriceForSize(
  category: PerfumeCategory,
  size: string,
  customPrices?: Record<string, number>
): number {
  if (customPrices && customPrices[size]) {
    return customPrices[size];
  }
  const tier = getPricingForCategory(category);
  return tier.prices[size] || tier.prices[tier.defaultSize] || 500;
}

export function getPerfumePricing(product: {
  slug?: string;
  name?: string;
  category?: string;
}): PricingTierConfig {
  const cat = resolvePerfumeCategory(product);
  return getPricingForCategory(cat);
}
