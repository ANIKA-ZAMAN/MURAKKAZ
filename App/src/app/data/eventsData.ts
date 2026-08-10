export interface UpcomingEvent {
  id?: string;
  slug?: string;
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
  id?: string;
  slug?: string;
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

const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:5000/api";
    }
    return "https://api.murakkaz.com/api";
  }
  return "https://api.murakkaz.com/api";
};

export const fetchLiveEvents = async (upcoming?: boolean): Promise<{ upcoming: UpcomingEvent[]; previous: PreviousEvent[] }> => {
  try {
    const query = upcoming !== undefined ? `?upcoming=${upcoming}` : "";
    const res = await fetch(`${getApiBaseUrl()}/events${query}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch events from backend");
    const json = await res.json();
    const data = json.data || json;

    if (!Array.isArray(data) || data.length === 0) {
      return { upcoming: upcomingEvents, previous: previousEvents };
    }

    const fetchedUpcoming: UpcomingEvent[] = [];
    const fetchedPrevious: PreviousEvent[] = [];

    data.forEach((evt: any) => {
      const evtDate = evt.eventDate ? new Date(evt.eventDate) : new Date();
      const diffMs = evtDate.getTime() - Date.now();
      const calcDaysLeft = diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0;
      const daysLeftStr = evt.daysLeft !== null && evt.daysLeft !== undefined
        ? `${evt.daysLeft} days left`
        : `${calcDaysLeft} days left`;

      const monthName = evt.month || evtDate.toLocaleString("en-US", { month: "short" });
      const dayNum = evt.day || String(evtDate.getDate()).padStart(2, "0");

      if (evt.isUpcoming ?? true) {
        fetchedUpcoming.push({
          id: evt.id,
          slug: evt.slug || evt.id,
          day: dayNum,
          month: monthName,
          title: evt.title,
          location: evt.location || "Dhaka Flagship Store",
          daysLeft: daysLeftStr,
          time: evt.time || "From 10.00 to 20.00",
          description: evt.description || "Exclusive Murakkaz fragrance event.",
          image: evt.image || "/images/events/sadid.jpg",
        });
      } else {
        fetchedPrevious.push({
          id: evt.id,
          slug: evt.slug || evt.id,
          title: evt.title,
          date: `${monthName} ${dayNum}, ${evtDate.getFullYear()}`,
          image: evt.image || "/images/events/sadid.jpg",
          category: evt.category || "Exhibition",
        });
      }
    });

    return {
      upcoming: fetchedUpcoming,
      previous: fetchedPrevious,
    };
  } catch (err) {
    console.error("Error fetching live events:", err);
    return { upcoming: [], previous: [] };
  }
};

export const upcomingEvents: UpcomingEvent[] = [];
export const previousEvents: PreviousEvent[] = [];

export const galleryImages: GalleryImage[] = [
  {
    src: "/images/events/sadid.jpg",
    alt: "Live Olfactory Station",
    title: "Live Olfactory Station",
    category: "EXHIBITION",
    date: "Jan 15, 2025",
    location: "Dhaka Club, Gulshan",
    accentColor: "#ded6c9",
  },
  {
    src: "/images/events/eliyas.jpg",
    alt: "Luxury Pop-up Stall",
    title: "Luxury Pop-up Stall",
    category: "POP-UP",
    date: "Dec 20, 2024",
    location: "Banani 11, Dhaka",
    accentColor: "#d6cebf",
  },
  {
    src: "/images/occasions/wedding.png",
    alt: "Autumn Scent Soirée",
    title: "Autumn Scent Soirée",
    category: "GALA",
    date: "Nov 12, 2024",
    location: "Radisson Blu, Dhaka",
    accentColor: "#ded6c9",
  },
  {
    src: "/images/products/jade_serenity.png",
    alt: "Private Masterclass",
    title: "Private Masterclass",
    category: "WORKSHOP",
    date: "Oct 05, 2024",
    location: "NSU Campus, Dhaka",
    accentColor: "#d6cebf",
  },
];

export const storeLocations: StoreLocation[] = [
  {
    id: "01",
    address: "House 45, Road 11, Block H, Banani, Dhaka - 1213",
    zone: "Dhaka, Banani",
    contract: "01735.....49",
  },
  {
    id: "02",
    address: "Level 3, Shimanto Square, Dhanmondi, Dhaka - 1209",
    zone: "Dhaka, Dhanmondi",
    contract: "01745.....59",
  },
  {
    id: "03",
    address: "GEC Circle, Central Shopping Arcade, Level 1, Chattogram - 4000",
    zone: "Chattogram, Nasirabad",
    contract: "01765.....89",
  },
  {
    id: "04",
    address: "Jamuna Future Park, Level 1, Shop 04B, Bashundhara, Dhaka - 1229",
    zone: "Dhaka, Bashundhara",
    contract: "01785.....99",
  },
];
