export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  rating: number;
  reviews: number;
  price: string;
  priceVal: number;
  volume: string;
  image: string;
  family: string;
  gender: string;
  occasion: string;
  meter: string;
  notes: string[];
}

// 100% Dynamic products array - empty by default until items are created via Backend API / Admin Dashboard
export const luxuryProducts: Product[] = [];

export const productsCatalog: Product[] = luxuryProducts;

// Live API fetch from Express Backend (http://localhost:5000/api/products)
export async function fetchLiveProducts(): Promise<Product[]> {
  try {
    const res = await fetch('http://localhost:5000/api/products');
    if (!res.ok) throw new Error('API offline');
    const json = await res.json();
    
    // Safely extract raw list regardless of pagination wrapper format
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
        id: p.id || p.slug || `prod-${Math.random()}`,
        name: p.name || 'Unnamed Fragrance',
        brand: p.brand || 'Murakkaz',
        description: p.description || '',
        rating: p.rating || 5.0,
        reviews: p.reviewCount || 0,
        price: p.sizes?.[0] ? `${p.sizes[0].price.toLocaleString()}tk` : (p.priceVal ? `${p.priceVal.toLocaleString()}tk` : '2,800tk'),
        priceVal: p.sizes?.[0]?.price || p.priceVal || 2800,
        volume: p.sizes?.[0]?.size || '50ml',
        image: p.image || '/images/products/jade_serenity.png',
        family: p.family || 'WOODY',
        gender: p.gender || 'UNISEX',
        occasion: p.occasion || 'General',
        meter: p.meter || 'Moderate',
        notes: p.notes ? p.notes.map((n: any) => typeof n === 'string' ? n : n.name) : []
      }));
    }
  } catch (e) {
    console.warn('Failed to fetch live products from API:', e);
  }
  return [];
}
