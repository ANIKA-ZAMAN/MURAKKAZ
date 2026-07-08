// Mock data for Events page — replace with real content later

export interface UpcomingEvent {
  day: string;
  month: string;
  title: string;
  location: string;
  daysLeft: string;
  time: string;
  description: string;
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
}

export interface StoreLocation {
  name: string;
  address: string;
  phone: string;
}

export const upcomingEvents: UpcomingEvent[] = [
  {
    day: "05",
    month: "July",
    title: "We Are  Going To NSU Again",
    location: "At NSU Library",
    daysLeft: "12 days left",
    time: "From 6 AM\nTo 17 AM",
    description:
      "We are heading back to NSU! After last event\u2019s massive response, we are bringing an exclusive lineup of our best-sellers and new summer drops right to the campus gallery. Stop by to test our signature line, meet the team, and grab your bottle before stocks run out.",
  },
  {
    day: "11",
    month: "July",
    title: "We Are Going To BRACU Again",
    location: "At BRACU Library",
    daysLeft: "18 days left",
    time: "From 6 AM\nTo 17 AM",
    description:
      "BRACU, we are coming for you next! We are setting up our interactive fragrance booth right outside the library zone. Come experience our long-lasting formulations in person and pick up your favorite 2ml/5ml sample vials to test our beast-mode sillage free.",
  },
  {
    day: "05",
    month: "July",
    title: "International Convention City Bashundhara (ICCB)",
    location: "At Pavilion 3, Stall B4",
    daysLeft: "11 days left",
    time: "From 6 AM\nTo 17 AM",
    description:
      "Murakkaz is taking over ICCB! We are architecting a premium fragrance experience at Pavilion 3, Stall B4. Join us to explore our highest-performing evening scents and enjoy an exclusive meet-and-greet window with the Founder every single evening. Don\u2019t miss out!",
  },
];

export const previousEvents: PreviousEvent[] = [
  {
    title: "Dhaka Fragrance Expo 2025",
    date: "March 15, 2025",
    image: "/images/events/prev_1.jpg",
    category: "Expo",
  },
  {
    title: "Dubai Premiere Show Lounge",
    date: "January 20, 2025",
    image: "/images/events/prev_2.jpg",
    category: "Premiere",
  },
  {
    title: "Annual Awards Ceremony",
    date: "December 5, 2024",
    image: "/images/events/prev_3.jpg",
    category: "Awards",
  },
  {
    title: "Community Meetup Chittagong",
    date: "October 18, 2024",
    image: "/images/events/prev_4.jpg",
    category: "Meetup",
  },
];

export const galleryImages: GalleryImage[] = [
  { src: "/images/events/gallery_1.jpg", alt: "Event gallery photo 1" },
  { src: "/images/events/gallery_2.jpg", alt: "Event gallery photo 2" },
  { src: "/images/events/gallery_3.jpg", alt: "Event gallery photo 3" },
  { src: "/images/events/gallery_4.jpg", alt: "Event gallery photo 4" },
  { src: "/images/events/gallery_5.jpg", alt: "Event gallery photo 5" },
  { src: "/images/events/gallery_6.jpg", alt: "Event gallery photo 6" },
];

export const storeLocations: StoreLocation[] = [
  {
    name: "Murakkaz Dhaka Flagship",
    address: "House 42, Road 11, Block E, Bashundhara R/A, Dhaka - 1229",
    phone: "+880 1234-567890",
  },
  {
    name: "Murakkaz Chittagong",
    address: "Level 4, GEC More, Agrabad Commercial Area, Chittagong, BD - 4100",
    phone: "+880 9876-543210",
  },
  {
    name: "Murakkaz Sylhet Outlet",
    address: "Jail Road, Zindabazar, Opposite City Center, Sylhet, BD - 3100",
    phone: "+880 1122-334455",
  },
];
