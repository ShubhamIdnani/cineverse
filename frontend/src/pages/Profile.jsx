import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import MovieCard from '../components/MovieCard';
import { MovieGridSkeleton } from '../components/SkeletonLoader';

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [lists, setLists] = useState({ favorites: [], history: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' or 'history'

  useEffect(() => {
    if (!userInfo) {
      navigate('/auth');
      return;
    }

    const fetchLists = async () => {
      try {
        const { data } = await api.get('/profile/lists');
        setLists(data);
      } catch (err) {
        console.error("Failed to fetch profile lists", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [userInfo, navigate]);

  const removeFavorite = async (tmdbId) => {
    try {
      const { data } = await api.post('/profile/favorites', {
        action: 'remove',
        item: { tmdbId }
      });
      setLists(prev => ({ ...prev, favorites: data }));
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
  };

  if (!userInfo) return null;

  return (
    <div className="container" style={{ paddingTop: '8rem', minHeight: '80vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
          {userInfo.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{userInfo.username}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{userInfo.email}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: 'var(--border-glass)' }}>
        <button 
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
          style={{
            background: 'none', border: 'none', padding: '1rem 2rem', color: activeTab === 'favorites' ? 'var(--accent-secondary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.1rem', fontWeight: '600', borderBottom: activeTab === 'favorites' ? '3px solid var(--accent-secondary)' : '3px solid transparent'
          }}
        >
          My Favorites
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          style={{
            background: 'none', border: 'none', padding: '1rem 2rem', color: activeTab === 'history' ? 'var(--accent-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.1rem', fontWeight: '600', borderBottom: activeTab === 'history' ? '3px solid var(--accent-primary)' : '3px solid transparent'
          }}
        >
          Watch History
        </button>
      </div>

      {loading ? (
        <MovieGridSkeleton count={5} />
      ) : (
        <div className="movies-grid">
          {activeTab === 'favorites' && lists.favorites.map((item) => (
            <div key={item.tmdbId} style={{ position: 'relative' }}>
              <MovieCard movie={{ id: item.tmdbId, title: item.title, poster_path: item.posterPath, media_type: item.mediaType }} />
              <button 
                onClick={() => removeFavorite(item.tmdbId)}
                style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--accent-danger)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>
          ))}

          {activeTab === 'history' && lists.history.map((item) => (
            <MovieCard key={item.tmdbId} movie={{ id: item.tmdbId, title: item.title, poster_path: item.posterPath, media_type: item.mediaType }} />
          ))}

          {activeTab === 'favorites' && lists.favorites.length === 0 && (
            <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1' }}>No favorite movies yet. Start browsing to add some!</p>
          )}

          {activeTab === 'history' && lists.history.length === 0 && (
            <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1' }}>Your watch history is empty.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
