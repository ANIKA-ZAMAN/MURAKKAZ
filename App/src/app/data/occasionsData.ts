export interface OccasionItem {
  id: string;
  name: string;
  link: string;
  image: string;
}

export const occasionsData: OccasionItem[] = [
  {
    id: "office",
    name: "Office & Executive",
    link: "/shop?occasion=Formal",
    image: "/images/occasions/office.png",
  },
  {
    id: "daily",
    name: "Daily Wear & Fresh",
    link: "/shop?occasion=Daily+Wear",
    image: "/images/occasions/daily.png",
  },
  {
    id: "date_night",
    name: "Date Night & Evening",
    link: "/shop?occasion=Date+Night",
    image: "/images/occasions/date_night.png",
  },
  {
    id: "wedding",
    name: "Wedding & Gala",
    link: "/shop?occasion=Formal",
    image: "/images/occasions/wedding.png",
  },
  {
    id: "summer",
    name: "Summer Citrus & Aquatic",
    link: "/shop?family=Citrus,Fresh",
    image: "/images/occasions/summer.png",
  },
  {
    id: "winter",
    name: "Winter Warmth & Rare Oud",
    link: "/shop?family=Woody,Oriental",
    image: "/images/occasions/winter.png",
  },
];
