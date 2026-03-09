import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { fetchTrending, fetchPopularMovies, fetchNowPlaying, fetchUpcoming, fetchTopRated, fetchDiscoverTV, fetchIndianContent, fetchTVAiringToday } from '../store/slices/movieSlice';
import MovieCarousel from '../components/MovieCarousel';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { 
    trendingMovies, 
    trendingTV,
    trendingAll,
    popularMovies, 
    nowPlayingMovies, 
    upcomingMovies, 
    topRatedMovies,
    discoverTV,
    indianMovies,
    airingTodayTV,
    loading 
  } = useSelector((state) => state.movies);

  // We only increment page for trending to keep infinite scroll for the first banner/list if we want,
  // but for a Netflix style layout we usually load just page 1 for all rows, then maybe more internally.
  // For simplicity, let's just fetch page 1 of everything on mount.
  useEffect(() => {
    dispatch(fetchTrending({ type: 'all', time: 'week', page: 1 }));
    dispatch(fetchTrending({ type: 'movie', time: 'week', page: 1 }));
    dispatch(fetchTrending({ type: 'tv', time: 'week', page: 1 }));
    dispatch(fetchPopularMovies({ page: 1 }));
    dispatch(fetchNowPlaying({ page: 1 }));
    dispatch(fetchUpcoming({ page: 1 }));
    dispatch(fetchTopRated({ page: 1 }));
    dispatch(fetchDiscoverTV({ page: 1 }));
    dispatch(fetchIndianContent({ type: 'movie', page: 1 }));
    dispatch(fetchTVAiringToday({ page: 1 }));
  }, [dispatch]);

  return (
    <div className="home-page">
      {/* Hero Banner Area */}
      {trendingAll.length > 0 && (
        <section className="hero-banner" style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${trendingAll[0]?.backdrop_path})`
        }}>
          <div className="hero-overlay"></div>
          <div className="container hero-content">
            <h1 className="hero-title">{trendingAll[0]?.title || trendingAll[0]?.name}</h1>
            <p className="hero-overview line-clamp-3">{trendingAll[0]?.overview}</p>
            
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to={`/${trendingAll[0]?.media_type || 'movie'}/${trendingAll[0]?.id}`} className="btn-primary" style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '0.9rem 2.2rem' }}>
                <Play size={20} fill="currentColor" /> Play Now
              </Link>
              
              <Link 
                to={`/${trendingAll[0]?.media_type || 'movie'}/${trendingAll[0]?.id}`} 
                className="btn-outline" 
                style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  alignItems: 'center', 
                  padding: '0.9rem 2.2rem',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  borderRadius: '24px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}
              >
                <Info size={20} /> View Details
              </Link>
            </div>
          </div>
        </section>
      )}

      <div style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <MovieCarousel 
          title="Trending This Week" 
          movies={trendingMovies} 
          loading={loading && trendingMovies.length === 0} 
        />
        
        <MovieCarousel 
          title="Now Playing in Theaters" 
          movies={nowPlayingMovies} 
          loading={loading && nowPlayingMovies.length === 0} 
        />
        
        <MovieCarousel 
          title="Popular Movies" 
          movies={popularMovies} 
          loading={loading && popularMovies.length === 0} 
        />
        
        <MovieCarousel 
          title="Upcoming Releases" 
          movies={upcomingMovies} 
          loading={loading && upcomingMovies.length === 0} 
        />
        
        <MovieCarousel 
          title="Highest Rated of All Time" 
          movies={topRatedMovies} 
          loading={loading && topRatedMovies.length === 0} 
        />

        <MovieCarousel 
          title="Popular TV Shows" 
          movies={discoverTV} 
          type="tv"
          loading={loading && discoverTV.length === 0} 
        />

        <MovieCarousel 
          title="Live Today (TV Shows)" 
          movies={airingTodayTV} 
          type="tv"
          loading={loading && airingTodayTV.length === 0} 
        />

        <MovieCarousel 
          title="Indian Movie Hits" 
          movies={indianMovies} 
          loading={loading && indianMovies.length === 0} 
        />
      </div>
    </div>
  );
};

export default Home;
