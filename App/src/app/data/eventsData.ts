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
    day: "05",
    month: "July",
    title: "We Are Going To NSU Again",
    location: "At NSU Library",
    daysLeft: "12 days left",
    time: "From 8.00\nTo 17.00",
    description: "We are heading back to NSU! After last event's massive response, we are bringing an exclusive lineup of our best-sellers and new summer drops right to the campus gallery. Stop by to test our signatures live, meet the team, and grab your bottle before stocks run out.",
    image: "/images/events/sadid.jpg",
  },
  {
    day: "11",
    month: "July",
    title: "We Are Going To BRACU Again",
    location: "At BRACU Library",
    daysLeft: "25 days left",
    time: "From 8.00\nTo 17.00",
    description: "BRACU, we are coming for you next! We are setting up our interactive fragrance booth right outside the library zone. Come experience our long-lasting formulations in person and pick up your favorite 2ml/5ml sample vials to test our beast-mode sillage live.",
    image: "/images/events/eliyas.jpg",
  },
  {
    day: "05",
    month: "July",
    title: "International Convention City Bashundhara (ICCB)",
    location: "At Pavilion 3, Stall B4",
    daysLeft: "12 days left",
    time: "From 8.00\nTo 17.00",
    description: "Murakkaz is taking over ICCB! We are architecting a premium fragrance experience at Pavilion 3, Stall B4. Join us to explore our highest-performing evening scents and enjoy an exclusive meet-and-greet window with the founder every single evening. Don't miss out!",
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
