const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8'));

const mapped = products.map(p => ({
  id: p.id || p.slug,
  name: p.name,
  brand: p.brand,
  inspiredBy: p.inspiredBy || '',
  description: p.description || '',
  rating: p.rating || 5.0,
  reviews: p.reviewCount || 0,
  price: p.sizes?.[0] ? p.sizes[0].price + 'tk' : (p.priceVal ? p.priceVal + 'tk' : '300tk'),
  originalPrice: p.sizes?.[0]?.originalPrice ? p.sizes[0].originalPrice + 'tk' : undefined,
  priceVal: p.sizes?.[0]?.price || p.priceVal || 300,
  originalPriceVal: p.sizes?.[0]?.originalPrice || undefined,
  volume: p.sizes?.[0]?.size || '6ml',
  image: p.image || '/images/products/jade_serenity.png',
  family: p.family || 'WOODY',
  gender: p.gender || 'UNISEX',
  occasion: p.occasion || 'General',
  meter: p.meter || 'Moderate',
  notes: p.notes ? p.notes.map(n => typeof n === 'string' ? n : n.name) : []
}));

const tsContent = `export interface Product {
  id: string;
  name: string;
  brand: string;
  inspiredBy?: string;
  description: string;
  rating: number;
  reviews: number;
  price: string;
  originalPrice?: string;
  priceVal: number;
  originalPriceVal?: number;
  volume: string;
  image: string;
  family: string;
  gender: string;
  occasion: string;
  meter: string;
  notes: string[];
  badge?: string;
}

// 63 Fragrances catalog bundled directly for seamless Vercel deployment & SSR
export const luxuryProducts: Product[] = ${JSON.stringify(mapped, null, 2)};

export const productsCatalog: Product[] = luxuryProducts;

// Live API fetch from Express Backend (http://localhost:5000/api/products or Vercel ENV)
export async function fetchLiveProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(\`\${baseUrl}/api/products?limit=100\`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('API offline');
    const json = await res.json();
    
    let rawList: any[] = [];
    if (json && Array.isArray(json.data)) {
      rawList = json.data;
    } else if (json && json.data && Array.isArray(json.data.data)) {
      rawList = json.data.data;
    } else if (Array.isArray(json)) {
      rawList = json;
    }

    if (rawList.length > 0) {
      return rawList.map((p: any) => ({
        id: p.id || p.slug || \`prod-\${Math.random()}\`,
        name: p.name || 'Unnamed Fragrance',
        brand: p.brand || 'Murakkaz',
        inspiredBy: p.inspiredBy || '',
        description: p.description || '',
        rating: p.rating || 5.0,
        reviews: p.reviewCount || 0,
        price: p.sizes?.[0] ? \`\${p.sizes[0].price.toLocaleString()}tk\` : (p.priceVal ? \`\${p.priceVal.toLocaleString()}tk\` : '300tk'),
        originalPrice: p.sizes?.[0]?.originalPrice ? \`\${p.sizes[0].originalPrice.toLocaleString()}tk\` : undefined,
        priceVal: p.sizes?.[0]?.price || p.priceVal || 300,
        originalPriceVal: p.sizes?.[0]?.originalPrice || undefined,
        volume: p.sizes?.[0]?.size || '6ml',
        image: p.image || '/images/products/jade_serenity.png',
        family: p.family || 'WOODY',
        gender: p.gender || 'UNISEX',
        occasion: p.occasion || 'General',
        meter: p.meter || 'Moderate',
        notes: p.notes ? p.notes.map((n: any) => typeof n === 'string' ? n : n.name) : []
      }));
    }
  } catch (e) {
    // Return bundled 63 perfumes fallback if API server is offline (e.g. Vercel)
  }
  return luxuryProducts;
}
`;

fs.writeFileSync(path.join(__dirname, '../../App/src/app/data/products.ts'), tsContent);
console.log('Successfully synced', mapped.length, 'products to App/src/app/data/products.ts');
