import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearch, clearSearch } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import { MovieGridSkeleton } from '../components/SkeletonLoader';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector((state) => state.movies);
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

  // Debounce logic for new query
  useEffect(() => {
    if (!query.trim()) {
      dispatch(clearSearch());
      setPage(1);
      setHasMore(true);
      return;
    }

    const timerId = setTimeout(() => {
      setSearchParams({ q: query });
      setPage(1);
      setHasMore(true);
      dispatch(fetchSearch({ query, type: 'multi', page: 1 }));
    }, 400);

    return () => clearTimeout(timerId);
  }, [query, dispatch, setSearchParams]);

  // Load more pages
  useEffect(() => {
    if (page > 1 && query.trim()) {
      dispatch(fetchSearch({ query, type: 'multi', page })).then(res => {
        if (!res.payload || res.payload.length === 0) setHasMore(false);
      });
    }
  }, [page, query, dispatch]);

  // If query changes via URL (e.g. from nav bar), sync local state
  useEffect(() => {
    if (initialQuery !== query) {
      setQuery(initialQuery);
    }
    // eslint-disable-next-line
  }, [initialQuery]);

  // Filter out people or malformed data to only show movies/tv
  const filteredResults = searchResults.filter(
    item => item.media_type === 'movie' || item.media_type === 'tv'
  );

  return (
    <div className="container" style={{ paddingTop: '8rem', minHeight: '80vh' }}>
      <h1 style={{ marginBottom: '1rem' }}>Search</h1>
      
      <input
        type="text"
        className="input-glass"
        placeholder="Search for movies, TV series..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ fontSize: '1.2rem', padding: '1.2rem 1.5rem', marginBottom: '3rem', borderRadius: '12px' }}
        autoFocus
      />

      {loading && page === 1 ? (
        <MovieGridSkeleton count={10} />
      ) : (
        <>
          {filteredResults.length > 0 ? (
            <div className="movies-grid">
              {filteredResults.map((item, index) => (
                <MovieCard 
                  key={`${item.id}-${index}`} 
                  movie={item} 
                  ref={index === filteredResults.length - 1 ? lastElementRef : null}
                />
              ))}
            </div>
          ) : (
            query.trim() && !loading && (
              <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
                <h2>No results found for "{query}"</h2>
                <p>Try different keywords or check your spelling.</p>
              </div>
            )
          )}
          {loading && page > 1 && <div style={{ textAlign: 'center', padding: '2rem' }}><MovieGridSkeleton count={5} /></div>}
        </>
      )}
    </div>
  );
};

export default Search;
