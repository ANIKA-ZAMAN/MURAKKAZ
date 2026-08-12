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
    id: "recent",
    title: "Recent Photos",
    photos: [
      {
        id: "rec-1",
        src: "/images/events/event_gallery_1.jpg",
        alt: "Buy Sell Eid Mela - Midas Center",
        title: "Buy Sell Eid Mela - Midas Center",
        date: "25/06/2025",
        location: "Midas Center, Dhanmondi",
        category: "Exhibition",
        aspectRatio: "wide",
      },
      {
        id: "rec-2",
        src: "/images/events/event_gallery_2.jpg",
        alt: "NSU Campus Scent Showcase",
        title: "NSU Campus Scent Showcase",
        date: "24/06/2025",
        location: "NSU Campus, Dhaka",
        category: "Campus Event",
        aspectRatio: "wide",
      },
      {
        id: "rec-3",
        src: "/images/events/event_gallery_3.jpg",
        alt: "BRAC University Scent Meetup",
        title: "BRAC University Scent Meetup",
        date: "23/06/2025",
        location: "BRAC University, Dhaka",
        category: "Masterclass",
        aspectRatio: "wide",
      },
      {
        id: "rec-4",
        src: "/images/events/event_gallery_4.jpg",
        alt: "Outdoor Masterclass & Note Profiling",
        title: "Outdoor Masterclass & Note Profiling",
        date: "22/06/2025",
        location: "North South University, Dhaka",
        category: "Workshop",
        aspectRatio: "wide",
      },
      {
        id: "rec-5",
        src: "/images/events/event_gallery_5.jpg",
        alt: "Artisanal Fragrance Fair Stall",
        title: "Artisanal Fragrance Fair Stall",
        date: "21/06/2025",
        location: "Dhanmondi Fair, Dhaka",
        category: "Exhibition",
        aspectRatio: "wide",
      },
      {
        id: "rec-6",
        src: "/images/events/event_gallery_6.jpg",
        alt: "Connoisseur Gathering & Gifting",
        title: "Connoisseur Gathering & Gifting",
        date: "21/06/2025",
        location: "Murakkaz Flagship Lounge",
        category: "Meetup",
        aspectRatio: "wide",
      },
      {
        id: "rec-7",
        src: "/images/events/event_gallery_7.jpg",
        alt: "Campus Perfume Booth Showcase",
        title: "Campus Perfume Booth Showcase",
        date: "20/06/2025",
        location: "BRAC University Plaza",
        category: "Pop-up",
        aspectRatio: "wide",
      },
      {
        id: "rec-8",
        src: "/images/events/event_gallery_8.jpg",
        alt: "Master Perfumer Live Session",
        title: "Master Perfumer Live Session",
        date: "20/06/2025",
        location: "Gulshan Perfume Atelier",
        category: "Workshop",
        aspectRatio: "wide",
      },
      {
        id: "rec-9",
        src: "/images/events/event_gallery_9.jpg",
        alt: "Raw Botanical Oil Auditing",
        title: "Raw Botanical Oil Auditing",
        date: "19/06/2025",
        location: "Banani Boutique Showcase",
        category: "Exhibition",
        aspectRatio: "wide",
      },
    ],
  },
  {
    id: "date-20062025",
    title: "20/06/2025",
    photos: [
      {
        id: "d20-1",
        src: "/images/products/coral_sea.png",
        alt: "BRAC University Scent Meetup",
        title: "BRAC University Scent Meetup",
        date: "20/06/2025",
        location: "BRACU Auditorium, Dhaka",
        category: "Campus Event",
        aspectRatio: "wide",
      },
      {
        id: "d20-2",
        src: "/images/products/magnetism.png",
        alt: "Magnetism Launch Gathering",
        title: "Magnetism Launch Gathering",
        date: "20/06/2025",
        location: "Banani 11 Lounge, Dhaka",
        category: "Launch",
        aspectRatio: "wide",
      },
      {
        id: "d20-3",
        src: "/images/products/silver_mountain.png",
        alt: "Silver Mountain Water Tasting",
        title: "Silver Mountain Water Tasting",
        date: "20/06/2025",
        location: "Chattogram GEC Outlet",
        category: "Experience",
        aspectRatio: "wide",
      },
    ],
  },
  {
    id: "date-19062025",
    title: "19/06/2025",
    photos: [
      {
        id: "d19-1",
        src: "/images/events/eliyas.jpg",
        alt: "Raw Material Distillation Demo",
        title: "Raw Material Distillation Demo",
        date: "19/06/2025",
        location: "ICCB Pavilion 3, Dhaka",
        category: "Demonstration",
        aspectRatio: "wide",
      },
      {
        id: "d19-2",
        src: "/images/events/sadid.jpg",
        alt: "Community Fragrance Discovery",
        title: "Community Fragrance Discovery",
        date: "19/06/2025",
        location: "NSU Plaza, Dhaka",
        category: "Exhibition",
        aspectRatio: "wide",
      },
      {
        id: "d19-3",
        src: "/images/products/jade_serenity.png",
        alt: "Jade Serenity Botanical Blend",
        title: "Jade Serenity Botanical Blend",
        date: "19/06/2025",
        location: "Shimanto Square, Dhaka",
        category: "Workshop",
        aspectRatio: "wide",
      },
      {
        id: "d19-4",
        src: "/images/products/amber_gold.png",
        alt: "Evening Concentree Tasting",
        title: "Evening Concentree Tasting",
        date: "19/06/2025",
        location: "Uttara Sector 3, Dhaka",
        category: "Pop-up",
        aspectRatio: "wide",
      },
      {
        id: "d19-5",
        src: "/images/occasions/wedding.png",
        alt: "Bridal Fragrance Consultation",
        title: "Bridal Fragrance Consultation",
        date: "19/06/2025",
        location: "Radisson Blu, Dhaka",
        category: "Gala",
        aspectRatio: "wide",
      },
      {
        id: "d19-6",
        src: "/images/products/velvet_oud.png",
        alt: "Artisan Bottle Engraving Station",
        title: "Artisan Bottle Engraving Station",
        date: "19/06/2025",
        location: "Jamuna Future Park, Dhaka",
        category: "Live Station",
        aspectRatio: "wide",
      },
    ],
  },
];

export const extraMemorySections: MemorySectionData[] = [
  {
    id: "date-12062025",
    title: "12/06/2025",
    photos: [
      {
        id: "d12-1",
        src: "/images/products/silver_mountain.png",
        alt: "Rajshahi SME Fair Showcase",
        title: "Rajshahi SME Fair Showcase",
        date: "12/06/2025",
        location: "Rajshahi SME Grounds",
        category: "Award Fair",
        aspectRatio: "wide",
      },
      {
        id: "d12-2",
        src: "/images/products/rouge_540.png",
        alt: "Midas SME Recognition Ceremony",
        title: "Midas SME Recognition Ceremony",
        date: "12/06/2025",
        location: "Pan Pacific Sonargaon, Dhaka",
        category: "Award Ceremony",
        aspectRatio: "wide",
      },
      {
        id: "d12-3",
        src: "/images/events/eliyas.jpg",
        alt: "Founder Speech & Fragrance Philosophy",
        title: "Founder Speech & Fragrance Philosophy",
        date: "12/06/2025",
        location: "Rajshahi Auditorium",
        category: "Keynote",
        aspectRatio: "wide",
      },
    ],
  },
];
