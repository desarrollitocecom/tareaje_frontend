import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: null,
    user: null,
    loading: false,
    refresh: false
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
  }
});

export const {loginSuccess, logout, setLoading} = AuthSlice.actions

export default AuthSlice.reducer