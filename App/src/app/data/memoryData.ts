export interface MemoryPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  date: string;
  location: string;
  category?: string;
  aspectRatio?: "square" | "wide" | "tall";
}

export interface MemorySectionData {
  id: string;
  title: string; // e.g. "Recent Photos", "20/06/2025", "19/06/2025"
  photos: MemoryPhoto[];
}

export const memoryData: MemorySectionData[] = [
  {
    id: "recent-highlights",
    title: "Recent Highlights",
    photos: [
      {
        id: "rec-1",
        src: "/images/events/event_gallery_1.jpg",
        alt: "Buy Sell Eid Mela - Midas Center",
        title: "Buy Sell Eid Mela - Midas Center",
        date: "15/01/2025",
        location: "Midas Center, Dhanmondi",
        category: "Exhibition",
        aspectRatio: "wide",
      },
      {
        id: "rec-2",
        src: "/images/events/event_gallery_2.jpg",
        alt: "NSU Campus Scent Showcase",
        title: "NSU Campus Scent Showcase",
        date: "20/12/2024",
        location: "NSU Campus, Dhaka",
        category: "Campus Event",
        aspectRatio: "wide",
      },
      {
        id: "rec-3",
        src: "/images/events/event_gallery_3.jpg",
        alt: "BRAC University Scent Meetup",
        title: "BRAC University Scent Meetup",
        date: "12/11/2024",
        location: "BRAC University, Dhaka",
        category: "Masterclass",
        aspectRatio: "wide",
      },
      {
        id: "rec-4",
        src: "/images/events/event_gallery_4.jpg",
        alt: "NSU Campus Stall Showcase",
        title: "NSU Campus Stall Showcase",
        date: "05/10/2024",
        location: "North South University, Dhaka",
        category: "Workshop",
        aspectRatio: "wide",
      },
      {
        id: "rec-5",
        src: "/images/events/event_gallery_5.jpg",
        alt: "Dhanmondi Fair Showcase",
        title: "Dhanmondi Fair Showcase",
        date: "28/09/2024",
        location: "Dhanmondi Fair, Dhaka",
        category: "Exhibition",
        aspectRatio: "wide",
      },
      {
        id: "rec-6",
        src: "/images/events/event_gallery_6.jpg",
        alt: "BRACU Customer Experience & Gifting",
        title: "BRACU Customer Experience & Gifting",
        date: "18/08/2024",
        location: "BRAC University, Dhaka",
        category: "Meetup",
        aspectRatio: "wide",
      },
    ],
  },
  {
    id: "campus-exhibitions",
    title: "Campus Pop-ups & Exhibitions",
    photos: [
      {
        id: "rec-7",
        src: "/images/events/event_gallery_7.jpg",
        alt: "NSU Plaza Campus Showcase",
        title: "NSU Plaza Campus Showcase",
        date: "22/07/2024",
        location: "NSU Plaza, Dhaka",
        category: "Pop-up",
        aspectRatio: "wide",
      },
      {
        id: "rec-8",
        src: "/images/events/event_gallery_8.jpg",
        alt: "NSU Campus Stall Showcase",
        title: "NSU Campus Stall Showcase",
        date: "10/06/2024",
        location: "NSU Campus, Dhaka",
        category: "Workshop",
        aspectRatio: "wide",
      },
      {
        id: "rec-9",
        src: "/images/events/event_gallery_9.jpg",
        alt: "BRACU Campus Stall Collection",
        title: "BRACU Campus Stall Collection",
        date: "04/05/2024",
        location: "BRAC University, Dhaka",
        category: "Exhibition",
        aspectRatio: "wide",
      },
      {
        id: "rec-10",
        src: "/images/events/event_gallery_10.jpg",
        alt: "Murakkaz Signature Wall Showcase",
        title: "Murakkaz Signature Wall Showcase",
        date: "18/04/2024",
        location: "NSU Plaza, Dhaka",
        category: "Pop-up",
        aspectRatio: "wide",
      },
      {
        id: "rec-11",
        src: "/images/events/event_gallery_11.jpg",
        alt: "Perfume Concentrates & Note Vault",
        title: "Perfume Concentrates & Note Vault",
        date: "12/03/2024",
        location: "Murakkaz Perfumery Lab",
        category: "Exhibition",
        aspectRatio: "wide",
      },
      {
        id: "rec-12",
        src: "/images/events/happy_customer_nsu.jpg",
        alt: "Founder with Happy Customer at NSU",
        title: "Happy Customer Moments at NSU",
        date: "02/02/2024",
        location: "North South University, Dhaka",
        category: "Meetup",
        aspectRatio: "wide",
      },
    ],
  },
];

export const extraMemorySections: MemorySectionData[] = [];
