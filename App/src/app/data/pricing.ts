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

export const EXCLUSIVE_FRAGRANCES = [
  'irish-leather',
  'baccarat-rouge-540',
  'tobacco-vanille',
  'by-the-fireplace',
  'resala',
  'sultani',
  'guidance',
  'rosewood',
  'sakura-dior',
  'imagination'
];

export function getPerfumePricing(product: {
  slug?: string;
  name?: string;
  category?: string;
}): PricingTierConfig {
  const isExclusive =
    product.category?.toLowerCase() === 'exclusive' ||
    (product.slug &&
      EXCLUSIVE_FRAGRANCES.some(
        (ex) => product.slug!.toLowerCase().includes(ex) || ex.includes(product.slug!.toLowerCase())
      ));

  return isExclusive ? PERFUME_PRICING_CONFIG.exclusive : PERFUME_PRICING_CONFIG.regular;
}
