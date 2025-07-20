import axios from "axios";
import { Collection, Filter, Product } from "@/types/collection";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Collection`;

export const getAllCollections = async (
  token: string
): Promise<Collection[]> => {
  try {
    const response = await axios.get<{ data: Collection[] }>(
      `${API_URL}/GetAll`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    throw new Error("API yanıt formatı beklenmedik.");
  } catch (error) {
    console.error("Koleksiyonlar getirilirken hata oluştu:", error);

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error("Yetkilendirme hatası (401). Token geçersiz veya eksik.");
    }
    throw new Error("Koleksiyonlar getirilemedi.");
  }
};

type AdditionalFilter = Record<string, unknown>;

export const getProductsForCollection = async (
  id: string,
  token: string,
  additionalFilters: AdditionalFilter[] = []
): Promise<Product[]> => {
  const requestBody = {
    additionalFilters,
    page: 1,
    pageSize: 100,
  };

  const response = await axios.post<{
    data: { data: Omit<Product, "id">[] };
  }>(`${API_URL}/${id}/GetProductsForConstants`, requestBody, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (
    response.data &&
    response.data.data &&
    Array.isArray(response.data.data.data)
  ) {
    return response.data.data.data.map((p) => ({
      ...p,
      id: `${p.productCode}-${p.colorCode}`,
    }));
  }
  throw new Error("Ürün verisi formatı beklenmedik.");
};

export const getFiltersForCollection = async (
  id: string,
  token: string
): Promise<Filter[]> => {
  const response = await axios.get<{ data: Filter[] }>(
    `${API_URL}/${id}/GetFiltersForConstants`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  throw new Error("Filtre verisi formatı beklenmedik.");
};
