"use client";

import { useEffect } from "react";
import Hero from "./components/Hero";
import FeaturedCollections from "./components/FeaturedCollections";
import FindYourFragrance from "./components/FindYourFragrance";
import BestSellersSection from "./components/BestSellersSection";
import ShopByOccasion from "./components/ShopByOccasion";
import MurakkazDifference from "./components/MurakkazDifference";
import CompareBanner from "./components/CompareBanner";
import CustomerReviews from "./components/CustomerReviews";
import UpcomingEventsSection from "./components/UpcomingEventsSection";
import ScrollReveal from "./components/ScrollReveal";

export default function Home() {
  // Apply #CBB9A1 background ONLY while on the Home page, and clean up when navigating to other pages
  useEffect(() => {
    document.body.style.backgroundColor = "#CBB9A1";
    document.body.style.backgroundImage = "none";

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.backgroundImage = "";
    };
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-96px)] bg-[#CBB9A1] flex flex-col justify-between" suppressHydrationWarning>
      <Hero />
      <ScrollReveal variant="fade-up"><FeaturedCollections /></ScrollReveal>
      <ScrollReveal variant="none"><FindYourFragrance /></ScrollReveal>
      <ScrollReveal variant="scale-fade"><BestSellersSection /></ScrollReveal>
      <ScrollReveal variant="scale-fade"><ShopByOccasion /></ScrollReveal>
      <ScrollReveal variant="none"><MurakkazDifference /></ScrollReveal>
      <ScrollReveal variant="spotlight-reveal"><CompareBanner /></ScrollReveal>
      <ScrollReveal variant="fade-up"><CustomerReviews /></ScrollReveal>
      <ScrollReveal variant="slide-horizontal"><UpcomingEventsSection /></ScrollReveal>
    </div>
  );
}
