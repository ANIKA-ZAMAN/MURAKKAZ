import fs from 'fs';
import path from 'path';
import { PrismaClient, NoteType, FragranceFamily, Gender, Meter, Role, Provider } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Clear all existing data
  console.log('Clearing existing data...');
  await prisma.review.deleteMany();
  await prisma.eventReminder.deleteMany();
  await prisma.eventGalleryImage.deleteMany();
  await prisma.event.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productGalleryImage.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.productNote.deleteMany();
  await prisma.productAccord.deleteMany();
  await prisma.productBestFor.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.storeLocation.deleteMany();
  await prisma.siteContent.deleteMany();

  // 2. Create Admin User
  console.log('Creating Admin user...');
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@murakkaz.com',
      firstName: 'Sadid',
      lastName: 'Admin',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      provider: Provider.EMAIL,
    },
  });

  // 3. Create Collections
  console.log('Creating Collections...');
  const bestSellers = await prisma.collection.create({
    data: { slug: 'best-sellers', name: 'Best Sellers', isActive: true, sortOrder: 1 },
  });
  const newArrivals = await prisma.collection.create({
    data: { slug: 'new-arrivals', name: 'New Arrivals', isActive: true, sortOrder: 2 },
  });
  const signature = await prisma.collection.create({
    data: { slug: 'signature-collection', name: 'Signature Collection', isActive: true, sortOrder: 3 },
  });

  // 4. Create Products from data/products.json
  console.log('Creating Products from data/products.json...');
  const productsFilePath = path.join(__dirname, '../data/products.json');
  let rawJsonProducts: any[] = [];
  if (fs.existsSync(productsFilePath)) {
    rawJsonProducts = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
  }

  const familyMap: Record<string, FragranceFamily> = {
    WOODY: FragranceFamily.WOODY, CITRUS: FragranceFamily.CITRUS, ORIENTAL: FragranceFamily.ORIENTAL, FRESH: FragranceFamily.FRESH,
    FLORAL: FragranceFamily.FLORAL, AQUATIC: FragranceFamily.AQUATIC, GOURMAND: FragranceFamily.GOURMAND, SPICY: FragranceFamily.SPICY,
    Woody: FragranceFamily.WOODY, Citrus: FragranceFamily.CITRUS, Oriental: FragranceFamily.ORIENTAL, Fresh: FragranceFamily.FRESH,
    Floral: FragranceFamily.FLORAL, Aquatic: FragranceFamily.AQUATIC, Gourmand: FragranceFamily.GOURMAND, Spicy: FragranceFamily.SPICY
  };

  const genderMap: Record<string, Gender> = {
    MEN: Gender.MEN, WOMEN: Gender.WOMEN, UNISEX: Gender.UNISEX,
    Men: Gender.MEN, Women: Gender.WOMEN, Unisex: Gender.UNISEX
  };

  const meterMap: Record<string, Meter> = {
    INTIMATE: Meter.INTIMATE, MODERATE: Meter.MODERATE, LONG_LASTING: Meter.LONG_LASTING, BEAST_MODE: Meter.BEAST_MODE,
    Intimate: Meter.INTIMATE, Moderate: Meter.MODERATE, 'Long Lasting': Meter.LONG_LASTING, 'Beast Mode': Meter.BEAST_MODE
  };
  
  const productTemplates = [
    {
      name: "Jade Serenity",
      brand: "Murakkaz",
      inspiredBy: "Inspired by Creed Original Vetiver",
      description: "Jade Serenity is a masterclass in clean, sophisticated freshness engineered explicitly to conquer hot and humid weather. Opening with a crisp, rejuvenating burst of green tea and sharp citrus, it effortlessly settles into a calming, earthy base of rich vetiver and smooth cedarwood. This isn't just a fragrance—it's an invisible suit of armor that keeps you feeling fresh, composed, and undeniably premium from morning meetings to late-night lounge sessions.",
      rating: 4.9,
      reviewCount: 250,
      image: "/images/products/jade_serenity.png",
      family: FragranceFamily.CITRUS,
      gender: Gender.UNISEX,
      occasion: "Daily Wear",
      meter: Meter.MODERATE,
      collectionId: bestSellers.id,
      notes: {
        top: ["Osmanthus", "Peach", "Neroli", "Bergamot", "Mandarin", "Cinnamon"],
        middle: ["Indian Tuberose", "Jasmine", "Narcissus", "May Rose"],
        base: ["Amber", "Cedar", "Sandalwood", "Patchouli", "Vetiver"]
      },
      accords: [
        { name: "Citrus", percentage: 100, color: "#e2cc9e", iconPath: "M12 12c2.5-4 5.5-5 7-3s0 5-3 7L12 12z" },
        { name: "Fresh", percentage: 80, color: "#b9cad7", iconPath: "M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" },
        { name: "Green", percentage: 60, color: "#8fb39c", iconPath: "M3 10c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z" },
        { name: "Aromatic", percentage: 40, color: "#a28c73", iconPath: "M4 18L18 4" }
      ],
      bestFor: [
        { name: "Summer & Spring", percentage: 90 },
        { name: "Winter & Autumn", percentage: 40 },
        { name: "Daytime Wear", percentage: 80 },
        { name: "Nightly Occasions", percentage: 50 }
      ],
      ourTake: "An ultra-clean summer workhorse. Rejuvenating and sharp green-citrus freshness that outlasts typical fresh perfumes."
    },
    {
      name: "Coral Sea Extrait",
      brand: "Murakkaz",
      inspiredBy: "Inspired by Louis Vuitton Pacific Chill",
      description: "Coral Sea transports you to windswept coastal shores. A mineral, fresh scent blending sea salt spray, earthy wood sage, and a light grapefruit undertone. Perfect for daily wear, it feels airy, natural, and refreshingly clean, evoking the spirit of freedom and raw nature.",
      rating: 4.8,
      reviewCount: 120,
      image: "/images/products/coral_sea.png",
      family: FragranceFamily.FRESH,
      gender: Gender.MEN,
      occasion: "Summer",
      meter: Meter.LONG_LASTING,
      collectionId: signature.id,
      notes: {
        top: ["Bergamot", "Mandarin", "Sea Salt"],
        middle: ["Peach", "Neroli", "Grapefruit"],
        base: ["Cedar", "Sandalwood", "Amber"]
      },
      accords: [
        { name: "Marine", percentage: 100, color: "#b9cad7", iconPath: "M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" },
        { name: "Salty", percentage: 85, color: "#e2e2e5", iconPath: "M3 10c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z" },
        { name: "Aromatic", percentage: 70, color: "#a28c73", iconPath: "M4 18L18 4" },
        { name: "Woody", percentage: 55, color: "#8a735c", iconPath: "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" }
      ],
      bestFor: [
        { name: "Summer & Spring", percentage: 85 },
        { name: "Winter & Autumn", percentage: 45 },
        { name: "Daytime Wear", percentage: 90 },
        { name: "Nightly Occasions", percentage: 40 }
      ],
      ourTake: "The perfect casual signature. Mineral, salty, and wonderfully breezy—highly versatile for any office or daytime setting."
    },
    {
      name: "Murakkaz Noir",
      brand: "Murakkaz",
      inspiredBy: "Inspired by Dior Sauvage Elixir",
      description: "Murakkaz Noir is an intense, concentrated fragrance for the bold and sophisticated. Opening with sweet cardamoms, hot cinnamon, and fiery spices, it transitions smoothly into a calming lavender heart and a deep base of dark cedar, patchouli, and licorice. A true masterpiece of projection and longevity.",
      rating: 4.7,
      reviewCount: 120,
      image: "/images/products/magnetism.png",
      family: FragranceFamily.WOODY,
      gender: Gender.MEN,
      occasion: "Night Out",
      meter: Meter.BEAST_MODE,
      collectionId: bestSellers.id,
      notes: {
        top: ["Cinnamon", "Bergamot", "Mandarin", "Cardamom"],
        middle: ["Neroli", "May Rose", "Lavender"],
        base: ["Sandalwood", "Vetiver", "Amber", "Patchouli", "Cedar"]
      },
      accords: [
        { name: "Warm Spicy", percentage: 100, color: "#e89f65", iconPath: "M4 18L18 4" },
        { name: "Woody", percentage: 90, color: "#a28c73", iconPath: "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" },
        { name: "Aromatic", percentage: 80, color: "#b9cad7", iconPath: "M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" },
        { name: "Lavender", percentage: 60, color: "#b8a3e0", iconPath: "M3 10c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z" }
      ],
      bestFor: [
        { name: "Winter & Autumn", percentage: 95 },
        { name: "Summer & Spring", percentage: 50 },
        { name: "Daytime Wear", percentage: 40 },
        { name: "Nightly Occasions", percentage: 85 }
      ],
      ourTake: "A powerhouse elixir dupe. Dark, rich, and commanding with beast-mode performance that draws attention instantly."
    },
    {
      name: "Hellenist",
      brand: "Murakkaz",
      inspiredBy: "Inspired by Baccarat Rouge 540",
      description: "Hellenist is an exquisite, glowing amber floral fragrance that lays on the skin like a warm, sugary breeze. Precious saffron and sweet jasmine notes fuse with rich, warm ambergris and freshly cut cedarwood to create a poetic, highly addictive fragrance signature.",
      rating: 4.9,
      reviewCount: 310,
      image: "/images/products/hellenist.png",
      family: FragranceFamily.ORIENTAL,
      gender: Gender.WOMEN,
      occasion: "Date Night",
      meter: Meter.BEAST_MODE,
      collectionId: signature.id,
      notes: {
        top: ["Jasmine", "Mandarin", "Saffron"],
        middle: ["Neroli", "May Rose", "Amberwood"],
        base: ["Cedar", "Amber", "Fir Resin"]
      },
      accords: [
        { name: "Amber", percentage: 100, color: "#e2cc9e", iconPath: "M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" },
        { name: "Woody", percentage: 80, color: "#a28c73", iconPath: "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" },
        { name: "Warm Spicy", percentage: 65, color: "#e89f65", iconPath: "M4 18L18 4" },
        { name: "Floral", percentage: 50, color: "#e2e2e5", iconPath: "M3 10c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z" }
      ],
      bestFor: [
        { name: "Winter & Autumn", percentage: 85 },
        { name: "Summer & Spring", percentage: 60 },
        { name: "Daytime Wear", percentage: 50 },
        { name: "Nightly Occasions", percentage: 90 }
      ],
      ourTake: "Stunningly sweet amber profile. Highly projecting and elegant, ideal for special occasions and luxury events."
    },
    {
      name: "Velvet Oud Imperial",
      brand: "Murakkaz",
      inspiredBy: "Inspired by MFK Oud Satin Mood",
      description: "Opulent, velvety, and deeply intoxicating. A rich agarwood resin kissed by sweet vanilla and royal rose.",
      rating: 4.8,
      reviewCount: 95,
      image: "/images/products/velvet_oud.png",
      family: FragranceFamily.WOODY,
      gender: Gender.UNISEX,
      occasion: "Formal",
      meter: Meter.BEAST_MODE,
      collectionId: signature.id,
      notes: {
        top: ["Bulgarian Rose", "Violet"],
        middle: ["Turkish Rose", "Vanilla"],
        base: ["Agarwood (Oud)", "Benzoin"]
      },
      accords: [
        { name: "Oud", percentage: 100, color: "#543A2C", iconPath: "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" },
        { name: "Rose", percentage: 85, color: "#C64B62", iconPath: "M3 10c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z" }
      ],
      bestFor: [
        { name: "Winter & Autumn", percentage: 95 },
        { name: "Nightly Occasions", percentage: 85 }
      ],
      ourTake: "A true beast-mode fragrance that commands attention."
    },
    {
      name: "Amber Elixir 10",
      brand: "Murakkaz",
      inspiredBy: "Inspired by Kilian Angels' Share",
      description: "Warm cognac, cinnamon, and aged oak barrel notes blended to absolute perfection.",
      rating: 4.9,
      reviewCount: 150,
      image: "/images/products/amber_gold.png",
      family: FragranceFamily.ORIENTAL,
      gender: Gender.UNISEX,
      occasion: "Winter",
      meter: Meter.LONG_LASTING,
      collectionId: newArrivals.id,
      notes: {
        top: ["Cognac", "Cinnamon"],
        middle: ["Tonka Bean", "Oak"],
        base: ["Praline", "Vanilla", "Sandalwood"]
      },
      accords: [
        { name: "Sweet", percentage: 100, color: "#F3A683", iconPath: "M12 2C12 2 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 2 12 2Z" },
        { name: "Woody", percentage: 70, color: "#a28c73", iconPath: "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" }
      ],
      bestFor: [
        { name: "Winter & Autumn", percentage: 100 },
        { name: "Nightly Occasions", percentage: 90 }
      ],
      ourTake: "The ultimate boozy gourmand for cold nights."
    },
    {
      name: "Royal Santal 33",
      brand: "Murakkaz",
      inspiredBy: "Inspired by Le Labo Santal 33",
      description: "The smoothest sandalwood and cardamom profile. Remarkable quality and craftsmanship.",
      rating: 4.6,
      reviewCount: 205,
      image: "/images/products/magnetism.png",
      family: FragranceFamily.WOODY,
      gender: Gender.UNISEX,
      occasion: "Office",
      meter: Meter.MODERATE,
      collectionId: bestSellers.id,
      notes: {
        top: ["Cardamom", "Iris", "Violet"],
        middle: ["Sandalwood", "Papyrus", "Cedar"],
        base: ["Leather", "Amber", "Musk"]
      },
      accords: [
        { name: "Woody", percentage: 100, color: "#a28c73", iconPath: "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" },
        { name: "Powdery", percentage: 80, color: "#e2e2e5", iconPath: "M3 10c0-3.3 4-6 9-6s9 2.7 9 6-4 6-9 6-9-2.7-9-6z" }
      ],
      bestFor: [
        { name: "Daytime Wear", percentage: 95 },
        { name: "Summer & Spring", percentage: 80 }
      ],
      ourTake: "A modern classic that works everywhere."
    },
    {
      name: "Saffron Leather",
      brand: "Murakkaz",
      inspiredBy: "Inspired by Memo Paris African Leather",
      description: "Rich spicy saffron with supple leather notes. It gives an undeniable aura of confidence and sophistication.",
      rating: 4.7,
      reviewCount: 88,
      image: "/images/products/hellenist.png",
      family: FragranceFamily.WOODY,
      gender: Gender.MEN,
      occasion: "Formal",
      meter: Meter.LONG_LASTING,
      collectionId: newArrivals.id,
      notes: {
        top: ["Cardamom", "Bergamot", "Saffron"],
        middle: ["Cumin", "Geranium", "Patchouli"],
        base: ["Leather", "Vetiver", "Oud", "Musk"]
      },
      accords: [
        { name: "Leather", percentage: 100, color: "#4A3B32", iconPath: "M12 7c-2 0-3.5 1-3.5 2.5S10 12 12 12s3.5-1 3.5-2.5S14 7 12 7z" },
        { name: "Warm Spicy", percentage: 85, color: "#e89f65", iconPath: "M4 18L18 4" }
      ],
      bestFor: [
        { name: "Winter & Autumn", percentage: 90 },
        { name: "Nightly Occasions", percentage: 80 }
      ],
      ourTake: "Perfect signature scent for the confident man."
    }
  ];

  const dbProducts = [];

  for (const item of rawJsonProducts) {
    const slug = item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const family = familyMap[item.family] || FragranceFamily.WOODY;
    const gender = genderMap[item.gender] || Gender.UNISEX;
    const meter = meterMap[item.meter] || Meter.MODERATE;
    const image = item.image || '/images/products/jade_serenity.png';

    const sizesToCreate = Array.isArray(item.sizes) && item.sizes.length > 0
      ? item.sizes.map((s: any) => ({ size: s.size || '50ml', price: s.price || 2800, originalPrice: s.originalPrice || undefined, stock: s.stock || 50 }))
      : [
          { size: '12ml', price: 500, originalPrice: 720, stock: 50 },
          { size: '30ml', price: 900, originalPrice: 1200, stock: 50 },
          { size: '55ml', price: 1500, originalPrice: 2000, stock: 50 },
          { size: '100ml', price: item.priceVal || 2800, originalPrice: item.originalPriceVal || 3500, stock: 50 }
        ];

    const notesToCreate = Array.isArray(item.notes) && item.notes.length > 0
      ? item.notes.map((n: any) => typeof n === 'string' ? { name: n, type: NoteType.GENERAL } : { name: n.name, type: (n.type as NoteType) || NoteType.GENERAL })
      : [];

    const accordsToCreate = Array.isArray(item.accords) && item.accords.length > 0
      ? item.accords.map((a: any) => ({ name: a.name, percentage: a.pct || a.percentage || 50, color: a.color || '#C5A880' }))
      : [];

    const product = await prisma.product.create({
      data: {
        slug,
        name: item.name,
        brand: item.brand || 'Murakkaz',
        inspiredBy: item.inspiredBy || '',
        description: item.description || '',
        image,
        family,
        gender,
        occasion: item.occasion || 'General',
        meter,
        rating: item.rating || 5.0,
        reviewCount: item.reviews || item.reviewCount || 0,
        ourTake: item.ourTake || item.description || '',
        isActive: item.isActive !== false,
        isFeatured: !!item.isFeatured,
        collectionId: bestSellers.id,
        sizes: { create: sizesToCreate },
        notes: { create: notesToCreate },
        accords: { create: accordsToCreate },
        galleryImages: { create: [{ url: image, sortOrder: 1 }] }
      }
    });
    dbProducts.push(product);
  }

  // 5. Create Reviews
  console.log('Creating Reviews...');
  const reviewsData = [
    {
      perfume: "Murakkaz Noir",
      inspired: "Inspired by Tom Ford Noir de Noir",
      stars: 5,
      quote: "The longevity of Murakkaz Noir is absolutely incredible. It lasted over 14 hours on my skin with a rich, dark rose and vanilla trail that garnered endless compliments.",
      name: "Adnan S.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      longevity: "14+ Hours",
      projection: "Enveloping Sillage",
      compliments: "★ 9.9/10 Compliments",
    },
    {
      perfume: "Jade Serenity",
      inspired: "Inspired by Creed Silver Mountain Water",
      stars: 5,
      quote: "Jade Serenity is an absolute masterpiece. Crisp green tea and fresh citrus notes that feel impossibly refined. It matches the quality of $400 designer extraits.",
      name: "Tasnim R.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      longevity: "10+ Hours",
      projection: "Radiant Aura",
      compliments: "★ 9.8/10 Compliments",
    },
    {
      perfume: "Coral Sea Extrait",
      inspired: "Inspired by Louis Vuitton Pacific Chill",
      stars: 5,
      quote: "An exquisite fragrance experience. The signature finder quiz recommended Coral Sea, and the juicy blackcurrant and mint notes are breathtakingly luxurious.",
      name: "Farhan K.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      longevity: "12+ Hours",
      projection: "Bold Projection",
      compliments: "★ 9.7/10 Compliments",
    },
    {
      perfume: "Velvet Oud Imperial",
      inspired: "Inspired by MFK Oud Satin Mood",
      stars: 5,
      quote: "Opulent, velvety, and deeply intoxicating. One spray on my coat lasted for three days. Everyone at the evening reception asked what fragrance I was wearing.",
      name: "Nabila Z.",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
      longevity: "16+ Hours",
      projection: "Heavy Trail",
      compliments: "★ 10/10 Compliments",
    },
    {
      perfume: "Amber Elixir 10",
      inspired: "Inspired by Kilian Angels' Share",
      stars: 5,
      quote: "Warm cognac, cinnamon, and aged oak barrel notes blended to absolute perfection. It has a rich gourmand warmth that feels extraordinarily expensive.",
      name: "Shahriar H.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      longevity: "12+ Hours",
      projection: "Enveloping Sillage",
      compliments: "★ 9.9/10 Compliments",
    },
    {
      perfume: "Royal Santal 33",
      inspired: "Inspired by Le Labo Santal 33",
      stars: 5,
      quote: "The smoothest sandalwood and cardamom profile I have ever smelled. Remarkable quality and craftsmanship at a fraction of niche retail pricing.",
      name: "Mahmud A.",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
      longevity: "11+ Hours",
      projection: "Moderate Sillage",
      compliments: "★ 9.6/10 Compliments",
    },
    {
      perfume: "Saffron Leather",
      inspired: "Inspired by Memo Paris African Leather",
      stars: 5,
      quote: "Rich spicy saffron with supple leather notes. It gives an undeniable aura of confidence and sophistication. Easily a signature winter scent.",
      name: "Zaynab M.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      longevity: "13+ Hours",
      projection: "Strong Sillage",
      compliments: "★ 9.8/10 Compliments",
    },
    {
      perfume: "Hellenist",
      inspired: "Inspired by Baccarat Rouge 540",
      stars: 5,
      quote: "Sensual Turkish rose and lychee with a creamy cashmere finish. I receive compliments every single time I step out wearing this.",
      name: "Ayesha N.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      longevity: "14+ Hours",
      projection: "Radiant Aura",
      compliments: "★ 9.9/10 Compliments",
    }
  ];

  for (const r of reviewsData) {
    const product = dbProducts.find(p => p.name === r.perfume);
    if (product) {
      await prisma.review.create({
        data: {
          productId: product.id,
          name: r.name,
          avatar: r.avatar,
          stars: r.stars,
          quote: r.quote,
          longevity: r.longevity,
          projection: r.projection,
          compliments: r.compliments,
          isApproved: true
        }
      });
    }
  }

  // 6. Create Site Content
  console.log('Creating Site Content...');
  const brandTickerList = [
    "Dior Sauvage", "Bleu de Chanel", "Creed Aventus", "Versace Eros", "YSL Y Eau de Parfum",
    "Giorgio Armani Stronger With You", "Tom Ford Oud Wood", "Tom Ford Tobacco Vanille", "Acqua di Gio Profumo",
    "Parfums de Marly Layton", "Baccarat Rouge 540", "Louis Vuitton Imagination", "Louis Vuitton Afternoon Swim",
    "Chanel Allure Homme Sport", "Dior Homme Intense", "Jean Paul Gaultier Le Male Le Parfum", "Jean Paul Gaultier Ultra Male",
    "Xerjoff Erba Pura", "Nishane Hacivat", "Mancera Cedrat Boise", "Initio Side Effect", "Maison Margiela Jazz Club",
    "Maison Margiela By the Fireplace", "Tom Ford Lost Cherry", "Carolina Herrera 212 VIP Black", "Carolina Herrera Good Girl",
    "YSL Libre Intense", "Chanel Coco Mademoiselle", "Delina Exclusif", "Gucci Bloom"
  ];

  const differencePointsData = [
    { id: "iconic", title: "Inspired by Iconic Fragrances", desc: "Carefully matching the scent profile of history's most renowned creations, bringing premium luxury within reach.", iconType: "globe" },
    { id: "ingredients", title: "Premium Ingredients", desc: "Formulated using only high-grade, responsibly sourced essential oils and fine raw aromatics from across the globe.", iconType: "leaf" },
    { id: "performance", title: "Long Lasting Performance", desc: "Formulated as high-concentration Extraits de Parfum to ensure outstanding projection, sillage, and all-day longevity.", iconType: "clock" },
    { id: "craftsmanship", title: "Crafted with Care", desc: "Each bottle is hand-poured, quality-checked, and packaged in small batches to preserve consistency and olfactory purity.", iconType: "arrow" }
  ];

  const occasionsData = [
    { id: "office", name: "Office", link: "/shop?occasion=Formal", image: "/images/occasions/office.png" },
    { id: "daily", name: "Daily Wear", link: "/shop?occasion=Daily+Wear", image: "/images/occasions/daily.png" },
    { id: "date_night", name: "Date Night", link: "/shop?occasion=Date+Night", image: "/images/occasions/date_night.png" },
    { id: "wedding", name: "Wedding", link: "/shop?occasion=Formal", image: "/images/occasions/wedding.png" },
    { id: "summer", name: "Summer", link: "/shop?family=Citrus,Fresh", image: "/images/occasions/summer.png" },
    { id: "winter", name: "Winter", link: "/shop?family=Woody,Oriental", image: "/images/occasions/winter.png" }
  ];

  const ourStoryData = {
    creator: {
      headingLine1: "The Creator:", headingLine2: "Eliyash Hossain",
      paragraph: "Murakkaz was never built to be a mass-market commercial brand. It is a lifelong devotion to authentic perfumery, international artistry, and a community of true fragrance connoisseurs.",
      buttonText: "Scroll Down", image: "/images/events/eliyas.jpg", imageAlt: "Eliyash Hossain - The Creator of Murakkaz"
    },
    journeySections: [
      { id: "journey-heading", topNode: null, middleNode: "01", bottomNode: "02", isHeading: true, headingLine1: "Journey For The Love Of", headingLine2: "Fragrance" },
      { id: "journey-story-1", topNode: "01", middleNode: "02", bottomNode: "03", text: "Our journey began in late 2003 in Riyadh, Saudi Arabia, under the direct mentorship of Shaykh Abdur Rahman Al Humaid at Al Farooq. Spending over nine months learning the science of raw fragrance DNA, note profiling, and botanical harmony, the foundation of true perfume making was laid." },
      { id: "journey-story-2", topNode: "02", middleNode: "03", bottomNode: "04", text: "After showcasing creations at the Riyadh Chamber of Commerce and International Fairs, this passion led to specialized training in Catalonia in 2006, refining the technical precision of fine fragrance formulation." },
      { id: "journey-story-3", topNode: "03", middleNode: "04", bottomNode: "05", text: "Returning to Bangladesh in 2017, it became clear that standard commercial mass-market fragrances were failing to survive the local humidity. Authentic, handcrafted perfumery was virtually non-existent." },
      { id: "journey-story-4", topNode: "04", middleNode: "05", bottomNode: null, text: "Driven by friends and close circles, small private displays at personal gatherings instantly resonated. But to maintain uncompromising luxury, a strict policy was set: every single raw material would be imported directly from international sources, refusing to dilute the art with compromised local ingredients." }
    ],
    mediaMentions: { heading: "Trust Signals & Media Mentions", subheading: "Recognized Taste & Community Authority", videoUrl: "", posterImage: "/images/events/eliyas.jpg" },
    behindBrand: {
      heading: "Behind The Brand",
      cards: [
        { number: "01", title: "Sourced Globally, Mastered Locally", desc: "We source high-grade perfume oils from traditional European glasshouses, re-architecting them to retain strong projection and beast-mode longevity tailored for our local landscape." },
        { number: "02", title: "The Founder's Seal", desc: "Not a single bottle leaves our facility without my personal sensory audit. If a batch doesn't earn heads or last through the day, it doesn't get the Murakkaz label." },
        { number: "03", title: "Honest Premium Pricing", desc: "We source high-grade perfume oils from traditional European glasshouses, re-architecting them to retain strong projection and beast-mode longevity tailored for our local landscape." }
      ],
      footerText: "No Compromises. No Shortcuts. Just Pure Luxury."
    },
    awards: {
      heading: "Award Winning Collections",
      tabs: [
        { id: "sme", title: "Midas SME & Rajshahi Award", description: "A foundational milestone in our brand's journey came through the recognition by Midas SME and the prestigious Rajshahi SME Fair award...", image: "/images/events/eliyas.jpg" },
        { id: "brac", title: "BRAC University Accolades", description: "Recognized for artisanal excellence and entrepreneurial innovation during the BRAC University National Youth Entrepreneurship Showcase, establishing Murakkaz as a pioneering fragrance house.", image: "/images/events/eliyas.jpg" },
        { id: "nsu", title: "North South University Honor", description: "Awarded by North South University's School of Business & Economics for excellence in local manufacturing, brand authenticity, and luxury fragrance formulation.", image: "/images/events/eliyas.jpg" }
      ]
    },
    gallery: { heading: "Event Gallery", paragraph: "Luxury is personal, and I love meeting our community face-to-face. From elite fashion exhibitions to exclusive perfumer meetups across Bangladesh, we bring the sensory experience directly to you. See our current store locations, live bottle-painting workshops, and past interactions.", buttonText: "Explore More", buttonLink: "/events" }
  };

  await prisma.siteContent.createMany({
    data: [
      { key: 'brand_ticker', value: brandTickerList },
      { key: 'difference_points', value: differencePointsData },
      { key: 'occasions', value: occasionsData },
      { key: 'our_story', value: ourStoryData }
    ]
  });

  // 7. Create Blog Posts
  console.log('Creating Blog Posts...');
  const blogPostsData = [
    { slug: "art-of-slow-living", title: "The Art of Slow Living & Minimalist Design", description: "In a fast-paced world, designing spaces and routines around intentionality brings clarity. We explore how minimalist design and heritage elements combine to create serene, thoughtful environments.", image: "/images/events/sadid.jpg", isPublished: true, publishedAt: new Date("2026-05-18") },
    { slug: "value-of-heritage-craftsmanship", title: "Creation & The Value of Heritage Craftsmanship", description: "Craftsmanship is the preservation of time and skill. By focusing on handmade details and local materials, we honor the legacy of creators who define premium design.", image: "/images/events/sadid.jpg", isPublished: true, publishedAt: new Date("2026-05-16") },
    { slug: "aesthetic-harmony", title: "Aesthetic Harmony in Modern Living Spaces", description: "Aesthetically rich spaces require a careful balance of textures, lighting, and placement. Discover the key principles of creating layouts that inspire and soothe the mind.", image: "/images/events/sadid.jpg", isPublished: true, publishedAt: new Date("2026-05-15") }
  ];

  for (const post of blogPostsData) {
    await prisma.blogPost.create({ data: { ...post, authorId: adminUser.id } });
  }

  // 8. Create Events
  console.log('Creating Events...');
  await prisma.event.createMany({
    data: [
      { slug: "scent-journey-masterclass", title: "Scent Journey Masterclass", description: "Join us for an exclusive workshop on finding your perfect signature scent.", image: "/images/events/event1.jpg", day: "15", month: "June", time: "4:00 PM - 7:00 PM", location: "Banani, Dhaka", eventDate: new Date("2026-06-15T16:00:00Z"), isUpcoming: true },
      { slug: "summer-collection-launch", title: "Summer Collection Launch", description: "Be the first to experience our new lightweight, long-lasting summer extraits.", image: "/images/events/event2.jpg", day: "22", month: "July", time: "5:00 PM - 9:00 PM", location: "Dhanmondi, Dhaka", eventDate: new Date("2026-07-22T17:00:00Z"), isUpcoming: true },
      { slug: "bespoke-perfumery-workshop", title: "Bespoke Perfumery Workshop", description: "Learn the art of blending top, middle, and base notes from our master perfumer.", image: "/images/events/event3.jpg", day: "10", month: "August", time: "3:00 PM - 6:00 PM", location: "Gulshan, Dhaka", eventDate: new Date("2026-08-10T15:00:00Z"), isUpcoming: true }
    ]
  });

  // 9. Create Store Locations
  console.log('Creating Store Locations...');
  await prisma.storeLocation.createMany({
    data: [
      { address: "Banani Superstore, Block D, Road 11, Banani, Dhaka", zone: "North Dhaka", contract: "01711223344" },
      { address: "Dhanmondi Branch, Road 27, Dhanmondi, Dhaka", zone: "South Dhaka", contract: "01755667788" },
      { address: "Gulshan Avenue Flagship, Gulshan 1, Dhaka", zone: "North Dhaka", contract: "01799887766" }
    ]
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
