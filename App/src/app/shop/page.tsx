"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CollectionHeader from "../components/CollectionHeader";
import FilterButton from "../components/FilterButton";
import FilterDrawer from "../components/FilterDrawer";
import ProductGrid from "../components/ProductGrid";
import RecommendationSlider from "../components/RecommendationSlider";
import { Product, fetchLiveProducts } from "../data/products";
import styles from "./page.module.css";

function ShopContent() {
  const searchParams = useSearchParams();

  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [searchQuery, setSearchQuery] = useState<string>(initialQ);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchLiveProducts()
      .then((data) => {
        setProductsList(data || []);
      })
      .finally(() => setLoading(false));
  }, []);

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
    setCurrentPage(1);
  };

  const handlePriceChange = (price: number) => {
    setMaxPrice(price);
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSelectedFilters({
      family: [],
      gender: [],
      occasion: [],
      meter: [],
      notes: [],
    });
    setMaxPrice(10000);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter Catalog logic
  const filteredProducts = productsList.filter((product) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description ? product.description.toLowerCase().includes(q) : false;
      const matchBrand = product.brand ? product.brand.toLowerCase().includes(q) : false;
      if (!matchName && !matchDesc && !matchBrand) return false;
    }

    if (product.priceVal > maxPrice) return false;

    if (selectedFilters.family && selectedFilters.family.length > 0) {
      const selectedCaps = selectedFilters.family.map(f => f.toUpperCase().replace(/\s+/g, '_'));
      const prodFamCaps = (product.family || '').toUpperCase().replace(/\s+/g, '_');
      if (!selectedCaps.includes(prodFamCaps)) return false;
    }

    if (selectedFilters.gender && selectedFilters.gender.length > 0) {
      const selectedCaps = selectedFilters.gender.map(g => g.toUpperCase().replace(/\s+/g, '_'));
      const prodGenderCaps = (product.gender || '').toUpperCase().replace(/\s+/g, '_');
      if (!selectedCaps.includes(prodGenderCaps)) return false;
    }

    if (selectedFilters.occasion && selectedFilters.occasion.length > 0) {
      const selectedLower = selectedFilters.occasion.map(o => o.toLowerCase());
      const prodOccasionLower = (product.occasion || '').toLowerCase();
      if (!selectedLower.some(o => prodOccasionLower.includes(o))) return false;
    }

    if (selectedFilters.meter && selectedFilters.meter.length > 0) {
      const selectedCaps = selectedFilters.meter.map(m => m.toUpperCase().replace(/\s+/g, '_'));
      const prodMeterCaps = (product.meter || '').toUpperCase().replace(/\s+/g, '_');
      if (!selectedCaps.includes(prodMeterCaps)) return false;
    }

    if (selectedFilters.notes && selectedFilters.notes.length > 0) {
      const productNotes = product.notes || [];
      if (!selectedFilters.notes.some((note) => productNotes.some(pn => pn.toLowerCase().includes(note.toLowerCase())))) return false;
    }

    return true;
  });

  const activeFiltersCount = Object.values(selectedFilters).reduce(
    (acc, list) => acc + (list ? list.length : 0),
    0
  );

  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Header Row: Title, Search Bar & Murakkaz Red Filter Button */}
        <CollectionHeader
          title="Shop"
          subtitle="Explore our collections"
          onSearch={handleSearch}
          onOpenFilter={() => setIsDrawerOpen(true)}
          activeFiltersCount={activeFiltersCount}
        />

        {/* Content Layout: Product Grid */}
        <div className={styles.contentLayout}>
          <ProductGrid
            products={paginatedProducts}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Slide-Over Right Drawer Half Page */}
        <FilterDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          selectedFilters={selectedFilters}
          onCheckboxChange={handleCheckboxChange}
          maxPrice={maxPrice}
          onPriceChange={handlePriceChange}
          onClearAll={handleClearAll}
          totalMatching={filteredProducts.length}
        />

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
