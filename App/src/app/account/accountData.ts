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

export interface SavedAddressItem {
  id: string;
  indexStr: string;
  nickname: string;
  firstName: string;
  lastName: string;
  fullAddress: string;
  phone: string;
  city: string;
  district: string;
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

export const mockUserProfile: UserProfile | null = null;
export const mockSavedAddresses: SavedAddressItem[] = [];
export const mockOrders: Order[] = [];

export const mockAddresses: { shipping: Address; billing: Address } = {
  shipping: {
    fullName: "",
    company: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",
    phone: "",
  },
  billing: {
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",
    phone: "",
  },
};
