import React from 'react';
import './SkeletonLoader.css';

export const MovieCardSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image pulse"></div>
      <div className="skeleton-text pulse" style={{ width: '80%', marginTop: '0.75rem' }}></div>
      <div className="skeleton-text pulse" style={{ width: '40%', marginTop: '0.25rem' }}></div>
    </div>
  );
};

export const MovieGridSkeleton = ({ count = 10 }) => {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <MovieCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const DetailsSkeleton = () => {
  return (
    <div className="skeleton-details">
      <div className="skeleton-backdrop pulse"></div>
      <div className="skeleton-content container">
        <div className="skeleton-poster pulse"></div>
        <div className="skeleton-info">
          <div className="skeleton-text pulse" style={{ width: '60%', height: '3rem' }}></div>
          <div className="skeleton-text pulse" style={{ width: '30%', marginTop: '1rem' }}></div>
          <div className="skeleton-text pulse" style={{ width: '100%', height: '100px', marginTop: '2rem' }}></div>
        </div>
      </div>
    </div>
  );
};
