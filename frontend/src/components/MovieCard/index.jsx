import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, PlayCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { openTrailerModal } from '../../store/slices/layoutSlice';
import { fetchMovieVideos, fetchTVVideos } from '../../store/slices/movieSlice';
import './MovieCard.css';

const MovieCard = forwardRef(({ movie, type = 'movie' }, ref) => {
  const dispatch = useDispatch();
  const posterBaseUrl = 'https://image.tmdb.org/t/p/w500';

  // Fallback for missing poster image
  const posterUrl = movie.poster_path 
    ? `${posterBaseUrl}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750/0a0b10/5ec8ff?text=No+Poster+Available';

  const title = movie.title || movie.name || 'Unknown Title';
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? releaseDate.substring(0, 4) : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';

  const handleOpenTrailer = async () => {
    try {
      // 1. Fetch videos based on content type
      const fetchAction = type === 'movie' ? fetchMovieVideos : fetchTVVideos;
      const resultAction = await dispatch(fetchAction(movie.id));
      
      if (fetchAction.fulfilled.match(resultAction)) {
        const videos = resultAction.payload.results;
        // 2. Find the best video (Trailer > Teaser > Clip)
        const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') 
                     || videos.find(v => v.type === 'Teaser' && v.site === 'YouTube')
                     || videos.find(v => v.site === 'YouTube');
        
        if (trailer) {
          dispatch(openTrailerModal(trailer.key));
        } else {
          dispatch(openTrailerModal(null)); // Opens modal with "Unavailable" message
        }
      }
    } catch (error) {
      console.error('Failed to fetch trailer:', error);
    }
  };

  const handlePlayButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleOpenTrailer();
  };

  return (
    <Link 
      ref={ref}
      to={type === 'movie' ? `/movie/${movie.id}` : `/tv/${movie.id}`} 
      className="movie-card"
    >
      <div className="card-image-wrapper">
        <img src={posterUrl} alt={title} className="movie-poster" loading="lazy" />
        
        <div className="card-overlay">
          <button className="play-button" onClick={handlePlayButtonClick} aria-label="Play Trailer">
            <PlayCircle size={48} className="play-icon" />
          </button>
        </div>
        
        <div className="rating-badge">
          <Star size={14} className="star-icon" fill="currentColor" />
          <span>{rating}</span>
        </div>
      </div>
      
      <div className="card-info">
        <h3 className="movie-title" title={title}>{title}</h3>
        <p className="movie-year">{year}</p>
      </div>
    </Link>
  );
});

export default MovieCard;
