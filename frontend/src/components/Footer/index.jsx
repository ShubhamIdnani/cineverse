import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem',
      color: 'var(--text-muted)',
      borderTop: 'var(--border-glass)',
      marginTop: '4rem',
      fontSize: '0.9rem'
    }}>
      <p>&copy; {new Date().getFullYear()} CineVerse Platform. All rights reserved.</p>
      <p>Powered by TMDB API. Made with React & Node.</p>
    </footer>
  );
};

export default Footer;
