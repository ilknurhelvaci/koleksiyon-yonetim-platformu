import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  tokens: AuthTokens | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  tokens: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    clearAuthTokens: (state) => {
      state.tokens = null;
      state.status = "idle";
    },
    setAuthLoading: (state) => {
      state.status = "loading";
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { setAuthTokens, clearAuthTokens, setAuthLoading, setAuthError } =
  authSlice.actions;

export default authSlice.reducer;
