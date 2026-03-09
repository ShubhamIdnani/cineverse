import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails, clearDetails, fetchMovieImages } from '../store/slices/movieSlice';
import { openTrailerModal } from '../store/slices/layoutSlice';
import { DetailsSkeleton } from '../components/SkeletonLoader';
import { PlayCircle, Plus, Check, Star, Clock } from 'lucide-react';
import api from '../api/axios';
import './MovieDetails.css';

const MovieDetails = ({ type: propType }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { movieDetails, movieImages, loading, error } = useSelector((state) => state.movies);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const mediaType = propType || (window.location.pathname.startsWith('/tv') ? 'tv' : 'movie');
    dispatch(fetchMovieDetails({ id, type: mediaType }));
    dispatch(fetchMovieImages(id));
    
    // Add to watch history if logged in
    if (userInfo) {
      api.post('/profile/history', {
        item: { tmdbId: id, title: 'Viewed Item', mediaType: 'movie' } // We update actual title next render
      }).catch(err => console.error("Error saving history:", err));
    }

    return () => dispatch(clearDetails());
  }, [dispatch, id, userInfo]);

  // Update history with correct title/poster once loaded
  useEffect(() => {
    if (userInfo && movieDetails) {
      const mediaType = propType || (window.location.pathname.startsWith('/tv') ? 'tv' : 'movie');
      api.post('/profile/history', {
        item: { 
          tmdbId: id, 
          title: movieDetails.title || movieDetails.name, 
          posterPath: movieDetails.poster_path,
          mediaType: mediaType 
        }
      }).catch(err => console.error(err));
    }
  }, [movieDetails, userInfo, id, propType]);

  if (loading || !movieDetails) return <DetailsSkeleton />;
  if (error) return <div className="container" style={{paddingTop: '6rem'}}>Error: {error}</div>;

  const backdropUrl = movieDetails.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}` 
    : '';
  const posterUrl = movieDetails.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` 
    : 'https://via.placeholder.com/500x750/0a0b10/5ec8ff?text=No+Poster';

  // Find a official YouTube trailer
  const trailerVideo = movieDetails.videos?.results?.find(
    (vid) => vid.site === 'YouTube' && vid.type === 'Trailer'
  );

  const handlePlayTrailer = () => {
    dispatch(openTrailerModal(trailerVideo ? trailerVideo.key : null));
  };

  const handleFavorite = async () => {
    if (!userInfo) {
      navigate('/auth');
      return;
    }
    try {
      const mediaType = propType || (window.location.pathname.startsWith('/tv') ? 'tv' : 'movie');
      await api.post('/profile/favorites', {
        action: 'add',
        item: { 
          tmdbId: id, 
          title: movieDetails.title || movieDetails.name, 
          posterPath: movieDetails.poster_path,
          mediaType: mediaType 
        }
      });
      alert('Added to favorites!');
    } catch (err) {
      console.error(err);
    }
  };

  // Format runtime
  const runtime = movieDetails.runtime 
    ? `${Math.floor(movieDetails.runtime / 60)}h ${movieDetails.runtime % 60}m`
    : 'N/A';

  return (
    <div className="movie-details-page">
      <div className="backdrop-container" style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="backdrop-overlay"></div>
      </div>

      <div className="container content-container">
        <div className="poster-col">
          <img src={posterUrl} alt="Poster" className="detail-poster" />
        </div>
        
        <div className="info-col">
          <h1 className="detail-title">{movieDetails.title || movieDetails.name}</h1>
          
          <div className="meta-row">
            <span className="meta-item"><Star size={18} color="#fbbf24"/> {movieDetails.vote_average?.toFixed(1)}</span>
            <span className="meta-item"><Clock size={18} /> {runtime}</span>
            <span className="meta-item release-date">{movieDetails.release_date?.substring(0,4)}</span>
            <div className="genres">
              {movieDetails.genres?.map(g => (
                <span key={g.id} className="genre-tag">{g.name}</span>
              ))}
            </div>
          </div>

          <p className="detail-overview">{movieDetails.overview || "Description not available"}</p>

          <div className="action-buttons">
            <button className="btn-primary" onClick={handlePlayTrailer} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', padding: '1rem 2rem' }}>
              <PlayCircle size={24} /> Watch Trailer
            </button>
            <button className="btn-outline add-list-btn" onClick={handleFavorite} aria-label="Add to Favorites">
              <Plus size={24} />
            </button>
          </div>

          <div className="media-section" style={{ marginTop: '3rem' }}>
            <h3>Media & Stills</h3>
            <div className="media-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {movieImages?.backdrops?.slice(0, 6).map((img, i) => (
                <img 
                  key={i} 
                  src={`https://image.tmdb.org/t/p/w300${img.file_path}`} 
                  alt="Backdrop" 
                  style={{ width: '100%', borderRadius: '8px', cursor: 'pointer' }} 
                  onClick={() => window.open(`https://image.tmdb.org/t/p/original${img.file_path}`, '_blank')}
                />
              ))}
              {(!movieImages?.backdrops || movieImages.backdrops.length === 0) && (
                <p style={{ color: 'var(--text-muted)' }}>No additional media available.</p>
              )}
            </div>
          </div>

          <div className="cast-section">
            <h3>Top Cast</h3>
            <div className="cast-list">
              {movieDetails.credits?.cast?.slice(0, 6).map(person => (
                <div key={person.id} className="cast-card">
                  <div className="cast-avatar">
                    {person.profile_path ? (
                      <img src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt={person.name} />
                    ) : (
                      <div className="avatar-placeholder">{person.name.charAt(0)}</div>
                    )}
                  </div>
                  <p className="cast-name">{person.name}</p>
                  <p className="cast-char">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
