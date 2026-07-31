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
  events: [] as any[],
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
