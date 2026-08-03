import { productsCatalog } from "./products";

export interface PopularComparison {
  id: string;
  perfume1: string;
  perfume2: string;
  p1Param: string;
  p2Param: string;
}

/**
 * Real comparison pairs generated directly from productsCatalog.
 */
export const popularComparisonsData: PopularComparison[] = [
  {
    id: "irish-baccarat",
    perfume1: productsCatalog[1]?.name || "Irish Leather",
    perfume2: productsCatalog[2]?.name || "Baccarat Rouge 540",
    p1Param: productsCatalog[1]?.name || "Irish Leather",
    p2Param: productsCatalog[2]?.name || "Baccarat Rouge 540",
  },
  {
    id: "tobacco-fireplace",
    perfume1: productsCatalog[3]?.name || "Tobacco Vanille",
    perfume2: productsCatalog[4]?.name || "By the Fireplace",
    p1Param: productsCatalog[3]?.name || "Tobacco Vanille",
    p2Param: productsCatalog[4]?.name || "By the Fireplace",
  },
  {
    id: "resala-sultani",
    perfume1: productsCatalog[5]?.name || "Resala",
    perfume2: productsCatalog[6]?.name || "Sultani",
    p1Param: productsCatalog[5]?.name || "Resala",
    p2Param: productsCatalog[6]?.name || "Sultani",
  },
  {
    id: "guidance-rosewood",
    perfume1: productsCatalog[7]?.name || "Guidance",
    perfume2: productsCatalog[8]?.name || "Rosewood",
    p1Param: productsCatalog[7]?.name || "Guidance",
    p2Param: productsCatalog[8]?.name || "Rosewood",
  },
];
