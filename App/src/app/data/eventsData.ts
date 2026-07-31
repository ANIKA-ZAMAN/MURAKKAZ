export interface UpcomingEvent {
  day: string;
  month: string;
  title: string;
  location: string;
  daysLeft: string;
  time: string;
  description: string;
  image: string;
}

export interface PreviousEvent {
  title: string;
  date: string;
  image: string;
  category: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  category?: string;
  date?: string;
  location?: string;
  accentColor?: string;
}

export interface StoreLocation {
  id: string;
  address: string;
  zone: string;
  contract: string;
}

export const upcomingEvents: UpcomingEvent[] = [];
export const previousEvents: PreviousEvent[] = [];

export const galleryImages: GalleryImage[] = [
  {
    src: "/images/events/sadid.jpg",
    alt: "Live Olfactory Blending Station",
    title: "Live Olfactory Station",
    category: "Exhibition",
    date: "Jan 15, 2025",
    location: "Dhaka Club, Gulshan",
    accentColor: "#ded6c9",
  },
  {
    src: "/images/events/eliyas.jpg",
    alt: "Luxury Pop-up Stall Banani",
    title: "Luxury Pop-up Stall",
    category: "Pop-up",
    date: "Dec 20, 2024",
    location: "Banani 11, Dhaka",
    accentColor: "#d6cebf",
  }
];

export const storeLocations: StoreLocation[] = [
  {
    id: "01",
    address: "House 45, Road 11, Block H, Banani, Dhaka - 1213",
    zone: "Dhaka, Banani",
    contract: "+880 1735-494949",
  }
];
