// components/ProductGrid.tsx

"use client";

import { Product } from "@/types/collection";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  pinnedProductIds: Set<string>;
}

export default function ProductGrid({
  products,
  pinnedProductIds,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Filtre kriterlerine uygun ürün bulunamadı.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isPinned={pinnedProductIds.has(product.id)}
        />
      ))}
    </div>
  );
}
