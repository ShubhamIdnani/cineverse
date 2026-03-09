import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { Search, Popcorn, User as UserIcon, LogOut } from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  const [query, setQuery] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="nav-container">
        <Link to="/" className="brand">
          <Popcorn className="brand-icon" />
          <span className="brand-text text-gradient">CineVerse</span>
        </Link>
        
        <div className="nav-main-links">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>Movies</NavLink>
          <NavLink to="/tv-shows" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>TV Shows</NavLink>
        </div>
        
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search movies, TV shows..."
              className="input-glass"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </form>

        <div className="nav-links">
          {userInfo ? (
            <div className="user-menu">
              <Link to="/profile" className="btn-outline user-btn">
                <UserIcon size={18} />
                <span>{userInfo.username}</span>
              </Link>
              {userInfo.isAdmin && (
                <Link to="/admin" className="btn-outline">Dashboard</Link>
              )}
              <button onClick={logoutHandler} className="btn-icon">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-primary">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
