"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CollectionHeader from "../components/CollectionHeader";
import FilterButton from "../components/FilterButton";
import FilterSidebar from "../components/FilterSidebar";
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
  const initialCategory = searchParams.get("category") ? searchParams.get("category")!.split(",") : [];
  const initialFamily = searchParams.get("family") ? searchParams.get("family")!.split(",") : [];
  const initialGender = searchParams.get("gender") ? searchParams.get("gender")!.split(",") : [];
  const initialOccasion = searchParams.get("occasion") ? searchParams.get("occasion")!.split(",") : [];
  const initialMeter = searchParams.get("meter") ? searchParams.get("meter")!.split(",") : [];
  const initialNotes = searchParams.get("notes") ? searchParams.get("notes")!.split(",") : [];

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    category: initialCategory,
    family: initialFamily,
    gender: initialGender,
    occasion: initialOccasion,
    meter: initialMeter,
    notes: initialNotes,
  });

  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [searchQuery, setSearchQuery] = useState<string>(initialQ);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true);

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

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSelectedFilters({
      category: [],
      family: [],
      gender: [],
      occasion: [],
      meter: [],
      notes: [],
    });
    setMaxPrice(10000);
    setSearchQuery("");
    setSortBy("newest");
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

    if (selectedFilters.category && selectedFilters.category.length > 0) {
      const selectedCaps = selectedFilters.category.map(c => c.toLowerCase());
      const prodCat = (product.category || 'regular').toLowerCase();
      if (!selectedCaps.includes(prodCat)) return false;
    }

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

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price_asc") {
      return (a.priceVal || 0) - (b.priceVal || 0);
    }
    if (sortBy === "price_desc") {
      return (b.priceVal || 0) - (a.priceVal || 0);
    }
    if (sortBy === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === "name_asc") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "name_desc") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  const activeFiltersCount = Object.values(selectedFilters).reduce(
    (acc, list) => acc + (list ? list.length : 0),
    0
  );

  const activeCategory = selectedFilters.category && selectedFilters.category.length === 1 ? selectedFilters.category[0] : null;

  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Header Row: Title, Filter & Search on Left, Sort by on Right */}
        <CollectionHeader
          title="Shop"
          subtitle="Explore our collections"
          onSearch={handleSearch}
          onOpenFilter={() => setIsFilterOpen((prev) => !prev)}
          isFilterOpen={isFilterOpen}
          activeFiltersCount={activeFiltersCount}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {/* Content Layout: In-Screen Left Filter Sidebar + Responsive Product Grid */}
        <div className={styles.contentLayout}>
          {isFilterOpen && (
            <div className={styles.sidebarWrapper}>
              <FilterSidebar
                selectedFilters={selectedFilters}
                onCheckboxChange={handleCheckboxChange}
                maxPrice={maxPrice}
                onPriceChange={handlePriceChange}
                onClearAll={handleClearAll}
                totalMatching={sortedProducts.length}
              />
            </div>
          )}

          <div className={styles.gridWrapper}>
            <ProductGrid
              products={paginatedProducts}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
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
