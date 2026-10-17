import fs from 'fs';
import path from 'path';
import prisma from '../config/database';

const DATA_DIR = path.join(__dirname, '../../data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const BLOGS_FILE = path.join(DATA_DIR, 'blogs.json');

// Helper to ensure data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// Helper to load products from disk
const loadProductsFromDisk = (): any[] => {
  try {
    ensureDataDir();
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Could not read products from disk:', e);
  }
  return [];
};

// Helper to save products to disk
export const saveProductsToDisk = (products: any[]) => {
  try {
    ensureDataDir();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not save products to disk:', e);
  }
};

// Helper to load blog posts from disk
const loadBlogsFromDisk = (): any[] => {
  try {
    ensureDataDir();
    if (fs.existsSync(BLOGS_FILE)) {
      const data = fs.readFileSync(BLOGS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Could not read blog posts from disk:', e);
  }
  return [];
};

// Helper to save blog posts to disk
export const saveBlogsToDisk = (blogs: any[]) => {
  try {
    ensureDataDir();
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not save blog posts to disk:', e);
  }
};

// In-Memory & File-Backed Dynamic Store
export const dbStore = {
  products: loadProductsFromDisk(),
  blogPosts: loadBlogsFromDisk(),
  events: [
    {
      id: 'cmue-nsu-yes-oct-2026',
      slug: 'murakkaz-coming-to-nsu-yes-club',
      title: 'Murakkaz Coming to NSU — YES! Club Exhibition',
      description: `Murakkaz is coming to North South University (NSU)!

Organized in collaboration with the Young Entrepreneurs Society (YES! Club), we warmly invite all students, faculty members, and perfume enthusiasts across Dhaka to experience our signature collection of extra pure, long-lasting luxury perfumes.

Explore crowd-favourite masterpieces inspired by world-renowned perfume houses—including Poison Girl, Montale (Arabians Tonka & Roses Musk), YSL Libre & MYSLF, Tom Ford Vanille Fatale, Miss Dior, 212 VIP Men, Kilian, KAYALI, and Burberry Her. Handcrafted with premium, high-concentration fragrance oils to ensure rich projection and all-day longevity.

Enjoy complimentary fragrance testing, personalized scent consultations, and exclusive campus student discounts!

Event Details:
• Dates: October 24th – 26th, 2026
• Timing: 9:00 AM – 6:00 PM Daily
• Venue: North South University (NSU), Plot # 15, Block # B, Bashundhara R/A, Dhaka
• Host / Partner: Young Entrepreneurs Society (YES! Club)
• Inquiries & Hotline: 01997-807701
• Official Website: www.murakkaz.com`,
      image: '/images/events/murakkaz_nsu_yes_october_2026.png',
      images: [
        '/images/events/murakkaz_nsu_yes_october_2026.png',
        '/images/events/nsu_booth_proposal.png',
        '/images/events/nsu_mou_agreement.png',
      ],
      galleryImages: [
        {
          id: 'nsu-img-1',
          src: '/images/events/murakkaz_nsu_yes_october_2026.png',
          alt: 'Murakkaz Coming to NSU — Event Poster (24-26 Oct)',
        },
        {
          id: 'nsu-img-2',
          src: '/images/events/nsu_booth_proposal.png',
          alt: 'YES! Booth Partnership Proposal',
        },
        {
          id: 'nsu-img-3',
          src: '/images/events/nsu_mou_agreement.png',
          alt: 'Memorandum of Understanding (MoU) — Signed Partnership Agreement',
        },
      ],
      day: '24',
      month: 'OCT',
      time: '9:00 AM - 6:00 PM',
      location: 'North South University (NSU), Bashundhara R/A, Dhaka',
      daysLeft: 6,
      eventDate: new Date('2026-10-24T09:00:00.000Z'),
      category: 'Campus Exhibition',
      isUpcoming: true,
      remindersCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'cmub2r3no0flajjhkxybs1i56',
      slug: 'murakkaz-at-ronginee-exhibition-midas-centre',
      title: 'Murakkaz at Ronginee Exhibition — Midas Centre',
      description: 'Murakkaz at Ronginee Exhibition in Midas Centre, Dhanmondi 27, Dhaka.',
      image: '/images/events/ronginee_midas_exhibition.jpg',
      day: '09',
      month: 'OCT',
      time: '10:00 AM - 8:00 PM',
      location: 'Midas Centre, Dhanmondi 27, Dhaka',
      daysLeft: 0,
      eventDate: new Date('2026-10-09T10:00:00.000Z'),
      category: 'Exhibition',
      isUpcoming: false,
      remindersCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ] as any[],
  stores: [
    {
      id: '01',
      name: 'Banani Flagship Atelier',
      address: 'House 45, Road 11, Block H, Banani, Dhaka - 1213',
      zone: 'Dhaka, Banani',
      contract: '+880 1735-494949',
      hours: '10:00 AM - 9:00 PM Daily'
    }
  ],
  reviews: [] as any[]
};

export async function safeDbCall<T>(dbOperation: () => Promise<T>, fallbackData: () => T | Promise<T>): Promise<T> {
  try {
    return await dbOperation();
  } catch (error) {
    return await fallbackData();
  }
}
