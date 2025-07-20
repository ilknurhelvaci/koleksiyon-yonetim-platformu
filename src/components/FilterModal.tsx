"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { Filter } from "@/types/collection";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filter[];
  initialAppliedFilters: Record<string, string[]>;
  onApply: (appliedFilters: Record<string, string[]>) => void;
}

export default function FilterModal({
  isOpen,
  onClose,
  filters,
  initialAppliedFilters,
  onApply,
}: FilterModalProps) {
  const [localAppliedFilters, setLocalAppliedFilters] = useState(
    initialAppliedFilters
  );

  const [minStock, setMinStock] = useState("");
  const [maxStock, setMaxStock] = useState("");
  const [allSizesInStock, setAllSizesInStock] = useState(false);

  useEffect(() => {
    const standardFilters = { ...initialAppliedFilters };
    if (standardFilters.stock) {
      delete standardFilters.stock;
    }
    setLocalAppliedFilters(standardFilters);

    const stockValues = initialAppliedFilters.stock || [];
    const min =
      stockValues.find((v) => v.startsWith("min:"))?.split(":")[1] || "";
    const max =
      stockValues.find((v) => v.startsWith("max:"))?.split(":")[1] || "";
    const allSizes = stockValues.includes("allSizes:true");

    setMinStock(min);
    setMaxStock(max);
    setAllSizesInStock(allSizes);
  }, [isOpen, initialAppliedFilters]);

  const handleToggleFilter = (filterId: string, value: string) => {
    setLocalAppliedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      const currentValues = newFilters[filterId] || [];
      const valueIndex = currentValues.indexOf(value);

      if (valueIndex >= 0) {
        newFilters[filterId] = currentValues.filter((v) => v !== value);
        if (newFilters[filterId].length === 0) {
          delete newFilters[filterId];
        }
      } else {
        newFilters[filterId] = [...currentValues, value];
      }
      return newFilters;
    });
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    filterId: string
  ) => {
    const selectedValue = e.target.value;
    if (!selectedValue) return;

    const currentValues = localAppliedFilters[filterId] || [];
    if (!currentValues.includes(selectedValue)) {
      handleToggleFilter(filterId, selectedValue);
    }

    e.target.value = "";
  };

  const handleClear = () => {
    setLocalAppliedFilters({});
    setMinStock("");
    setMaxStock("");
    setAllSizesInStock(false);
  };

  const handleApply = () => {
    const finalFilters = { ...localAppliedFilters };
    const stockFilterValues: string[] = [];

    if (minStock) stockFilterValues.push(`min:${minStock}`);
    if (maxStock) stockFilterValues.push(`max:${maxStock}`);
    if (allSizesInStock) stockFilterValues.push("allSizes:true");

    if (stockFilterValues.length > 0) {
      finalFilters.stock = stockFilterValues;
    }

    onApply(finalFilters);
    onClose();
  };

  const getFilterValueName = (filterId: string, value: string) => {
    const filter = filters.find((f) => f.id === filterId);
    const filterValue = filter?.values.find((v) => v.value === value);
    return filterValue?.valueName || value;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all flex flex-col h-[80vh] max-h-[700px]">
                <div className="flex-shrink-0 p-6 pb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                  >
                    Filtreler
                    <button
                      onClick={onClose}
                      className="p-1 rounded-full hover:bg-gray-200"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </Dialog.Title>
                </div>

                <div className="flex-grow overflow-y-auto px-6 py-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filters
                      .filter((f) => f.values && f.values.length > 0)
                      .map((filter) => (
                        // filter.id === "stock" ? (
                        //   // Stok Filtresi (Özel Tasarım)
                        //   <div
                        //     key={filter.id}
                        //     className="p-4 rounded-lg bg-gray-50"
                        //   >
                        //     <label className="font-semibold mb-2 block text-gray-700">
                        //       {filter.title}
                        //     </label>
                        //     <div className="flex items-center gap-2 mb-3">
                        //       <input
                        //         type="number"
                        //         placeholder="Min"
                        //         value={minStock}
                        //         onChange={(e) => setMinStock(e.target.value)}
                        //         className="w-full p-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        //       />
                        //       <input
                        //         type="number"
                        //         placeholder="Max"
                        //         value={maxStock}
                        //         onChange={(e) => setMaxStock(e.target.value)}
                        //         className="w-full p-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        //       />
                        //     </div>
                        //     <div className="flex items-center">
                        //       <input
                        //         type="checkbox"
                        //         id="all-sizes-stock"
                        //         checked={allSizesInStock}
                        //         onChange={(e) =>
                        //           setAllSizesInStock(e.target.checked)
                        //         }
                        //         className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        //       />
                        //       <label
                        //         htmlFor="all-sizes-stock"
                        //         className="ml-2 block text-sm text-gray-900"
                        //       >
                        //         Tüm bedenlerde stok olanlar
                        //       </label>
                        //     </div>
                        //   </div>
                        // ) :
                        // Diğer Filtreler (Yeni Tasarım)
                        <div key={filter.id}>
                          <select
                            id={`filter-${filter.id}`}
                            onChange={(e) => handleSelectChange(e, filter.id)}
                            className="w-full p-3  rounded-md border border-black focus:ring-gray-300 focus:border-gray-300 font-light text-gray-600 text-[12px] "
                          >
                            <option value="" disabled selected>
                              {filter.title}
                            </option>
                            {filter.values.map((val, index) => (
                              <option key={index} value={val.value}>
                                {val.valueName || val.value}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex-shrink-0 border-t border-gray-200 mt-4 p-6">
                  <div>
                    <h4 className=" text-[12px] font-bold   text-[#000000] mb-2">
                      Uygulanan Kriterler
                    </h4>
                    <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50 min-h-[48px] items-center">
                      {Object.keys(localAppliedFilters).length === 0 &&
                      !minStock &&
                      !maxStock &&
                      !allSizesInStock ? (
                        <p className="text-sm text-gray-500 px-2"></p>
                      ) : (
                        <>
                          {Object.entries(localAppliedFilters).map(
                            ([filterId, values]) =>
                              values.map((value) => (
                                <span
                                  key={`${filterId}-${value}`}
                                  className="inline-flex items-center gap-x-1.5 rounded-md  bg-white px-3 py-1 text-sm font-medium text-black border border-black"
                                >
                                  {getFilterValueName(filterId, value)}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleToggleFilter(filterId, value)
                                    }
                                    className="group relative -mr-1 h-5 w-5 rounded-md"
                                  >
                                    <XMarkIcon className="h-5 w-5 text-gray-700 group-hover:text-gray-800" />
                                  </button>
                                </span>
                              ))
                          )}

                          {minStock && (
                            <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800">
                              Min Stok: {minStock}
                            </span>
                          )}
                          {maxStock && (
                            <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800">
                              Max Stok: {maxStock}
                            </span>
                          )}
                          {allSizesInStock && (
                            <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800">
                              Tüm Bedenler Stokta
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center gap-8">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="inline-flex w-[250px]  text-sm font-medium justify-center rounded-md border border-black bg-black px-4 py-2  text-white  focus:outline-none"
                    >
                      Seçimi Temizle
                    </button>
                    <button
                      type="button"
                      onClick={handleApply}
                      className="inline-flex w-[250px]  text-sm font-medium justify-center rounded-md border border-black bg-white px-4 py-2  text-black  focus:outline-none"
                    >
                      Ara
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
