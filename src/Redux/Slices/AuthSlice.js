import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: null,
    user: null,
    loading: false,
    
}

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
   },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
    },
  }
});

export const {loginSuccess, logout} = AuthSlice.actions

export default AuthSlice.reducer