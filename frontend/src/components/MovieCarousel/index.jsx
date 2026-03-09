import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../MovieCard';
import { MovieGridSkeleton } from '../SkeletonLoader';
import './MovieCarousel.css';

const MovieCarousel = ({ title, movies, loading, viewAllLink, type = 'movie' }) => {
  const rowRef = useRef(null);

  const scrollLeft = () => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      rowRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading && (!movies || movies.length === 0)) {
    return (
      <div className="movie-carousel-container container">
        <h2 className="carousel-title" style={{ paddingLeft: 0, marginBottom: '1rem' }}>{title}</h2>
        <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'hidden' }}>
          <MovieGridSkeleton count={5} />
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="movie-carousel-container">
      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
        {viewAllLink && (
          <Link to={viewAllLink} className="carousel-view-all">
            Explore All <span>&rarr;</span>
          </Link>
        )}
      </div>

      {/* Left Arrow */}
      <button className="carousel-arrow left" onClick={scrollLeft} aria-label="Scroll left">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>

      {/* Movie Row */}
      <div className="carousel-row" ref={rowRef}>
        {movies.map((movie) => (
          <div key={movie.id}>
            <MovieCard movie={movie} type={movie.media_type || type} />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button className="carousel-arrow right" onClick={scrollRight} aria-label="Scroll right">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
  );
};

export default MovieCarousel;
