import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Movie Form State
  const [formData, setFormData] = useState({
    title: '', posterImage: '', description: '', movieId: '', releaseDate: '', trailerUrl: '', genre: '', category: 'Movie'
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [moviesRes, usersRes] = await Promise.all([
          api.get('/movies'),
          api.get('/users')
        ]);
        setMovies(moviesRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo, navigate]);

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const { data } = await api.put(`/movies/${editId}`, formData);
        setMovies(movies.map(m => m._id === editId ? data : m));
        alert('Movie Updated!');
      } else {
        const { data } = await api.post('/movies', formData);
        setMovies([...movies, data]);
        alert('Movie Added!');
      }
      setFormData({ title: '', posterImage: '', description: '', movieId: '', releaseDate: '', trailerUrl: '', genre: '', category: 'Movie' });
      setEditId(null);
    } catch (err) {
      alert(`Error ${editId ? 'updating' : 'creating'} movie`);
      console.error(err);
    }
  };

  const handleEditMovie = (movie) => {
    setEditId(movie._id);
    setFormData({
      title: movie.title,
      movieId: movie.movieId,
      posterImage: movie.posterImage,
      description: movie.description,
      releaseDate: movie.releaseDate.split('T')[0],
      genre: movie.genre,
      category: movie.category,
      trailerUrl: movie.trailerUrl
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/movies/${id}`);
        setMovies(movies.filter(m => m._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        console.error("Delete user error", err);
      }
    }
  };

  const handleToggleBan = async (id) => {
    try {
      const { data } = await api.put(`/users/${id}/ban`);
      setUsers(users.map(u => u._id === id ? data : u));
    } catch (err) {
      console.error("Ban toggle error", err);
    }
  };

  if (!userInfo || !userInfo.isAdmin) return null;

  return (
    <div className="container" style={{ paddingTop: '8rem', minHeight: '80vh' }}>
      <h1>Admin Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '3rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        
        {/* Users Panel */}
        <div className="glass-panel" style={{ flex: 1, minWidth: '350px', padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-secondary)' }}>Registered Users</h2>
          {loading ? <p>Loading...</p> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>NAME</th>
                    <th style={{ padding: '1rem' }}>EMAIL</th>
                    <th style={{ padding: '1rem' }}>ROLE</th>
                    <th style={{ padding: '1rem' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u._id.substring(0,8)}</td>
                      <td style={{ padding: '1rem' }}>{u.username}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '1rem' }}>{u.isAdmin ? <span style={{color: 'var(--accent-primary)'}}>Admin</span> : 'User'}</td>
                      <td style={{ padding: '1rem' }}>
                        {!u.isAdmin && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              style={{ 
                                background: u.isBanned ? 'var(--accent-secondary)' : 'var(--accent-warning, #f59e0b)', 
                                color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' 
                              }}
                              onClick={() => handleToggleBan(u._id)}
                            >
                              {u.isBanned ? 'Unban' : 'Ban'}
                            </button>
                            <button 
                              style={{ background: 'var(--accent-danger)', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}
                              onClick={() => handleDeleteUser(u._id)}
                            >Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Local Movies Panel */}
        <div className="glass-panel" style={{ flex: 1, minWidth: '350px', padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>Manage Local Movies</h2>
          
          <form onSubmit={handleCreateMovie} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
            <input className="input-glass" placeholder="Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <input className="input-glass" placeholder="Movie ID (custom TMDB format)" required value={formData.movieId} onChange={e => setFormData({...formData, movieId: e.target.value})} />
            
            <input className="input-glass" placeholder="Poster Image URL" required value={formData.posterImage} onChange={e => setFormData({...formData, posterImage: e.target.value})} style={{ gridColumn: 'span 2' }} />
            
            <textarea className="input-glass" placeholder="Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ gridColumn: 'span 2', minHeight: '80px', resize: 'vertical' }} />
            
            <input className="input-glass" type="date" required value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} />
            <input className="input-glass" placeholder="Genre CSV" required value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} />
            
            <input className="input-glass" placeholder="YouTube Trailer ID" required value={formData.trailerUrl} onChange={e => setFormData({...formData, trailerUrl: e.target.value})} />
            <select className="input-glass" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ background: '#0a0b10' }}>
              <option value="Movie">Movie</option>
              <option value="TV Show">TV Show</option>
            </select>
            
            <button type="submit" className="btn-primary" style={{ gridColumn: editId ? 'span 1' : 'span 2' }}>
              {editId ? 'Update Movie' : 'Add Local Movie'}
            </button>
            {editId && (
              <button 
                type="button" 
                className="btn-outline" 
                onClick={() => { setEditId(null); setFormData({ title: '', posterImage: '', description: '', movieId: '', releaseDate: '', trailerUrl: '', genre: '', category: 'Movie' }); }}
              >Cancel</button>
            )}
          </form>

          {loading ? <p>Loading...</p> : (
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Local Movie List ({movies.length})</h3>
              {movies.map(m => (
                <div key={m._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', marginBottom: '0.5rem', borderRadius: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block' }}>{m.title}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{m.category} • {m.genre}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleEditMovie(m)}
                      style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}
                    >Edit</button>
                    <button 
                      onClick={() => handleDeleteMovie(m._id)}
                      style={{ background: 'transparent', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }}
                    >Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
