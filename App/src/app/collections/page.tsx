"use client";

import { useState, Suspense } from "react";
import CollectionHeader from "../components/CollectionHeader";
import Pagination from "../components/Pagination";
import CollectionCard from "./components/CollectionCard";
import { productsCatalog } from "../data/products";
import styles from "./page.module.css";

function CollectionsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter products by search query
  const filteredProducts = productsCatalog.filter((product) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const itemsPerPage = 8; // 2 rows of 4 cards
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Header with Search */}
        <CollectionHeader
          title="Perfume Collection"
          subtitle="Universe of perfume"
          onSearch={handleSearch}
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
            <p>No perfumes found in the collection matching your search.</p>
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
