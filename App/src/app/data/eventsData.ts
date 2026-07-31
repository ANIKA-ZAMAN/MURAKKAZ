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

export const upcomingEvents: UpcomingEvent[] = [
  {
    day: "15",
    month: "AUG",
    title: "Live Olfactory Atelier & Scent Blending",
    location: "Gulshan Club, Dhaka",
    daysLeft: "14 DAYS LEFT",
    time: "4:00 PM - 9:00 PM",
    description: "An exclusive hands-on fragrance workshop showcasing rare oriental accord extractions and custom scent blending.",
    image: "/images/events/sadid.jpg",
  },
  {
    day: "28",
    month: "AUG",
    title: "Autumn Private Fragrance Gala",
    location: "Radisson Blu, Dhaka",
    daysLeft: "27 DAYS LEFT",
    time: "6:00 PM - 11:00 PM",
    description: "Unveiling our autumn reserve collection featuring rare aged Cambodian Oud and pure Bulgarian Rose extracts.",
    image: "/images/events/eliyas.jpg",
  },
  {
    day: "10",
    month: "SEP",
    title: "Murakkaz Heritage Boutique Launch",
    location: "Banani 11, Dhaka",
    daysLeft: "40 DAYS LEFT",
    time: "3:00 PM - 10:00 PM",
    description: "Celebrate the opening of our flagship luxury sensory boutique with complimentary bespoke scent consultations.",
    image: "/images/occasions/wedding.png",
  },
];

export const previousEvents: PreviousEvent[] = [
  {
    title: "Live Olfactory Station",
    date: "Jan 15, 2025",
    image: "/images/events/sadid.jpg",
    category: "Exhibition",
  },
  {
    title: "Luxury Pop-up Stall",
    date: "Dec 20, 2024",
    image: "/images/events/eliyas.jpg",
    category: "Pop-up",
  },
];

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
    id: "gulshan",
    address: "Road 11, House 42, Block D, Banani, Dhaka",
    zone: "Banani Boutique",
    contract: "+880 1711-000000",
  },
  {
    id: "dhanmondi",
    address: "Shimanto Square, Level 2, Dhanmondi, Dhaka",
    zone: "Dhanmondi Gallery",
    contract: "+880 1711-111111",
  },
];
