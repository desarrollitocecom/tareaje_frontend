import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: null,
    user: null,
    loading: false,
    refresh: false,
    moduleLoading: false,
    isLogin: false,
}

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
   },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    moduleLoading: (state, action) => {
      state.moduleLoading = action.payload;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
  }
});

export const {loginSuccess, logout, setLoading, moduleLoading, setIsLogin} = AuthSlice.actions

export default AuthSlice.reducer