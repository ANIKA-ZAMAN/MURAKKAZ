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

export const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:5000/api";
    }
    if (/^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)) {
      return `http://${host}:5000/api`;
    }
    return "https://api.murakkaz.com/api";
  }
  return "https://api.murakkaz.com/api";
};

const validTrackedImages = [
  "/images/events/event_gallery_5.jpg",
  "/images/events/event_gallery_3.jpg",
  "/images/events/event_gallery_6.jpg",
  "/images/events/event_gallery_1.jpg",
  "/images/events/event_gallery_2.jpg",
  "/images/events/event_gallery_4.jpg",
  "/images/events/happy_customer_nsu.jpg",
  "/images/events/eliyas.jpg"
];

function getValidEventImage(rawImage: string | undefined, idx: number): string {
  if (rawImage && 
      !rawImage.includes("event1.jpg") && 
      !rawImage.includes("event2.jpg") && 
      !rawImage.includes("event3.jpg") &&
      !rawImage.includes("undefined")) {
    return rawImage.startsWith("/") ? rawImage : `/images/events/${rawImage}`;
  }
  return validTrackedImages[idx % validTrackedImages.length];
}

let cachedEventsData: { upcoming: UpcomingEvent[]; previous: PreviousEvent[] } | null = null;

export const fetchLiveEvents = async (upcoming?: boolean): Promise<{ upcoming: UpcomingEvent[]; previous: PreviousEvent[] }> => {
  if (cachedEventsData && cachedEventsData.upcoming.length > 0) {
    return cachedEventsData;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const query = upcoming !== undefined ? `?upcoming=${upcoming}` : "";
    const res = await fetch(`${getApiBaseUrl()}/events${query}`, { 
      signal: controller.signal,
      cache: "no-store" 
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (res && res.ok) {
      const json = await res.json().catch(() => null);
      const data = json ? (json.data || json) : null;

      if (Array.isArray(data) && data.length > 0) {
        const fetchedUpcoming: UpcomingEvent[] = [];
        const fetchedPrevious: PreviousEvent[] = [];

        data.forEach((evt: any, idx: number) => {
          const evtDate = evt.eventDate ? new Date(evt.eventDate) : new Date();
          const diffMs = evtDate.getTime() - Date.now();
          const calcDaysLeft = diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0;
          const daysLeftStr = evt.daysLeft !== null && evt.daysLeft !== undefined
            ? `${evt.daysLeft} days left`
            : `${calcDaysLeft} days left`;

          const monthName = evt.month || evtDate.toLocaleString("en-US", { month: "short" });
          const dayNum = evt.day || String(evtDate.getDate()).padStart(2, "0");
          const validatedImg = getValidEventImage(evt.image, idx);

          if (evt.isUpcoming ?? true) {
            fetchedUpcoming.push({
              id: evt.id,
              slug: evt.slug || evt.id,
              day: dayNum,
              month: monthName,
              title: evt.title,
              description: evt.description,
              time: evt.time || "4:00 PM - 7:00 PM",
              location: evt.location || "Dhaka",
              daysLeft: daysLeftStr,
              image: validatedImg,
            });
          } else {
            fetchedPrevious.push({
              id: evt.id,
              slug: evt.slug || evt.id,
              title: evt.title,
              date: `${monthName} ${dayNum}, ${evtDate.getFullYear()}`,
              image: validatedImg,
              category: evt.category || "Exhibition",
            });
          }
        });

        cachedEventsData = {
          upcoming: fetchedUpcoming,
          previous: fetchedPrevious.length > 0 ? fetchedPrevious : previousEvents,
        };
        return cachedEventsData;
      }
    }
  } catch (err) {
    console.warn("[Murakkaz] Events API fetch warning:", err);
  }

  cachedEventsData = {
    upcoming: upcomingEvents,
    previous: previousEvents,
  };
  return cachedEventsData;
};

export const upcomingEvents: UpcomingEvent[] = [];
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
