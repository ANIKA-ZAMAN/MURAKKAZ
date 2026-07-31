export interface PopularComparison {
  id: string;
  perfume1: string;
  perfume2: string;
  p1Param: string;
  p2Param: string;
}

/**
 * Central mock data array for Popular Comparisons displayed in CompareBanner.
 * Easily edit, add, or remove fragrance comparison pairs here.
 */
export const popularComparisonsData: PopularComparison[] = [
  {
    id: "sauvage-badboy",
    perfume1: "Dior Sauvage",
    perfume2: "Carolina Herrera Bad Boy",
    p1Param: "Dior Sauvage",
    p2Param: "Bad Boy",
  },
  {
    id: "ysly-bdc",
    perfume1: "YSL Y EDP",
    perfume2: "Bleu de Chanel",
    p1Param: "YSL Y EDP",
    p2Param: "Bleu de Chanel",
  },
  {
    id: "afnan-jpg",
    perfume1: "Afnan 9PM",
    perfume2: "JPG Ultra Male",
    p1Param: "Afnan 9PM",
    p2Param: "JPG Ultra Male",
  },
];
