import { createSlice } from '@reduxjs/toolkit';

const LoginSlice = createSlice({
  name: 'login',
  initialState: {
    loading: false,
  },
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state) => {
      state.loading = false;
    },
    loginFailure: (state) => {
      state.loading = false;
    },
  },
});

const { actions, reducer } = LoginSlice;

export const { loginRequest, loginSuccess, loginFailure } = actions;

export default reducer;
