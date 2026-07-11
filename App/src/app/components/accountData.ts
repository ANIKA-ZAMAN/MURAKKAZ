export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderItem[];
  total: string;
  trackingNumber?: string;
}

export interface Address {
  fullName: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface UserProfile {
  name: string;
  email: string;
  memberSince: string;
  memberTier: string;
  points: number;
}

export const mockUserProfile: UserProfile = {
  name: "Sadid Chowdhury",
  email: "sadid@murakkaz.com",
  memberSince: "November 2025",
  memberTier: "Gold Collection Circle",
  points: 1250,
};

export const mockOrders: Order[] = [
  {
    id: "MR-7301",
    date: "July 04, 2026",
    status: "Shipped",
    total: "3,350tk",
    trackingNumber: "TRK-98319082",
    items: [
      {
        id: "fav-1",
        name: "Jade Serenity",
        image: "/images/products/jade_serenity.png",
        price: "1,720tk",
        quantity: 1,
      },
      {
        id: "fav-2",
        name: "Orvi Soq",
        image: "/images/products/coral_sea.png",
        price: "1,630tk",
        quantity: 1,
      },
    ],
  },
  {
    id: "MR-6821",
    date: "May 18, 2026",
    status: "Delivered",
    total: "2,200tk",
    items: [
      {
        id: "fav-4",
        name: "Hellenist",
        image: "/images/products/hellenist.png",
        price: "2,200tk",
        quantity: 1,
      },
    ],
  },
  {
    id: "MR-5591",
    date: "Feb 10, 2026",
    status: "Delivered",
    total: "3,650tk",
    items: [
      {
        id: "fav-3",
        name: "Mageration",
        image: "/images/products/magnetism.png",
        price: "1,210tk",
        quantity: 3,
      },
    ],
  },
];

export const mockAddresses: { shipping: Address; billing: Address } = {
  shipping: {
    fullName: "Sadid Chowdhury",
    company: "Murakkaz Labs",
    street: "12 Gulshan Avenue, Road 3",
    city: "Dhaka",
    state: "Dhaka Division",
    zipCode: "1212",
    country: "Bangladesh",
    phone: "+880 1712-345678",
  },
  billing: {
    fullName: "Sadid Chowdhury",
    street: "12 Gulshan Avenue, Road 3",
    city: "Dhaka",
    state: "Dhaka Division",
    zipCode: "1212",
    country: "Bangladesh",
    phone: "+880 1712-345678",
  },
};
