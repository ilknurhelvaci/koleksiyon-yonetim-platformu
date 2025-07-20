import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Collection, CollectionState } from "@/types/collection";
import { getAllCollections } from "../services/collectionService";

const initialState: CollectionState = {
  collections: [],
  status: "idle",
  error: null,
};

interface ThunkError {
  message: string;
}

export const fetchCollections = createAsyncThunk<
  Collection[],
  string,
  { rejectValue: string }
>("collections/fetchCollections", async (token, { rejectWithValue }) => {
  try {
    const collections = await getAllCollections(token);
    return collections;
  } catch (error) {
    const err = error as ThunkError;
    return rejectWithValue(err.message);
  }
});

const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCollections.fulfilled,
        (state, action: PayloadAction<Collection[]>) => {
          state.status = "succeeded";
          state.collections = action.payload;
        }
      )
      .addCase(fetchCollections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Bir hata oluştu.";
      });
  },
});

export default collectionsSlice.reducer;
