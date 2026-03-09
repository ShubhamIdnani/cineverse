import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Search from './pages/Search';
import MovieDetails from './pages/MovieDetails';
import TVShows from './pages/TVShows';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import TrailerModal from './components/TrailerModal';
import './index.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:id" element={<MovieDetails type="movie" />} />
            <Route path="/tv/:id" element={<MovieDetails type="tv" />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Dashboard />} />
          </Routes>
        </main>

        <TrailerModal />
      </div>
    </Router>
  );
};

export default App;
