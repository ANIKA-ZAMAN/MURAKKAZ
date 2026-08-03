const fs = require('fs');
const path = require('path');

process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:../Backend/dev.db';

const { PrismaClient } = require('../Backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

const targetProductNames = [
  "Irish Leather", "Baccarat Rouge 540", "Tobacco Vanille", "By the Fireplace",
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

async function syncDb() {
  console.log("Cleaning Database to strictly 62 real PDF fragrances...");

  const allDbProducts = await prisma.product.findMany();
  let deletedCount = 0;

  for (const p of allDbProducts) {
    const isKeep = targetProductNames.some(name => name.toLowerCase() === p.name.toLowerCase());
    if (!isKeep) {
      await prisma.productSize.deleteMany({ where: { productId: p.id } });
      await prisma.productNote.deleteMany({ where: { productId: p.id } });
      await prisma.product.delete({ where: { id: p.id } });
      deletedCount++;
    }
  }

  const finalCount = await prisma.product.count();
  console.log(`✅ Deleted ${deletedCount} extra products. Database now contains strictly ${finalCount} real fragrances.`);
  await prisma.$disconnect();
}

syncDb().catch(e => {
  console.error(e);
  prisma.$disconnect();
});
