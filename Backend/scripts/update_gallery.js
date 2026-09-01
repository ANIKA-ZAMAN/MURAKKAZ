const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { galleryImages: true }
  });
  console.log('Found', products.length, 'products in database');
  for (const p of products) {
    const existing = p.galleryImages.find(g => g.url === '/images/murakkaz_cream_lineup.jpg');
    if (!existing) {
      await prisma.productGalleryImage.create({
        data: {
          productId: p.id,
          url: '/images/murakkaz_cream_lineup.jpg',
          sortOrder: 1
        }
      });
    }
  }
  console.log('✓ Successfully updated all', products.length, 'products in database!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
