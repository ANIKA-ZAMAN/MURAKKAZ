export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  story: string;
  isCustomizable: boolean;
  basePrice: number;
  collectionId?: string;
  isFeatured: boolean;
  inStock: boolean;
  images: string[];
  sizes: ProductSize[];
  notes: ProductNote[];
  accords: ProductAccord[];
  bestFor: ProductBestFor[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductSize {
  id: string;
  productId: string;
  size: string; // e.g., '12ml', '50ml'
  price: number;
  stock: number;
}

export interface ProductNote {
  id: string;
  productId: string;
  note: string;
  type: 'TOP' | 'HEART' | 'BASE';
}

export interface ProductAccord {
  id: string;
  productId: string;
  name: string;
  value: number; // percentage or weight (0-100)
}

export interface ProductBestFor {
  id: string;
  productId: string;
  tag: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  items: OrderItem[];
  payment?: Payment;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productSizeId: string;
  quantity: number;
  price: number;
}

export interface Payment {
  id: string;
  orderId: string;
  method: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventReminder {
  id: string;
  eventId: string;
  userId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeProducts: number;
  totalCustomers: number;
  recentOrders: Order[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
