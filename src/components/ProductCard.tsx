"use client";

import { Product } from "@/types/collection";
import { memo } from "react";
import { useDraggable } from "@dnd-kit/core";

interface ProductCardProps {
  product: Product;
  isPinned: boolean;
}

const ProductCard = memo(function ProductCard({
  product,
  isPinned,
}: ProductCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${product.id}`,
    data: {
      product: product,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined;

  function getLastWord(str?: string | null) {
    if (!str) return "";
    const parts = str.trim().split(/\s+/);
    return parts[parts.length - 1];
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="relative bg-white border rounded-lg shadow-sm overflow-hidden cursor-grab touch-none flex flex-col p-2"
    >
      <div className="relative w-full aspect-square">
        <img
          src={product.imageUrl}
          alt={product.name || "Ürün"}
          className="w-full h-full object-cover select-none"
          draggable="false"
        />
      </div>

      <div className="px-2 py-1 text-center bg-white border-t border-gray-200">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-[#000000] font-medium truncate">
            {getLastWord(product?.name)}
          </span>
          <span className="text-xs  font-medium truncate text-[#000000]">
            {product?.productCode}
          </span>
        </div>
      </div>

      {isPinned && (
        <div className="absolute inset-0 z-2 backdrop-blur-sm bg-black/30 flex items-center justify-center">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0">
            <div className="mx-auto w-40 text-center bg-black/85 text-white text-xs font-medium py-1 rounded-sm tracking-wide shadow">
              Eklendi
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ProductCard;
