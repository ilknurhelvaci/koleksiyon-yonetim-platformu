"use client";

import { useDroppable } from "@dnd-kit/core";
import { Product } from "@/types/collection";

const PlaceholderIcon = () => (
  <svg
    className="w-16 h-16 text-gray-300"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m6-3l-2-2"
    ></path>
  </svg>
);

interface PinnedProductSlotProps {
  product: Product | null;
  index: number;
  onRemoveRequest: (productId: string) => void;
}

export default function PinnedProductSlot({
  product,
  index,
  onRemoveRequest,
}: PinnedProductSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `pinned-slot-${index}`,
  });

  const style = {
    borderColor: isOver ? "rgb(34 197 94)" : "black",
    borderWidth: "1px",
    borderStyle: "solid",
    transition: "border-color 150ms ease-in-out",
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative bg-white border rounded-lg shadow-sm overflow-hidden cursor-grab touch-none flex flex-col p-2 border-black"
    >
      {product ? (
        <>
          <div className="relative w-full aspect-square">
            <img
              src={product.imageUrl}
              alt={product.name || "Sabitlenmiş Ürün"}
              className="w-full h-full object-cover rounded-lg"
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveRequest(product.id);
              }}
              className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 focus:outline-none z-10"
              aria-label="Sabitten kaldır"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          <div className="px-2 py-1 text-center bg-white border-t border-gray-200">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium truncate text-[#000000]">
                {product?.productCode}
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative w-full aspect-square flex items-center justify-center ">
            <svg
              className="w-12 h-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
