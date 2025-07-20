import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import collectionsReducer from "./slices/collectionSlice";
import editCollectionReducer from "./slices/editCollectionSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      collections: collectionsReducer,
      editCollection: editCollectionReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
