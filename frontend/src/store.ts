import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import LoginReducer from './slices/Login';

const reducer = combineReducers({
  login: LoginReducer,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
