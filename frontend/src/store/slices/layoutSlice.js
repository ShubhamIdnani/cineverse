import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isTrailerModalOpen: false,
  trailerVideoId: null, // YouTube video ID or null
  isDarkTheme: true, // Defaulting to the dark premium cinematic aesthetic
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    openTrailerModal: (state, action) => {
      state.isTrailerModalOpen = true;
      state.trailerVideoId = action.payload;
    },
    closeTrailerModal: (state) => {
      state.isTrailerModalOpen = false;
      state.trailerVideoId = null;
    },
    toggleTheme: (state) => {
      state.isDarkTheme = !state.isDarkTheme;
    },
  },
});

export const { openTrailerModal, closeTrailerModal, toggleTheme } = layoutSlice.actions;
export default layoutSlice.reducer;
