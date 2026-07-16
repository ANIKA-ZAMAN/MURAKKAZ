import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import FeaturedCollections from "./components/FeaturedCollections";
import FindYourFragrance from "./components/FindYourFragrance";
import BestSellersSection from "./components/BestSellersSection";

import ShopByOccasion from "./components/ShopByOccasion";

import MurakkazDifference from "./components/MurakkazDifference";
import CompareBanner from "./components/CompareBanner";
import CustomerReviews from "./components/CustomerReviews";
import UpcomingEventsSection from "./components/UpcomingEventsSection";

export default function Home() {
  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-transparent flex flex-col justify-between" suppressHydrationWarning>
      {/* Instant static body background override to prevent flashing and texture in header */}
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          background-color: #CBB9A1 !important;
          background-image: none !important;
        }
      `}} />
      <Hero />
      <TrustBar />
      <FeaturedCollections />
      <FindYourFragrance />
      <BestSellersSection />

      <ShopByOccasion />

      <MurakkazDifference />
      <CompareBanner />
      <CustomerReviews />
      <UpcomingEventsSection />
    </div>
  );
}



