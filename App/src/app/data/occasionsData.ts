export interface OccasionItem {
  id: string;
  name: string;
  link: string;
  image: string;
}

export const occasionsData: OccasionItem[] = [
  {
    id: "office",
    name: "Office",
    link: "/shop?occasion=Formal",
    image: "/images/occasions/office.png",
  },
  {
    id: "daily",
    name: "Daily Wear",
    link: "/shop?occasion=Daily+Wear",
    image: "/images/occasions/daily.png",
  },
  {
    id: "date_night",
    name: "Date Night",
    link: "/shop?occasion=Date+Night",
    image: "/images/occasions/date_night.png",
  },
  {
    id: "wedding",
    name: "Wedding",
    link: "/shop?occasion=Formal",
    image: "/images/occasions/wedding.png",
  },
  {
    id: "summer",
    name: "Summer",
    link: "/shop?family=Citrus,Fresh",
    image: "/images/occasions/summer.png",
  },
  {
    id: "winter",
    name: "Winter",
    link: "/shop?family=Woody,Oriental",
    image: "/images/occasions/winter.png",
  },
];
