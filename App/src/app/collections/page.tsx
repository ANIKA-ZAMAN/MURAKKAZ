"use client";

import { useState, useEffect, Suspense } from "react";
import CollectionHeader from "../components/CollectionHeader";
import FilterButton from "../components/FilterButton";
import FilterSidebar from "../components/FilterSidebar";
import FilterDrawer from "../components/FilterDrawer";
import Pagination from "../components/Pagination";
import CollectionCard from "./components/CollectionCard";
import { Product, productsCatalog, fetchLiveProducts } from "../data/products";
import styles from "./page.module.css";


function CollectionsContent() {
  const [productsList, setProductsList] = useState<Product[]>(productsCatalog);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  useEffect(() => {
    fetchLiveProducts().then((data) => {
      if (data && data.length > 0) {
        setProductsList(data);
      }
    });
  }, []);

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    family: [],
    gender: [],
    occasion: [],
    meter: [],
    notes: [],
  });
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>("newest");

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

  // Filter products by search query, price, family, gender, occasion, meter, notes
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
      if (!selectedFilters.notes.some((note) => productNotes.some((pn: any) => {
        const noteName = typeof pn === 'string' ? pn : (pn?.name || '');
        return noteName.toLowerCase().includes(note.toLowerCase());
      }))) return false;
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
          title="Perfume Collection"
          subtitle="Universe of perfume"
          onSearch={handleSearch}
          onOpenFilter={() => setIsFilterOpen((prev) => !prev)}
          isFilterOpen={isFilterOpen}
          activeFiltersCount={activeFiltersCount}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {/* Content Layout: In-Screen Left Filter Sidebar + Product Grid */}
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
            {paginatedProducts.length > 0 ? (
              <div className={isFilterOpen ? styles.grid : styles.gridFullWidth}>
                {paginatedProducts.map((product) => (
                  <CollectionCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    brand={product.brand}
                    description={product.description}
                    rating={product.rating}
                    reviews={product.reviews || product.reviewCount || 0}
                    image={product.image}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <p>No perfumes found matching your search or filters.</p>
              </div>
            )}

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
          </div>
        </div>
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
