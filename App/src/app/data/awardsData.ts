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
    id: "university-accolades",
    title: "University & Institutional Honors",
    photos: [
      {
        id: "aw-1",
        src: "/images/awards/brac-edf-token.jpg",
        alt: "Token of Appreciation trophy presented by BRAC University Entrepreneurship Development Forum during Eid Bazaar",
        title: "BRAC University Token of Appreciation",
        date: "2024",
        location: "BRAC University, Dhaka",
        category: "Token of Appreciation",
      },
      {
        id: "aw-2",
        src: "/images/awards/brac-buma-token.jpg",
        alt: "Token of Gratitude trophy presented by BRAC University Marketing Association at Nobanno Utshob 2024",
        title: "BRAC University Token of Gratitude",
        date: "2024",
        location: "BRAC University, Dhaka",
        category: "Token of Gratitude",
      },
      {
        id: "aw-3",
        src: "/images/awards/brac-buedf-fest4.jpg",
        alt: "Entrepreneurs Fest 4.0 Token of Appreciation presented by BRAC University BUEDF",
        title: "BRAC University Entrepreneurs Fest 4.0",
        date: "2024",
        location: "BRAC University, Dhaka",
        category: "Token of Appreciation",
      },
      {
        id: "aw-4",
        src: "/images/awards/brac-buma-mithai-nobanno.jpg",
        alt: "BRAC University BUMA Mithai Nobanno Utshob Token of Appreciation to Murakkaz",
        title: "BRAC University Mithai Nobanno Utshob",
        date: "2024",
        location: "BRAC University, Dhaka",
        category: "Token of Appreciation",
      },
      {
        id: "aw-5",
        src: "/images/awards/nsu-epitome-award.png",
        alt: "EPITOME 3.0 Token of Appreciation presented to Murakkaz by NSU HR Club and NSU School of Business & Economics",
        title: "North South University EPITOME 3.0",
        date: "2024",
        location: "North South University, Dhaka",
        category: "Associate Sponsor Honor",
      },
    ],
  },
  {
    id: "artisanal-sme-honors",
    title: "SME & Artisanal Trophies",
    photos: [
      {
        id: "aw-6",
        src: "/images/awards/midas-sheet-utshob-1431.jpg",
        alt: "Midas Center Sheet Utshob 1431 Octagonal Glass Trophy presented to The Murakkaz",
        title: "Midas Center Sheet Utshob 1431",
        date: "January 2025",
        location: "Midas Center, Dhanmondi",
        category: "Festival Recognition",
      },
      {
        id: "aw-7",
        src: "/images/awards/buysell-eid-mela.jpg",
        alt: "Commemorative crest presented to Murakkaz as an Honorable Participant at Buy Sell Eid Mela 2024",
        title: "Buy Sell Eid Mela Crest",
        date: "May - June 2024",
        location: "Dhaka, Bangladesh",
        category: "Honorable Participant",
      },
      {
        id: "aw-8",
        src: "/images/awards/ninetyeight-rendezvous.jpg",
        alt: "Handcrafted wooden tribute plaque with engraved portrait of perfumer Eliyash Hossain at Ninety Eight Rendezvous",
        title: "Ninety Eight Rendezvous Plaque",
        date: "2024",
        location: "Dhaka, Bangladesh",
        category: "Artisanal Tribute",
      },
      {
        id: "aw-9",
        src: "/images/awards/ninetyeight-cricket-2022.jpg",
        alt: "Ninety Eight Cricket Championship 2022 Shield with Best Compliments to Murakkaz",
        title: "Ninety Eight Cricket Championship",
        date: "2022",
        location: "Dhaka, Bangladesh",
        category: "Community Honor",
      },
    ],
  },
  {
    id: "certificates-honors",
    title: "Certificates & Official Honors",
    photos: [
      {
        id: "aw-10",
        src: "/images/awards/midas-entrepreneur-cheque-2026.png",
        alt: "MIDAS Creative Inspiration Enterprising Entrepreneur Award Cheque to Al Murakkaz (March 2026)",
        title: "MIDAS Creative Entrepreneur Award",
        date: "March 2026",
        location: "MIDAS Centre, Dhanmondi",
        category: "Entrepreneur Award",
      },
      {
        id: "aw-11",
        src: "/images/awards/midas-cmsme-eid-fair-certificate-2026.jpg",
        alt: "MIDAS CMSME Eid Fair 2026 Certificate of Participation presented to Murakkaz",
        title: "MIDAS CMSME Eid Fair 2026",
        date: "March 2026",
        location: "MIDAS Centre, Dhanmondi",
        category: "Certificate of Participation",
      },
      {
        id: "aw-12",
        src: "/images/awards/midas-sme-eid-fair-certificate-2025.png",
        alt: "MIDAS SME Eid Fair 2025 Certificate of Participation presented to Al Murakkaz",
        title: "MIDAS SME Eid Fair 2025",
        date: "March 2025",
        location: "MIDAS Centre, Dhanmondi",
        category: "Certificate of Participation",
      },
      {
        id: "aw-13",
        src: "/images/awards/bh-business-club-fivestar-certificate-2025.jpg",
        alt: "BH Business Club Five-Star Performer Certificate of Appreciation presented to Eliyas Hossain, Owner of Murakkaz",
        title: "BH Business Club Five-Star Performer",
        date: "2025",
        location: "Dhaka, Bangladesh",
        category: "Five-Star Performer",
      },
    ],
  },
];


