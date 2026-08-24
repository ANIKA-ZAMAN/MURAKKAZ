"use client";

import Hero from "./components/Hero";
import FeaturedCollections from "./components/FeaturedCollections";
import FindYourFragrance from "./components/FindYourFragrance";
import ShopByOccasion from "./components/ShopByOccasion";
import MurakkazDifference from "./components/MurakkazDifference";
import CompareBanner from "./components/CompareBanner";
import CustomerReviews from "./components/CustomerReviews";
import UpcomingEventsSection from "./components/UpcomingEventsSection";
import ScrollReveal from "./components/ScrollReveal";

export default function Home() {
  return (
    <div className="w-full min-h-[calc(100vh-96px)] bg-[var(--background)] flex flex-col justify-between" suppressHydrationWarning>
      <Hero />
      <ScrollReveal variant="fade-up"><FeaturedCollections /></ScrollReveal>
      <ScrollReveal variant="scale-fade"><FindYourFragrance /></ScrollReveal>
      <ScrollReveal variant="fade-up"><ShopByOccasion /></ScrollReveal>
      <ScrollReveal variant="spotlight-reveal"><CompareBanner /></ScrollReveal>
      <ScrollReveal variant="fade-up"><CustomerReviews /></ScrollReveal>
      <ScrollReveal variant="slide-horizontal"><UpcomingEventsSection /></ScrollReveal>
      <ScrollReveal variant="spotlight-reveal"><MurakkazDifference /></ScrollReveal>
    </div>
  );
}
