import { Suspense } from "react";
import { getProductsApiBaseUrl } from "../../data/products";
import ProductDetailsClient from "./ProductDetailsClient";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let initialProduct: any = null;

  try {
    const apiBase = getProductsApiBaseUrl();
    const res = await fetch(`${apiBase}/products/${id}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        initialProduct = json.data;
      }
    }
  } catch (e) {
    // Gracefully fallback
  }

  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: '#8c8c90' }}>
        Loading product...
      </div>
    }>
      <ProductDetailsClient id={id} initialProduct={initialProduct} />
    </Suspense>
  );
}
