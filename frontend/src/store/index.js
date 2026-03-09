import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import movieReducer from './slices/movieSlice';
import layoutReducer from './slices/layoutSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    layout: layoutReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
