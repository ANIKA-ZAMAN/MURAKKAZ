/**
 * Reusable Perfume Pricing Configuration for Murakkaz
 * Supports dynamic pricing by category (Regular vs Exclusive) and sizes (6ml, 12ml, 30ml, 50ml).
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
      '30ml': 1500,
      '50ml': 1500,
    },
    originalPrices: {
      '6ml': 400,
      '10ml': 700,
      '30ml': 1900,
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
      '50ml': 1500,
    },
    originalPrices: {
      '6ml': 450,
      '10ml': 800,
      '30ml': 2200,
      '50ml': 2000,
    },
  },
};

/**
 * List of known Exclusive Luxury Fragrance slugs / keywords
 */
export const EXCLUSIVE_PERFUME_SLUGS: string[] = [
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
];

/**
 * Automatically determine whether a product belongs to the Exclusive or Regular category.
 */
export function resolvePerfumeCategory(product: {
  category?: string | null;
  slug?: string | null;
  name?: string | null;
  id?: string | null;
  badge?: string | null;
}): PerfumeCategory {
  if (product.category) {
    const clean = product.category.toLowerCase().trim();
    if (clean === 'exclusive' || clean.includes('exclusive') || clean.includes('premium')) {
      return 'exclusive';
    }
    if (clean === 'regular' || clean.includes('regular')) {
      return 'regular';
    }
  }

  if (product.badge && product.badge.toUpperCase().includes('EXCLUSIVE')) {
    return 'exclusive';
  }

  const checkStrings = [product.slug, product.name, product.id].filter(Boolean) as string[];
  for (const s of checkStrings) {
    const clean = s.toLowerCase().trim();
    for (const exclusiveSlug of EXCLUSIVE_PERFUME_SLUGS) {
      if (clean.includes(exclusiveSlug) || exclusiveSlug.includes(clean)) {
        return 'exclusive';
      }
    }
  }

  return 'regular';
}

/**
 * Helper to get the pricing configuration for a category.
 */
export function getPricingForCategory(category?: string | null): PricingTierConfig {
  if (!category) return PERFUME_PRICING_CONFIG.regular;
  const clean = category.toLowerCase().trim();
  if (clean === 'exclusive' || clean.includes('exclusive') || clean.includes('premium')) {
    return PERFUME_PRICING_CONFIG.exclusive;
  }
  return PERFUME_PRICING_CONFIG.regular;
}

/**
 * Helper to get price for a specific product and size.
 */
export function getProductPriceForSize(
  category: string | undefined,
  size: string,
  customPrices?: Record<string, number>
): number {
  if (customPrices && customPrices[size] !== undefined && !isNaN(Number(customPrices[size]))) {
    return Number(customPrices[size]);
  }
  const tier = getPricingForCategory(category);
  return tier.prices[size] ?? tier.prices[tier.defaultSize] ?? 500;
}
