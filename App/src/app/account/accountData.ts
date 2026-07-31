export interface OrderItem {
  id: string;
  name: string;
  inspiredBy?: string;
  volume?: string;
  image: string;
  price: string;
  quantity: number;
}

export interface Order {
  id: string;
  date?: string;
  status: "On Delivery" | "Confirmed" | "Arrived" | "To Review" | "Canceled";
  estimatedArrival?: string;
  addressLabel?: string;
  deliveryCharge: string;
  total: string;
  category: "shipping" | "arrived" | "review" | "canceled";
  items: OrderItem[];
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
  photo?: string;
  phone?: string;
  primaryLocation?: string;
}

export const mockUserProfile: UserProfile = {
  name: "Sadid Bin Hasan",
  email: "sadidbinhasan@gmail.com",
  memberSince: "November 2025",
  memberTier: "Gold Collection Circle",
  points: 1250,
  photo: "/images/events/sadid.jpg",
  phone: "0178900****",
  primaryLocation: "Dhanmondi***",
};

export const mockOrders: Order[] = [
  {
    id: "CTB-017585",
    status: "On Delivery",
    estimatedArrival: "28July 2026",
    addressLabel: "Address no 1",
    deliveryCharge: "120tk",
    total: "2,940tk",
    category: "shipping",
    items: [
      {
        id: "item-1",
        name: "Jade Serenity",
        inspiredBy: "Inspired by Dio Savotage",
        volume: "5ml",
        image: "/images/products/jade_serenity.png",
        price: "1,720",
        quantity: 1,
      },
      {
        id: "item-2",
        name: "Mageration",
        inspiredBy: "Inspired by Dio Savotage",
        volume: "5ml",
        image: "/images/products/magnetism.png",
        price: "1,210",
        quantity: 1,
      },
    ],
  },
  {
    id: "CTB-017586",
    status: "Confirmed",
    estimatedArrival: "28July 2026",
    addressLabel: "Savar, Dhaka",
    deliveryCharge: "120tk",
    total: "2,940tk",
    category: "shipping",
    items: [
      {
        id: "item-3",
        name: "Jade Serenity",
        inspiredBy: "Inspired by Dio Savotage",
        volume: "5ml",
        image: "/images/products/jade_serenity.png",
        price: "1,720",
        quantity: 1,
      },
      {
        id: "item-4",
        name: "Mageration",
        inspiredBy: "Inspired by Dio Savotage",
        volume: "5ml",
        image: "/images/products/magnetism.png",
        price: "1,210",
        quantity: 1,
      },
    ],
  },
  {
    id: "CTB-017587",
    status: "On Delivery",
    estimatedArrival: "30July 2026",
    addressLabel: "Gulshan, Dhaka",
    deliveryCharge: "120tk",
    total: "3,350tk",
    category: "shipping",
    items: [
      {
        id: "item-5",
        name: "Baccarat Rouge 540",
        inspiredBy: "Inspired by Maison Francis Kurkdjian",
        volume: "6ml",
        image: "/images/products/baccarat_rouge_540.jpg",
        price: "1,850",
        quantity: 1,
      },
      {
        id: "item-6",
        name: "Tobacco Vanille",
        inspiredBy: "Inspired by Tom Ford",
        volume: "6ml",
        image: "/images/products/tobacco_vanille.jpg",
        price: "1,500",
        quantity: 1,
      },
    ],
  },
  {
    id: "CTB-017588",
    status: "On Delivery",
    estimatedArrival: "01August 2026",
    addressLabel: "Dhanmondi, Dhaka",
    deliveryCharge: "120tk",
    total: "1,800tk",
    category: "shipping",
    items: [
      {
        id: "item-7",
        name: "Irish Leather",
        inspiredBy: "Inspired by Memo Paris",
        volume: "6ml",
        image: "/images/products/irish_leather.jpg",
        price: "1,680",
        quantity: 1,
      },
    ],
  },
  {
    id: "CTB-017589",
    status: "On Delivery",
    estimatedArrival: "02August 2026",
    addressLabel: "Uttara, Dhaka",
    deliveryCharge: "120tk",
    total: "2,200tk",
    category: "shipping",
    items: [
      {
        id: "item-8",
        name: "Hellenist",
        inspiredBy: "Inspired by Ancient Hellenic",
        volume: "50ml",
        image: "/images/products/hellenist.png",
        price: "2,080",
        quantity: 1,
      },
    ],
  },
  {
    id: "CTB-016421",
    status: "Arrived",
    estimatedArrival: "15June 2026",
    addressLabel: "Banani, Dhaka",
    deliveryCharge: "120tk",
    total: "2,450tk",
    category: "arrived",
    items: [
      {
        id: "item-9",
        name: "Amber Gold",
        inspiredBy: "Inspired by Royal Amber",
        volume: "50ml",
        image: "/images/products/amber_gold.png",
        price: "2,330",
        quantity: 1,
      },
    ],
  },
  {
    id: "CTB-016422",
    status: "Arrived",
    estimatedArrival: "10June 2026",
    addressLabel: "Mirpur, Dhaka",
    deliveryCharge: "120tk",
    total: "3,100tk",
    category: "arrived",
    items: [
      {
        id: "item-10",
        name: "Coral Sea",
        inspiredBy: "Inspired by Fresh Ocean Breeze",
        volume: "50ml",
        image: "/images/products/coral_sea.png",
        price: "2,980",
        quantity: 1,
      },
    ],
  },
  {
    id: "CTB-015891",
    status: "Arrived",
    estimatedArrival: "01May 2026",
    addressLabel: "Address no 1",
    deliveryCharge: "120tk",
    total: "1,750tk",
    category: "review",
    items: [
      {
        id: "item-11",
        name: "By the Fireplace",
        inspiredBy: "Inspired by Maison Martin Margiela",
        volume: "6ml",
        image: "/images/products/by_the_fireplace.jpg",
        price: "1,630",
        quantity: 1,
      },
    ],
  },
  {
    id: "CTB-015892",
    status: "Arrived",
    estimatedArrival: "22April 2026",
    addressLabel: "Address no 1",
    deliveryCharge: "120tk",
    total: "1,950tk",
    category: "review",
    items: [
      {
        id: "item-12",
        name: "Rosewood",
        inspiredBy: "Inspired by Oriental Woods",
        volume: "6ml",
        image: "/images/products/rosewood.jpg",
        price: "1,830",
        quantity: 1,
      },
    ],
  },
  {
    id: "CTB-015893",
    status: "Arrived",
    estimatedArrival: "12April 2026",
    addressLabel: "Address no 1",
    deliveryCharge: "120tk",
    total: "2,100tk",
    category: "review",
    items: [
      {
        id: "item-13",
        name: "Resala",
        inspiredBy: "Inspired by Arabian Oud",
        volume: "6ml",
        image: "/images/products/resala.jpg",
        price: "1,980",
        quantity: 1,
      },
    ],
  },
  {
    id: "CTB-015894",
    status: "Arrived",
    estimatedArrival: "05April 2026",
    addressLabel: "Address no 1",
    deliveryCharge: "120tk",
    total: "2,600tk",
    category: "review",
    items: [
      {
        id: "item-14",
        name: "Sultani",
        inspiredBy: "Inspired by Royal Sultani",
        volume: "6ml",
        image: "/images/products/sultani.jpg",
        price: "2,480",
        quantity: 1,
      },
    ],
  },
  {
    id: "CTB-014310",
    status: "Canceled",
    estimatedArrival: "18March 2026",
    addressLabel: "Address no 1",
    deliveryCharge: "120tk",
    total: "1,450tk",
    category: "canceled",
    items: [
      {
        id: "item-15",
        name: "Guidance",
        inspiredBy: "Inspired by Amouage",
        volume: "6ml",
        image: "/images/products/guidance.jpg",
        price: "1,330",
        quantity: 1,
      },
    ],
  },
];

export const mockAddresses: { shipping: Address; billing: Address } = {
  shipping: {
    fullName: "Sadid Bin Hasan",
    company: "Murakkaz Labs",
    street: "12 Gulshan Avenue, Road 3",
    city: "Dhaka",
    state: "Dhaka Division",
    zipCode: "1212",
    country: "Bangladesh",
    phone: "+880 1712-345678",
  },
  billing: {
    fullName: "Sadid Bin Hasan",
    street: "12 Gulshan Avenue, Road 3",
    city: "Dhaka",
    state: "Dhaka Division",
    zipCode: "1212",
    country: "Bangladesh",
    phone: "+880 1712-345678",
  },
};
