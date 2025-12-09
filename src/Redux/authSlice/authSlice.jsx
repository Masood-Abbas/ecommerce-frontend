import { createSlice } from "@reduxjs/toolkit";

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: user,
    accessToken: accessToken,
    refreshToken: refreshToken,
    isAuthenticated: !!accessToken,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      //   store data in localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
        //   remove data from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    // update user
     updateUser: (state, action) => {

      console.log("update-action",action.payload.user)
      state.user = { ...state.user, ...action.payload.user };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { loginSuccess, logout,updateUser } = authSlice.actions;

export default authSlice.reducer;