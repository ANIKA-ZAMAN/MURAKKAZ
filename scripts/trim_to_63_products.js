const fs = require('fs');
const path = require('path');

const targetProductNames = [
  "anika", "Irish Leather", "Baccarat Rouge 540", "Tobacco Vanille", "By the Fireplace",
  "Resala", "Sultani", "Guidance", "Rosewood", "Sakura Dior", "Imagination", "Ultra Male",
  "Bad Boy", "Emporio Armani Stronger With You Parfum", "Valentino Donna", "Sexy Secret",
  "Bombshell", "Mon Guerlain", "Spicebomb Extreme", "Y Eau de Parfum", "Ehsas", "Icon",
  "Acqua di Giò Elixir", "Sauvage Eau de Parfum", "Eros Parfum", "MYSLF Eau de Parfum",
  "Le Beau", "Invictus Victory Elixir", "1 Million Parfum", "Silver Mountain Water",
  "Strawberry Letter", "Scandal Pour Homme", "Eau de Lacoste L.12.12. White", "Absolu Aventus",
  "Aventus", "Angels' Share", "Chance Eau Tendre", "Miss Dior Blooming Bouquet", "Lady Korloff",
  "Bright Peach", "Libre", "J'adore Parfum d'Eau", "Flora Gorgeous Gardenia", "Black Opium",
  "Bleu de Chanel", "Million Gold For Her", "Paradoxe", "Girl of Now",
  "Narciso Rodriguez for Her Eau de Parfum", "Good Girl", "Burberry Her",
  "Japanese Cherry Blossom", "Dior Homme Parfum", "Terre d'Hermès Parfum", "Olympéa Blossom",
  "Millésime Impérial", "Sì Parfum", "Rose Noir", "Gucci Bloom", "Explorer Platinum",
  "Good Girl Blush", "Good Girl Gone Bad", "Vanilla 28"
];

const productsFilePath = path.join(__dirname, '../App/src/app/data/products.ts');
let fileContent = fs.readFileSync(productsFilePath, 'utf8');

const match = fileContent.match(/export const luxuryProducts: Product\[\] = (\[[\s\S]*?\]);/);

if (match) {
  const allProducts = JSON.parse(match[1]);
  console.log(`Original total products in products.ts: ${allProducts.length}`);

  const trimmedProducts = allProducts.filter(p => 
    targetProductNames.some(name => name.toLowerCase() === p.name.toLowerCase())
  );

  console.log(`Trimmed products count: ${trimmedProducts.length}`);

  const newProductsCode = `export interface Product {
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

// Exactly 63 Fragrances from Master PDF Catalog
export const luxuryProducts: Product[] = ${JSON.stringify(trimmedProducts, null, 2)};

export const productsCatalog = luxuryProducts;

export async function fetchLiveProducts() {
  return luxuryProducts;
}
`;

  fs.writeFileSync(productsFilePath, newProductsCode, 'utf8');
  console.log('✅ App/src/app/data/products.ts successfully updated with exports and 63 products!');
} else {
  console.error('❌ Could not parse luxuryProducts array');
}
