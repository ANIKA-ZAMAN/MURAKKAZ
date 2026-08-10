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
    return `${window.location.origin}/api`;
  }
  return "http://localhost:5000/api";
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
      upcoming: fetchedUpcoming.length > 0 ? fetchedUpcoming : upcomingEvents,
      previous: fetchedPrevious.length > 0 ? fetchedPrevious : previousEvents,
    };
  } catch (err) {
    console.error("Error fetching live events:", err);
    return { upcoming: upcomingEvents, previous: previousEvents };
  }
};

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
  {
    title: "Autumn Scent Soirée",
    date: "Nov 12, 2024",
    image: "/images/occasions/wedding.png",
    category: "Gala",
  },
  {
    title: "Private Masterclass",
    date: "Oct 05, 2024",
    image: "/images/products/jade_serenity.png",
    category: "Workshop",
  },
];

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
