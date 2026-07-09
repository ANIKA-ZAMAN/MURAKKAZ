"use client";

import { useState } from "react";
import CollectionHeader from "./components/CollectionHeader";
import ProductGrid from "./components/ProductGrid";
import { productsCatalog } from "./data/products";
import styles from "./page.module.css";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter by search query
  const filteredProducts = productsCatalog.filter((product) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchBrand) return false;
    }
    return true;
  });

  // Pagination — 8 items per page to match 4×2 grid in design
  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <CollectionHeader onSearch={handleSearch} />
        <ProductGrid
          products={paginatedProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}
