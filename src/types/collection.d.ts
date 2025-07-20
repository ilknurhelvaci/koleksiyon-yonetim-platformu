export interface CollectionInfo {
  id: number;
  name: string;
  description: string;
  url: string;
  langCode: string;
}

export interface Collection {
  id: number;
  filters: Record<string, unknown>;
  type: number;
  info: CollectionInfo;
  salesChannelId: number;
  products: Product[] | null;
}

export interface CollectionState {
  collections: Collection[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface Product {
  productCode: string;
  colorCode: string;
  name: string | null;
  imageUrl: string;

  id: string;
}

export interface FilterValue {
  value: string;
  valueName: string | null;
}

export interface Filter {
  id: string;
  title: string;
  values: FilterValue[];
}

export interface EditCollectionState {
  products: Product[];
  filters: Filter[];
  appliedFilters: Record<string, string[]>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
