import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiscoverTV, clearSearch, fetchTVAiringToday } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import MovieCarousel from '../components/MovieCarousel';
import { MovieGridSkeleton } from '../components/SkeletonLoader';

const TVShows = () => {
  const dispatch = useDispatch();
  const { discoverTV, airingTodayTV, loading } = useSelector((state) => state.movies);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchDiscoverTV({ page: 1 }));
    dispatch(fetchTVAiringToday({ page: 1 }));
  }, [dispatch]);

  // Load more pages
  useEffect(() => {
    if (page > 1) {
      dispatch(fetchDiscoverTV({ page })).then(res => {
        if (!res.payload || res.payload.data.length === 0) setHasMore(false);
      });
    }
  }, [page, dispatch]);

  return (
    <div className="container" style={{ paddingTop: '8rem', minHeight: '80vh' }}>
      <h1 style={{ marginBottom: '2rem' }}>Discover TV Shows</h1>

      <MovieCarousel 
        title="Live Today" 
        movies={airingTodayTV} 
        type="tv"
        loading={loading && airingTodayTV.length === 0} 
      />
      
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Popular Series</h2>
        <div className="movies-grid">
        {discoverTV.map((item, index) => (
          <MovieCard 
            key={`${item.id}-${index}`} 
            movie={item} 
            type="tv"
            ref={index === discoverTV.length - 1 ? lastElementRef : null}
          />
        ))}
        </div>
      </div>

      {loading && (
        <div style={{ marginTop: '2rem' }}>
          <MovieGridSkeleton count={page === 1 ? 10 : 5} />
        </div>
      )}

      {!hasMore && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
          You've reached the end of the list.
        </p>
      )}
    </div>
  );
};

export default TVShows;
