export interface AwardPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  date: string;
  location: string;
  category: string;
}

export interface AwardSectionData {
  id: string;
  title: string;
  photos: AwardPhoto[];
}

export const awardsData: AwardSectionData[] = [
  {
    id: "accolades",
    title: "Institutional Accolades & Honors",
    photos: [
      {
        id: "aw-1",
        src: "/images/events/sadid.jpg",
        alt: "Sadid receiving Midas SME Award",
        title: "Midas SME & Rajshahi Award",
        date: "December 2025",
        location: "Rajshahi SME Fair, Rajshahi",
        category: "SME Award",
      },
      {
        id: "aw-2",
        src: "/images/events/blog1.jpg",
        alt: "Storefront and perfumes display at BRAC University Showcase",
        title: "BRAC University Accolades",
        date: "November 2025",
        location: "BRAC University Campus, Dhaka",
        category: "Accolades",
      },
      {
        id: "aw-3",
        src: "/images/events/blog2.jpg",
        alt: "Perfume testing at NSU School of Business Showcase",
        title: "North South University Honor",
        date: "October 2025",
        location: "North South University, Dhaka",
        category: "Honor",
      },
      {
        id: "aw-4",
        src: "/images/events/eliyas.jpg",
        alt: "National SME Fair stall interaction and presentation",
        title: "SME Fair Recognition",
        date: "September 2025",
        location: "Bangabandhu International Conference Center, Dhaka",
        category: "Recognition",
      },
    ],
  },
  {
    id: "showcases",
    title: "Artisanal & Brand Showcases",
    photos: [
      {
        id: "aw-5",
        src: "/images/events/blog3.jpg",
        alt: "Youth Entrepreneurship Workshop Discussion Panel",
        title: "Entrepreneurship Showcase",
        date: "August 2025",
        location: "EMK Center, Dhaka",
        category: "Sensory Showcase",
      },
      {
        id: "aw-6",
        src: "/images/products/jade_serenity.png",
        alt: "Jade Serenity Launch Exhibition & Scent Sourcing",
        title: "Jade Serenity Launch Exhibition",
        date: "July 2025",
        location: "Gulshan Exhibition Hall, Dhaka",
        category: "Artisan Excellence",
      },
      {
        id: "aw-7",
        src: "/images/products/coral_sea.png",
        alt: "Coral Sea Scent Index Launch Event",
        title: "Coral Sea Exhibition",
        date: "June 2025",
        location: "Dhanmondi Art Gallery, Dhaka",
        category: "Sensory Showcase",
      },
      {
        id: "aw-8",
        src: "/images/products/velvet_oud.png",
        alt: "Velvet Oud Private Fragrance Presentation",
        title: "Velvet Oud Private Presentation",
        date: "May 2025",
        location: "Gulshan Club, Dhaka",
        category: "Artisan Excellence",
      },
    ],
  },
];
