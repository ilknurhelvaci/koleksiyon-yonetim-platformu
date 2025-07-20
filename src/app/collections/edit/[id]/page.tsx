"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchEditCollectionData,
  resetEditState,
  setAppliedFilters,
  fetchFilteredProducts,
} from "@/lib/redux/slices/editCollectionSlice";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import FilterModal from "@/components/FilterModal";
import ProductGrid from "@/components/ProductGrid";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import { Product } from "@/types/collection";
import PinnedProductSlot from "@/components/PinnedProductSlot";
import ConfirmationModal from "@/components/ConfirmationModal";
import InfoModal from "@/components/InfoModal";

export default function EditCollectionPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const { products, filters, appliedFilters, status, error } = useSelector(
    (state: RootState) => state.editCollection
  );

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [productToRemove, setProductToRemove] = useState<Product | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [isSaveConfirmModalOpen, setIsSaveConfirmModalOpen] = useState(false);
  const [isCancelConfirmModalOpen, setIsCancelConfirmModalOpen] =
    useState(false);

  const [pinnedProducts, setPinnedProducts] = useState<(Product | null)[]>(
    Array(6).fill(null)
  );
  const [pinnedProductIds, setPinnedProductIds] = useState(
    () => new Set<string>()
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (session?.accessToken && id) {
      dispatch(fetchEditCollectionData({ id, token: session.accessToken }));
    }

    return () => {
      dispatch(resetEditState());
    };
  }, [id, session, dispatch]);

  const handleRemoveRequest = (productId: string) => {
    const product = pinnedProducts.find((p) => p?.id === productId) || null;
    setProductToRemove(product);
    setIsRemoveModalOpen(true);
  };
  const handleConfirmRemove = () => {
    if (!productToRemove) return;

    setPinnedProducts((prev) =>
      prev.map((p) => (p?.id === productToRemove.id ? null : p))
    );

    setPinnedProductIds((prev) => {
      const newIds = new Set(prev);
      newIds.delete(productToRemove.id);
      return newIds;
    });

    setIsRemoveModalOpen(false);

    setIsSuccessModalOpen(true);
    setProductToRemove(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !over.id.toString().startsWith("pinned-slot-")) {
      return;
    }

    const productToPin = active.data.current?.product as Product;
    if (!productToPin) return;

    if (pinnedProductIds.has(productToPin.id)) {
      console.log("Bu ürün zaten sabitlenmiş.");
      return;
    }

    const slotIndex = parseInt(over.id.toString().split("-")[2], 10);

    setPinnedProducts((prev) => {
      const newPinned = [...prev];
      newPinned[slotIndex] = productToPin;
      return newPinned;
    });

    setPinnedProductIds((prev) => {
      const newIds = new Set(prev);
      newIds.add(productToPin.id);
      return newIds;
    });
  };

  const handleCancel = () => {
    router.push("/collections");
  };
  const handleSave = () => {
    setIsSaveModalOpen(true);
  };

  const handleApplyFilters = (newFilters: Record<string, string[]>) => {
    dispatch(setAppliedFilters(newFilters));
    if (session?.accessToken && id) {
      dispatch(fetchFilteredProducts({ id, token: session.accessToken }));
    }
  };

  const getFilterDisplayInfo = (filterId: string, value: string) => {
    const filter = filters.find((f) => f.id === filterId);
    const filterValue = filter?.values.find((v) => v.value === value);
    return {
      category: filter?.title || filterId,
      name: filterValue?.valueName || value,
    };
  };

  // vazgec butonuna tıklandığında
  const handleConfirmCancel = () => {
    router.push("/collections");
  };
  // kaydet butonuna tıklanıldığında
  const handleConfirmSave = () => {
    setIsSaveConfirmModalOpen(false); // Onay modalını kapat
    setIsSaveModalOpen(true); // Asıl kaydetme modalını aç
  };

  const handleFinalSave = () => {
    console.log("Değişiklikler kaydediliyor...");

    setIsSaveModalOpen(false); // İşlem sonrası modalı kapat
  };

  if (status === "loading" && products.length === 0)
    return (
      <div className="flex justify-center items-center h-screen">
        Yükleniyor...
      </div>
    );
  if (status === "failed")
    return (
      <div className="flex justify-center items-center h-screen">
        Hata: {error}
      </div>
    );

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex h-screen p-[10px] gap-[20px]">
        <Sidebar />

        <div className="flex-1 flex flex-col  gap-[10px]">
          <Header
            title="Sabitleri Düzenle"
            subtitle={`Koleksiyon - ${params?.id ? params?.id : ""} / ${
              products.length ? products.length : "0"
            } Ürün`}
          />
          <div className=" border border-[#9F9EA0] rounded-[8.57px] p-[30px]">
            <main className="flex-1 flex flex-col p-4 gap-4">
              {/*  Arama ve Filtre */}
              <div className="flex items-center justify-between gap-10">
                <div className="flex items-center gap-2 flex-wrap  w-full px-4 py-2 rounded-md border border-[#9F9EA0]">
                  {Object.keys(appliedFilters).length > 0 ? (
                    Object.entries(appliedFilters).flatMap(
                      ([filterId, values]) =>
                        values.map((value) => {
                          const { category, name } = getFilterDisplayInfo(
                            filterId,
                            value
                          );
                          return (
                            <span
                              key={`${filterId}-${value}`}
                              className="inline-flex items-center gap-x-1.5 rounded-md border border-black bg-white px-2.5 py-1 text-[16px]  text-black font-light"
                            >
                              <span className="font-semibold">{category}:</span>{" "}
                              {name}
                            </span>
                          );
                        })
                    )
                  ) : (
                    <div className="text-sm text-gray-500  py-2.5">
                      {/* Aktif filtre bulunmuyor. */}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
                  >
                    Filtreler
                  </button>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button className="p-2 border-r border-gray-300">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button className="p-2 bg-gray-200">
                      {/* SVG icon for grid view (selected) */}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Görseller */}

              {/* <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            > */}
              <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Koleksiyon Ürünleri */}
                <div className="flex-1 flex flex-col gap-2.5  max-h-[700px]">
                  <h2 className=" text-[12px] font-bold   text-[#000000] ">
                    Koleksiyon Ürünleri
                  </h2>
                  <div className="flex-1 p-4 overflow-y-auto border border-[#000000] rounded-lg">
                    <ProductGrid
                      products={products}
                      pinnedProductIds={pinnedProductIds}
                    />
                    {status === "loading" && (
                      <div className="mt-4 text-center">
                        Ürünler güncelleniyor...
                      </div>
                    )}
                  </div>
                </div>

                {/* Sabitler */}
                <div className="flex-1 flex flex-col gap-2.5 max-h-[700px]">
                  <h2 className="text-[12px] font-bold text-black">Sabitler</h2>

                  <div className="relative flex-1 p-4 overflow-y-auto border border-black rounded-lg">
                    <div className="grid grid-cols-3 gap-4 pb-16">
                      {pinnedProducts.map((product, index) => (
                        <PinnedProductSlot
                          key={index}
                          index={index}
                          product={product}
                          onRemoveRequest={() =>
                            product ? handleRemoveRequest(product.id) : null
                          }
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded  text-sm">
                      <button className="p-1">&lt;</button>
                      <button className="px-3 py-1 bg-[#000000] rounded border border-[#000000] text-white">
                        1
                      </button>
                      <button className="px-3 py-1 rounded hover:bg-[#000000] border border-[#000000]">
                        2
                      </button>
                      <button className="px-3 py-1 rounded hover:bg-[#000000] border border-[#000000]">
                        3
                      </button>
                      <button className="px-3 py-1 rounded hover:bg-[#000000] border border-[#000000]">
                        4
                      </button>
                      <button className="p-1">&gt;</button>
                    </div>
                  </div>
                </div>
              </div>
              {/* </DndContext> */}

              <div className="flex justify-end items-center gap-4 pt-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-[#1C1C1C] text-white rounded-md font-medium"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-black text-white rounded-md font-medium"
                >
                  Kaydet
                </button>
              </div>
            </main>
          </div>
        </div>
        <ConfirmationModal
          isOpen={isRemoveModalOpen}
          onClose={() => setIsRemoveModalOpen(false)}
          onConfirm={handleConfirmRemove}
          title="Uyarı"
          message={`"${
            productToRemove?.name || "Bu ürün"
          }" sabitlerden kaldırılacaktır. Emin misiniz?`}
        />

        <InfoModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          title="Başarılı"
          message="Sabitler içerisinde çıkarıldı."
        />
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filters={filters}
          initialAppliedFilters={appliedFilters}
          onApply={handleApplyFilters}
        />

        <ConfirmationModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          onConfirm={handleFinalSave}
          title="Uyarı"
          message={`Yaptığınız tüm değişiklikler kalıcı olarak kaydedilecektir. Bu
            işlemi onaylıyor musunuz?`}
        />

        <ConfirmationModal
          isOpen={isCancelConfirmModalOpen}
          onClose={() => setIsCancelConfirmModalOpen(false)}
          onConfirm={handleConfirmCancel}
          title="Vazgeç"
          message="Kaydedilmemiş değişiklikleriniz kaybolacak. Devam etmek istediğinize emin misiniz?"
        />
      </div>
    </DndContext>
  );
}
