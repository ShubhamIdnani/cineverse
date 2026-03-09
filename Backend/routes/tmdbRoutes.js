import express from 'express';
import {
  getTrending,
  getPopular,
  searchTMDB,
  getDetails,
  getMoviesByKeyword,
  getNowPlaying,
  getTopRated,
  getUpcoming,
  getImages,
  getMovieVideos,
  getMovieGenres,
  getTVGenres,
  getDiscoverTV,
  getTVVideos,
  getIndianContent,
  getTVSeasonWatchProviders,
  getTVEpisodeVideos,
  getTVEpisodeImages,
  getTVEpisodeTranslations,
  getTVAiringToday,
  searchKeywords,
} from '../controllers/tmdbController.js';

const router = express.Router();

router.get('/trending/:type/:time', getTrending);
router.get('/popular/:type', getPopular);
router.get('/search/:type', searchTMDB);
router.get('/details/:type/:id', getDetails);
router.get('/keyword/:keywordId/movies', getMoviesByKeyword);
// Static /movie/* routes MUST come before /movie/:id/* to avoid param conflicts
router.get('/movie/now_playing', getNowPlaying);
router.get('/movie/top_rated', getTopRated);
router.get('/movie/upcoming', getUpcoming);
router.get('/movie/:id/videos', getMovieVideos);
router.get('/movie/:id/images', getImages);
router.get('/genre/movie/list', getMovieGenres);
router.get('/genre/tv/list', getTVGenres);
router.get('/discover/tv', getDiscoverTV);
router.get('/tv/:id/videos', getTVVideos);
router.get('/indian/:type', getIndianContent);
router.get('/tv/:id/season/:season_number/watch/providers', getTVSeasonWatchProviders);
router.get('/tv/:id/season/:season_number/episode/:episode_number/videos', getTVEpisodeVideos);
router.get('/tv/:id/season/:season_number/episode/:episode_number/images', getTVEpisodeImages);
router.get('/tv/:id/season/:season_number/episode/:episode_number/translations', getTVEpisodeTranslations);
router.get('/tv/airing_today', getTVAiringToday);
router.get('/search/keyword', searchKeywords);

export default router;
