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

let cachedEventsData: { upcoming: UpcomingEvent[]; previous: PreviousEvent[] } | null = null;

export const fetchLiveEvents = async (upcoming?: boolean): Promise<{ upcoming: UpcomingEvent[]; previous: PreviousEvent[] }> => {
  if (cachedEventsData) {
    return cachedEventsData;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);
    const query = upcoming !== undefined ? `?upcoming=${upcoming}` : "";
    const res = await fetch(`${getApiBaseUrl()}/events${query}`, { 
      signal: controller.signal,
      cache: "force-cache" 
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (res && res.ok) {
      const json = await res.json().catch(() => null);
      const data = json ? (json.data || json) : null;

      if (Array.isArray(data) && data.length > 0) {
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
              image: evt.image || "/images/events/event_gallery_1.jpg",
            });
          } else {
            fetchedPrevious.push({
              id: evt.id,
              slug: evt.slug || evt.id,
              title: evt.title,
              date: `${monthName} ${dayNum}, ${evtDate.getFullYear()}`,
              image: evt.image || "/images/events/event_gallery_1.jpg",
              category: evt.category || "Exhibition",
            });
          }
        });

        cachedEventsData = {
          upcoming: fetchedUpcoming,
          previous: fetchedPrevious,
        };
        return cachedEventsData;
      }
    }
  } catch {
    // Silent fallback to local static data
  }

  cachedEventsData = { upcoming: upcomingEvents, previous: previousEvents };
  return cachedEventsData;
};

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "upcoming-1",
    day: "",
    month: "",
    title: "NSU Campus Stall Showcase",
    location: "North South University, Dhaka",
    daysLeft: "",
    time: "",
    description: "An exclusive campus pop-up session showcasing Murakkaz artisanal extrait fragrances and live scent testing.",
    image: "/images/events/event_gallery_5.jpg",
  },
  {
    id: "upcoming-2",
    day: "",
    month: "",
    title: "Dhanmondi Fair Showcase",
    location: "Dhanmondi Fair, Dhaka",
    daysLeft: "",
    time: "",
    description: "Discover our private collection featuring warm amber, oud, and rare spices at Dhanmondi Fair.",
    image: "/images/events/event_gallery_3.jpg",
  },
  {
    id: "upcoming-3",
    day: "",
    month: "",
    title: "BRACU Customer Experience & Gifting",
    location: "BRAC University, Dhaka",
    daysLeft: "",
    time: "",
    description: "A sensory gathering featuring custom formulation, fragrance discovery, and exclusive gifting sets.",
    image: "/images/events/event_gallery_6.jpg",
  },
];
export const previousEvents: PreviousEvent[] = [
  {
    id: "prev-1",
    slug: "eid-mela-midas",
    title: "Buy Sell Eid Mela",
    date: "Jan 15, 2025",
    image: "/images/events/event_gallery_1.jpg",
    category: "EXHIBITION",
  },
  {
    id: "prev-2",
    slug: "campus-scent-showcase",
    title: "University Campus Showcase",
    date: "Dec 20, 2024",
    image: "/images/events/event_gallery_2.jpg",
    category: "POP-UP",
  },
  {
    id: "prev-3",
    slug: "autumn-soiree",
    title: "Autumn Scent Soirée",
    date: "Nov 12, 2024",
    image: "/images/events/event_gallery_3.jpg",
    category: "GALA",
  },
  {
    id: "prev-4",
    slug: "private-masterclass",
    title: "Private Masterclass",
    date: "Oct 05, 2024",
    image: "/images/events/event_gallery_4.jpg",
    category: "WORKSHOP",
  },
];

export const galleryImages: GalleryImage[] = [
  {
    src: "/images/events/event_gallery_1.jpg",
    alt: "Buy Sell Eid Mela - Midas Center",
    title: "Live Olfactory Station",
    category: "EXHIBITION",
    date: "Jan 15, 2025",
    location: "Midas Center, Dhanmondi",
    accentColor: "#ded6c9",
  },
  {
    src: "/images/events/event_gallery_2.jpg",
    alt: "University Campus Scent Showcase",
    title: "Luxury Pop-up Stall",
    category: "POP-UP",
    date: "Dec 20, 2024",
    location: "Banani 11, Dhaka",
    accentColor: "#d6cebf",
  },
  {
    src: "/images/events/event_gallery_3.jpg",
    alt: "Fragrance Atelier & Scent Tasting",
    title: "Autumn Scent Soirée",
    category: "GALA",
    date: "Nov 12, 2024",
    location: "Radisson Blu, Dhaka",
    accentColor: "#ded6c9",
  },
  {
    src: "/images/events/event_gallery_4.jpg",
    alt: "NSU Campus Stall Showcase",
    title: "NSU Campus Stall Showcase",
    category: "WORKSHOP",
    date: "Oct 05, 2024",
    location: "NSU Campus, Dhaka",
    accentColor: "#d6cebf",
  },
  {
    src: "/images/events/event_gallery_5.jpg",
    alt: "Dhanmondi Fair Showcase",
    title: "Dhanmondi Fair Showcase",
    category: "EXHIBITION",
    date: "Sep 28, 2024",
    location: "Dhanmondi Fair, Dhaka",
    accentColor: "#ded6c9",
  },
  {
    src: "/images/events/event_gallery_6.jpg",
    alt: "BRACU Customer Experience & Gifting",
    title: "BRACU Customer Experience & Gifting",
    category: "MEETUP",
    date: "Aug 18, 2024",
    location: "BRAC University, Dhaka",
    accentColor: "#d6cebf",
  },
  {
    src: "/images/events/event_gallery_7.jpg",
    alt: "Campus Perfume Booth Showcase",
    title: "University Scent Fest",
    category: "POP-UP",
    date: "Jul 22, 2024",
    location: "BRAC University Plaza",
    accentColor: "#ded6c9",
  },
  {
    src: "/images/events/event_gallery_8.jpg",
    alt: "Master Perfumer Live Session",
    title: "Sensory Note Discovery",
    category: "WORKSHOP",
    date: "Jun 10, 2024",
    location: "Gulshan Perfume Atelier",
    accentColor: "#d6cebf",
  },
  {
    src: "/images/events/event_gallery_9.jpg",
    alt: "Raw Botanical Oil Auditing",
    title: "Handcrafted Formulation",
    category: "EXHIBITION",
    date: "May 04, 2024",
    location: "Banani Boutique Showcase",
    accentColor: "#ded6c9",
  },
  {
    src: "/images/events/event_gallery_10.jpg",
    alt: "Murakkaz Signature Wall Showcase",
    title: "Official Brand Pavilion",
    category: "POP-UP",
    date: "Apr 18, 2024",
    location: "BRACU Campus Plaza, Dhaka",
    accentColor: "#d6cebf",
  },
  {
    src: "/images/events/event_gallery_11.jpg",
    alt: "Perfume Concentrates & Note Vault",
    title: "Scent Vault & Raw Essence Audit",
    category: "EXHIBITION",
    date: "Mar 12, 2024",
    location: "Murakkaz Perfumery Lab",
    accentColor: "#ded6c9",
  },
  {
    src: "/images/events/event_gallery_12.jpg",
    alt: "Founder & Community Celebration",
    title: "Fragrance Lovers Meetup",
    category: "MEETUP",
    date: "Feb 02, 2024",
    location: "North South University Hall",
    accentColor: "#d6cebf",
  },
];

export const storeLocations: StoreLocation[] = [
  {
    id: "01",
    address: "North South University, Plot 15, Block B, Kuril - NSU Road, Bashundhara Residential Area, Dhaka-1229, Bangladesh",
    zone: "Dhaka, Bashundhara",
    contract: "01735.....49",
  },
  {
    id: "02",
    address: "BRAC University, Kha 224 Pragati Sarani, Merul Badda, Dhaka 1212",
    zone: "Dhaka, Merul Badda",
    contract: "01745.....59",
  },
  {
    id: "03",
    address: "The MIDAS Center, Plot No. 5, Road No. 16 (New), Road No. 27 (Old), Dhanmondi, Dhaka 1209, Bangladesh",
    zone: "Dhaka, Dhanmondi",
    contract: "01785.....99",
  },
];
