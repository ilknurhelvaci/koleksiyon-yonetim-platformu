import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  EditCollectionState,
  Product,
  Filter,
} from "../../../types/collection";

import { RootState } from "../store";
import {
  getFiltersForCollection,
  getProductsForCollection,
} from "../services/collectionService";

const initialState: EditCollectionState = {
  products: [],
  filters: [],
  appliedFilters: {},
  status: "idle",
  error: null,
};

// ✔️ Thunk Error type tanımı
interface ThunkError {
  message: string;
}

// ✔️ fetchEditCollectionData thunk
export const fetchEditCollectionData = createAsyncThunk<
  { products: Product[]; filters: Filter[] }, // fulfilled return type
  { id: string; token: string }, // input param type
  { rejectValue: string } // rejected type
>("editCollection/fetchData", async ({ id, token }, { rejectWithValue }) => {
  try {
    const [products, filters] = await Promise.all([
      getProductsForCollection(id, token),
      getFiltersForCollection(id, token),
    ]);
    return { products, filters };
  } catch (error) {
    const err = error as ThunkError;
    return rejectWithValue(err.message);
  }
});

// ✔️ fetchFilteredProducts thunk
export const fetchFilteredProducts = createAsyncThunk<
  Product[], // fulfilled
  { id: string; token: string }, // arg
  { state: RootState; rejectValue: string } // extra options
>(
  "editCollection/fetchFilteredProducts",
  async ({ id, token }, { getState, rejectWithValue }) => {
    const state = getState();
    const { appliedFilters } = state.editCollection;

    const apiFilters = Object.entries(appliedFilters).flatMap(([key, values]) =>
      values.map((value) => ({ id: key, value, comparisonType: 0 }))
    );

    try {
      const products = await getProductsForCollection(id, token, apiFilters);
      return products;
    } catch (error) {
      const err = error as ThunkError;
      return rejectWithValue(err.message);
    }
  }
);

const editCollectionSlice = createSlice({
  name: "editCollection",
  initialState,
  reducers: {
    reorderProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },

    toggleFilter: (
      state,
      action: PayloadAction<{ filterId: string; value: string }>
    ) => {
      const { filterId, value } = action.payload;
      const currentValues = state.appliedFilters[filterId] || [];
      const valueIndex = currentValues.indexOf(value);

      if (valueIndex >= 0) {
        state.appliedFilters[filterId] = currentValues.filter(
          (v) => v !== value
        );
      } else {
        state.appliedFilters[filterId] = [...currentValues, value];
      }
    },

    resetEditState: () => initialState,

    setAppliedFilters: (
      state,
      action: PayloadAction<Record<string, string[]>>
    ) => {
      state.appliedFilters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEditCollectionData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEditCollectionData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.filters = action.payload.filters;
      })
      .addCase(fetchEditCollectionData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Bir hata oluştu.";
      })

      .addCase(fetchFilteredProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Bir hata oluştu.";
      });
  },
});

export const {
  reorderProducts,
  toggleFilter,
  resetEditState,
  setAppliedFilters,
} = editCollectionSlice.actions;

export default editCollectionSlice.reducer;
