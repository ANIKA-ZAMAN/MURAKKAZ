"use client";

import { useState, Suspense } from "react";
import CollectionHeader from "../components/CollectionHeader";
import FilterButton from "../components/FilterButton";
import FilterDrawer from "../components/FilterDrawer";
import Pagination from "../components/Pagination";
import CollectionCard from "./components/CollectionCard";
import { productsCatalog } from "../data/products";
import styles from "./page.module.css";


function CollectionsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    family: [],
    gender: [],
    occasion: [],
    meter: [],
    notes: [],
  });
  const [maxPrice, setMaxPrice] = useState<number>(2500);

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
    setMaxPrice(2500);
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

  // Filter products by search query, price, family, gender, occasion, meter, notes
  const filteredProducts = productsCatalog.filter((product) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchBrand) return false;
    }
    if (product.priceVal > maxPrice) return false;
    if (selectedFilters.family.length > 0 && !selectedFilters.family.includes(product.family)) return false;
    if (selectedFilters.gender.length > 0 && !selectedFilters.gender.includes(product.gender)) return false;
    if (selectedFilters.occasion.length > 0 && !selectedFilters.occasion.includes(product.occasion)) return false;
    if (selectedFilters.meter.length > 0 && !selectedFilters.meter.includes(product.meter)) return false;
    if (selectedFilters.notes && selectedFilters.notes.length > 0) {
      const productNotes = product.notes || [];
      if (!selectedFilters.notes.some((note) => productNotes.includes(note))) return false;
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
        {/* Header with Search & Murakkaz Red Filter Button */}
        <CollectionHeader
          title="Perfume Collection"
          subtitle="Universe of perfume"
          onSearch={handleSearch}
          onOpenFilter={() => setIsDrawerOpen(true)}
          activeFiltersCount={activeFiltersCount}
        />

        {/* Product Grid */}
        {paginatedProducts.length > 0 ? (
          <div className={styles.grid}>
            {paginatedProducts.map((product) => (
              <CollectionCard
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                description={product.description}
                rating={product.rating}
                reviews={product.reviews}
                image={product.image}
              />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>No perfumes found matching your search or filters.</p>
          </div>
        )}

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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.paginationWrapper}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: '#8c8c90' }}>
        Loading collections...
      </div>
    }>
      <CollectionsContent />
    </Suspense>
  );
}
