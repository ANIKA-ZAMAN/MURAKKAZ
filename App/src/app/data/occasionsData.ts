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
    image: "/images/products/jade_serenity.png",
  },
  {
    id: "daily",
    name: "Daily Wear & Fresh",
    link: "/shop?occasion=Daily+Wear",
    image: "/images/products/coral_sea.png",
  },
  {
    id: "date_night",
    name: "Date Night & Evening",
    link: "/shop?occasion=Date+Night",
    image: "/images/products/magnetism.png",
  },
  {
    id: "wedding",
    name: "Wedding & Gala",
    link: "/shop?occasion=Formal",
    image: "/images/products/hellenist.png",
  },
  {
    id: "summer",
    name: "Summer Citrus & Aquatic",
    link: "/shop?family=Citrus,Fresh",
    image: "/images/products/silver_mountain.png",
  },
  {
    id: "winter",
    name: "Winter Warmth & Rare Oud",
    link: "/shop?family=Woody,Oriental",
    image: "/images/products/amber_gold.png",
  },
];
