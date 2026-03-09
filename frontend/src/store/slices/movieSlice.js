import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  trendingMovies: [],
  trendingTV: [],
  trendingAll: [],
  popularMovies: [],
  searchResults: [],
  moviesByKeyword: [],
  nowPlayingMovies: [],
  topRatedMovies: [],
  upcomingMovies: [],
  movieDetails: null,
  movieImages: null,
  movieVideos: null,
  tvGenres: [],
  discoverTV: [],
  indianMovies: [],
  indianTV: [],
  favorites: [],
  history: [],
  airingTodayTV: [],
  keywords: [],
  loading: false,
  error: null,
};

export const fetchTrending = createAsyncThunk(
  'movies/fetchTrending',
  async ({ type = 'movie', time = 'week', page = 1 }, thunkAPI) => {
    try {
      const { data } = await api.get(`/tmdb/trending/${type}/${time}?page=${page}`);
      return { data: data.results, page, append: page > 1, type };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSearch = createAsyncThunk(
  'movies/fetchSearch',
  async ({ query, type = 'multi', page = 1 }, thunkAPI) => {
    try {
      const { data } = await api.get(`/tmdb/search/${type}?query=${query}&page=${page}`);
      return data.results;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchDetails',
  async ({ id, type = 'movie' }, thunkAPI) => {
    try {
      const { data } = await api.get(`/tmdb/details/${type}/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchByKeyword = createAsyncThunk(
  'movies/fetchByKeyword',
  async ({ keywordId, page = 1 }, thunkAPI) => {
    try {
      const { data } = await api.get(`/tmdb/keyword/${keywordId}/movies?page=${page}`);
      return { data: data.results, page, append: page > 1 };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchNowPlaying = createAsyncThunk(
  'movies/fetchNowPlaying',
  async ({ page = 1 }, thunkAPI) => {
    try {
      const { data } = await api.get(`/tmdb/movie/now_playing?page=${page}`);
      return { data: data.results, page, append: page > 1 };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopularMovies',
  async ({ page = 1 }, thunkAPI) => {
    try {
      // Re-using the generic endpoint /popular/movie
      const { data } = await api.get(`/tmdb/popular/movie?page=${page}`);
      return { data: data.results, page, append: page > 1 };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTopRated = createAsyncThunk(
  'movies/fetchTopRated',
  async ({ page = 1 }, thunkAPI) => {
    try {
      const { data } = await api.get(`/tmdb/movie/top_rated?page=${page}`);
      return { data: data.results, page, append: page > 1 };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUpcoming = createAsyncThunk(
  'movies/fetchUpcoming',
  async ({ page = 1 }, thunkAPI) => {
    try {
      const { data } = await api.get(`/tmdb/movie/upcoming?page=${page}`);
      return { data: data.results, page, append: page > 1 };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchMovieImages = createAsyncThunk(
  'movies/fetchMovieImages',
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/tmdb/movie/${id}/images`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchMovieVideos = createAsyncThunk(
  'movies/fetchMovieVideos',
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/tmdb/movie/${id}/videos`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTVGenres = createAsyncThunk(
  'movies/fetchTVGenres',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/tmdb/genre/tv/list');
      return data.genres;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchDiscoverTV = createAsyncThunk(
  'movies/fetchDiscoverTV',
  async ({ page = 1 } = {}, thunkAPI) => {
    try {
      const { data } = await api.get(`/tmdb/discover/tv?page=${page}`);
      return { data: data.results, page, append: page > 1 };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTVVideos = createAsyncThunk(
  'movies/fetchTVVideos',
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/tmdb/tv/${id}/videos`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchIndianContent = createAsyncThunk(
  'movies/fetchIndianContent',
  async ({ type = 'movie', page = 1 }, thunkAPI) => {
    try {
      const { data } = await api.get(`/tmdb/indian/${type}?page=${page}`);
      return { data: data.results, page, append: page > 1, type };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTVAiringToday = createAsyncThunk(
  'movies/fetchTVAiringToday',
  async ({ page = 1 }, thunkAPI) => {
    try {
      const { data } = await api.get(`/tmdb/tv/airing_today?page=${page}`);
      return { data: data.results, page, append: page > 1 };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const searchKeywords = createAsyncThunk(
  'movies/searchKeywords',
  async ({ query, page = 1 }, thunkAPI) => {
    try {
      const { data } = await api.get(`/tmdb/search/keyword?query=${query}&page=${page}`);
      return data.results;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.searchResults = [];
    },
    clearDetails: (state) => {
      state.movieDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.loading = false;
        const { type, append, data } = action.payload;
        if (type === 'movie') {
          state.trendingMovies = append ? [...state.trendingMovies, ...data] : data;
        } else if (type === 'tv') {
          state.trendingTV = append ? [...state.trendingTV, ...data] : data;
        } else {
          state.trendingAll = append ? [...state.trendingAll, ...data] : data;
        }
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchSearch.pending, (state) => { state.loading = true; })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.page > 1) {
          state.searchResults = [...state.searchResults, ...action.payload];
        } else {
          state.searchResults = action.payload;
        }
      })
      
      .addCase(fetchMovieDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.movieDetails = action.payload;
      })
      
      .addCase(fetchByKeyword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchByKeyword.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.append) {
          state.moviesByKeyword = [...state.moviesByKeyword, ...action.payload.data];
        } else {
          state.moviesByKeyword = action.payload.data;
        }
      })
      .addCase(fetchByKeyword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchNowPlaying.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchNowPlaying.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.append) {
          state.nowPlayingMovies = [...state.nowPlayingMovies, ...action.payload.data];
        } else {
          state.nowPlayingMovies = action.payload.data;
        }
      })
      .addCase(fetchNowPlaying.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchPopularMovies.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.append) {
          state.popularMovies = [...state.popularMovies, ...action.payload.data];
        } else {
          state.popularMovies = action.payload.data;
        }
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchTopRated.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTopRated.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.append) {
          state.topRatedMovies = [...state.topRatedMovies, ...action.payload.data];
        } else {
          state.topRatedMovies = action.payload.data;
        }
      })
      .addCase(fetchTopRated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchUpcoming.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUpcoming.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.append) {
          state.upcomingMovies = [...state.upcomingMovies, ...action.payload.data];
        } else {
          state.upcomingMovies = action.payload.data;
        }
      })
      .addCase(fetchUpcoming.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchMovieImages.pending, (state) => { state.loading = true; })
      .addCase(fetchMovieImages.fulfilled, (state, action) => {
        state.loading = false;
        state.movieImages = action.payload;
      })
      .addCase(fetchMovieImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMovieVideos.pending, (state) => { state.loading = true; })
      .addCase(fetchMovieVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.movieVideos = action.payload;
      })
      .addCase(fetchMovieVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTVGenres.pending, (state) => { state.loading = true; })
      .addCase(fetchTVGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.tvGenres = action.payload;
      })
      .addCase(fetchTVGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchDiscoverTV.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDiscoverTV.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.append) {
          state.discoverTV = [...state.discoverTV, ...action.payload.data];
        } else {
          state.discoverTV = action.payload.data;
        }
      })
      .addCase(fetchDiscoverTV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTVVideos.pending, (state) => { state.loading = true; })
      .addCase(fetchTVVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.movieVideos = action.payload; // Reuse movieVideos or make generic? User said "show" so I'll reuse or rename state. For now reuse.
      })
      .addCase(fetchTVVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchIndianContent.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchIndianContent.fulfilled, (state, action) => {
        state.loading = false;
        const { data, append, type } = action.payload;
        if (type === 'movie') {
          state.indianMovies = append ? [...state.indianMovies, ...data] : data;
        } else {
          state.indianTV = append ? [...state.indianTV, ...data] : data;
        }
      })
      .addCase(fetchIndianContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTVAiringToday.pending, (state) => { state.loading = true; })
      .addCase(fetchTVAiringToday.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.append) {
          state.airingTodayTV = [...state.airingTodayTV, ...action.payload.data];
        } else {
          state.airingTodayTV = action.payload.data;
        }
      })
      .addCase(searchKeywords.fulfilled, (state, action) => {
        state.keywords = action.payload;
      });
  },
});

export const { clearSearch, clearDetails } = movieSlice.actions;
export default movieSlice.reducer;
