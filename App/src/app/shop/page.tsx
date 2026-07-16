"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CollectionHeader from "../components/CollectionHeader";
import FilterSidebar from "../components/FilterSidebar";
import ProductGrid from "../components/ProductGrid";
import RecommendationSlider from "../components/RecommendationSlider";
import { productsCatalog } from "../data/products";
import styles from "./page.module.css";

function ShopContent() {
  const searchParams = useSearchParams();
  
  // Initialize state directly from URL query parameters
  const initialQ = searchParams.get("q") || "";
  const initialFamily = searchParams.get("family") ? searchParams.get("family")!.split(",") : [];
  const initialGender = searchParams.get("gender") ? searchParams.get("gender")!.split(",") : [];
  const initialOccasion = searchParams.get("occasion") ? searchParams.get("occasion")!.split(",") : [];
  const initialMeter = searchParams.get("meter") ? searchParams.get("meter")!.split(",") : [];
  const initialNotes = searchParams.get("notes") ? searchParams.get("notes")!.split(",") : [];

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    family: initialFamily,
    gender: initialGender,
    occasion: initialOccasion,
    meter: initialMeter,
    notes: initialNotes,
  });

  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [searchQuery, setSearchQuery] = useState<string>(initialQ);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleCheckboxChange = (categoryId: string, option: string) => {
    setSelectedFilters((prev) => {
      const currentSelected = prev[categoryId] || [];
      const updated = currentSelected.includes(option)
        ? currentSelected.filter((item) => item !== option)
        : [...currentSelected, option];

      return {
        ...prev,
        [categoryId]: updated,
      };
    });
    setCurrentPage(1); // Reset page to 1 on filter change
  };

  const handlePriceChange = (price: number) => {
    setMaxPrice(price);
    setCurrentPage(1); // Reset page to 1 on price filter change
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset page to 1 on search change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll back to top of main catalog section on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter Catalog logic
  const filteredProducts = productsCatalog.filter((product) => {
    // 1. Search Query Match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    // 2. Price Slider Match
    if (product.priceVal > maxPrice) return false;

    // 3. Fragrance Family Match
    if (selectedFilters.family.length > 0) {
      if (!selectedFilters.family.includes(product.family)) return false;
    }

    // 4. Gender Match
    if (selectedFilters.gender.length > 0) {
      if (!selectedFilters.gender.includes(product.gender)) return false;
    }

    // 5. Occasion Match
    if (selectedFilters.occasion.length > 0) {
      if (!selectedFilters.occasion.includes(product.occasion)) return false;
    }

    // 6. Performance Meter Match
    if (selectedFilters.meter.length > 0) {
      if (!selectedFilters.meter.includes(product.meter)) return false;
    }

    // 7. Notes Match
    if (selectedFilters.notes && selectedFilters.notes.length > 0) {
      const productNotes = product.notes || [];
      if (!selectedFilters.notes.some((note) => productNotes.includes(note))) return false;
    }

    return true;
  });

  // Pagination slicing
  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Header Row: Title & Search Bar */}
        <CollectionHeader title="Shop" subtitle="Explore our collections" onSearch={handleSearch} />

        {/* Content Layout: Sidebar + Product Grid */}
        <div className={styles.contentLayout}>
          <FilterSidebar
            selectedFilters={selectedFilters}
            onCheckboxChange={handleCheckboxChange}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
          />
          <ProductGrid
            products={paginatedProducts}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Explore Our Recommendation Section */}
        <RecommendationSlider />
      </main>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: '#8c8c90' }}>
        Loading catalog...
      </div>
    }>
      <ShopContentWrapper />
    </Suspense>
  );
}

function ShopContentWrapper() {
  const searchParams = useSearchParams();
  return <ShopContent key={searchParams.toString()} />;
}
