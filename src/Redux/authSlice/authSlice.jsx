import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload.user };
    },
    updateUserRole: (state, action) => {
      if (state.user) {
        state.user.role = action.payload.role;
      }
    },
    refreshTokenSuccess: (state, action) => {
      state.accessToken = action.payload.accessToken; 
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const selectIsAuthenticated = (state) => Boolean(state.auth.accessToken);

export const { loginSuccess, logout, updateUser, updateUserRole,refreshTokenSuccess } =
  authSlice.actions;

export default authSlice.reducer;
