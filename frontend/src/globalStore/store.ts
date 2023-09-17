import { configureStore } from '@reduxjs/toolkit';
import authorizationReducer from './authorizationSlice';

export default configureStore({
  reducer: {
    authorization: authorizationReducer
  }
});