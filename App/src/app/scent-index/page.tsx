import { Suspense } from "react";
import ScentIndex from "./components/ScentIndex";

export const metadata = {
  title: "Murakkaz Scent Index — Find Your Signature",
  description:
    "An intimate fragrance consultation to discover your perfect Murakkaz scent. Guided by your lifestyle, memories, and personal aesthetic.",
};

export default function ScentIndexPage() {
  return (
    <Suspense fallback={null}>
      <ScentIndex />
    </Suspense>
  );
}
