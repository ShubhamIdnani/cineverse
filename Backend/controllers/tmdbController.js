import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const fetchFromTMDB = async (url) => {
  try {
    const res = await axios.get(url, {
      params: { api_key: process.env.TMDB_API_KEY },
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('TMDB Fetch Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.status_message || error.message || 'TMDB API error');
  }
};

// @desc    Get trending movies/tv/all/person
// @route   GET /api/tmdb/trending/:type/:time
export const getTrending = async (req, res, next) => {
  try {
    const { type, time } = req.params; // type: movie/tv/all/person, time: day/week
    const page = req.query.page || 1;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/trending/${type}/${time}?page=${page}`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular by type (movie/tv)
// @route   GET /api/tmdb/popular/:type
export const getPopular = async (req, res, next) => {
  try {
    const { type } = req.params;
    const page = req.query.page || 1;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/${type}/popular?page=${page}`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Search (multi/movie/tv/person)
// @route   GET /api/tmdb/search/:type
export const searchTMDB = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { query, page } = req.query;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/search/${type}?query=${encodeURIComponent(query)}&page=${page || 1}`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get full details with videos, credits, similar
// @route   GET /api/tmdb/details/:type/:id
export const getDetails = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/${type}/${id}?append_to_response=videos,credits,similar`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get movies by keyword
// @route   GET /api/tmdb/keyword/:keywordId/movies
export const getMoviesByKeyword = async (req, res, next) => {
  try {
    const { keywordId } = req.params;
    const page = req.query.page || 1;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/keyword/${keywordId}/movies?page=${page}`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get now playing movies
// @route   GET /api/tmdb/movie/now_playing
export const getNowPlaying = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/movie/now_playing?page=${page}`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get top rated movies
// @route   GET /api/tmdb/movie/top_rated
export const getTopRated = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/movie/top_rated?page=${page}`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming movies
// @route   GET /api/tmdb/movie/upcoming
export const getUpcoming = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/movie/upcoming?page=${page}`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get movie images
// @route   GET /api/tmdb/movie/:id/images
export const getImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/movie/${id}/images`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get movie videos (trailers, clips, etc.)
// @route   GET /api/tmdb/movie/:id/videos
export const getMovieVideos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/movie/${id}/videos`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Movie genres
// @route   GET /api/tmdb/genre/movie/list
export const getMovieGenres = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/genre/movie/list`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get TV genres
// @route   GET /api/tmdb/genre/tv/list
export const getTVGenres = async (req, res, next) => {
  try {
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/genre/tv/list`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Discover TV
// @route   GET /api/tmdb/discover/tv
export const getDiscoverTV = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/discover/tv?page=${page}`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
// @desc    Get Indian content (Movies/TV)
// @route   GET /api/tmdb/indian/:type
export const getIndianContent = async (req, res, next) => {
  try {
    const { type } = req.params; // movie or tv
    const page = req.query.page || 1;
    // Discover with Hindi language and origin country IN
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/discover/${type}?with_original_language=hi&region=IN&with_origin_country=IN&page=${page}`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get TV videos
// @route   GET /api/tmdb/tv/:id/videos
export const getTVVideos = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/tv/${id}/videos`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get TV season watch providers
// @route   GET /api/tmdb/tv/:id/season/:season_number/watch/providers
export const getTVSeasonWatchProviders = async (req, res, next) => {
  try {
    const { id, season_number } = req.params;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/tv/${id}/season/${season_number}/watch/providers`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get TV episode videos
// @route   GET /api/tmdb/tv/:id/season/:season_number/episode/:episode_number/videos
export const getTVEpisodeVideos = async (req, res, next) => {
  try {
    const { id, season_number, episode_number } = req.params;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/tv/${id}/season/${season_number}/episode/${episode_number}/videos`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get TV episode images
// @route   GET /api/tmdb/tv/:id/season/:season_number/episode/:episode_number/images
export const getTVEpisodeImages = async (req, res, next) => {
  try {
    const { id, season_number, episode_number } = req.params;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/tv/${id}/season/${season_number}/episode/${episode_number}/images`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Get TV episode translations
// @route   GET /api/tmdb/tv/:id/season/:season_number/episode/:episode_number/translations
export const getTVEpisodeTranslations = async (req, res, next) => {
  try {
    const { id, season_number, episode_number } = req.params;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/tv/${id}/season/${season_number}/episode/${episode_number}/translations`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
// @desc    Get TV airing today
// @route   GET /api/tmdb/tv/airing_today
export const getTVAiringToday = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/tv/airing_today?page=${page}`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Search Keywords
// @route   GET /api/tmdb/search/keyword
export const searchKeywords = async (req, res, next) => {
  try {
    const { query, page } = req.query;
    const data = await fetchFromTMDB(`${TMDB_BASE_URL}/search/keyword?query=${encodeURIComponent(query)}&page=${page || 1}`);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
