import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeTrailerModal } from '../../store/slices/layoutSlice';
import { X, AlertCircle } from 'lucide-react';
import './TrailerModal.css';

const TrailerModal = () => {
  const dispatch = useDispatch();
  const { isTrailerModalOpen, trailerVideoId } = useSelector((state) => state.layout);

  if (!isTrailerModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => dispatch(closeTrailerModal())}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => dispatch(closeTrailerModal())}>
          <X size={24} />
        </button>

        <div className="video-container">
          {trailerVideoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailerVideoId}?autoplay=1&mute=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="youtube-embed"
            ></iframe>
          ) : (
            <div className="missing-trailer">
              <AlertCircle size={48} className="missing-icon" />
              <h3>Trailer Unavailable</h3>
              <p>The trailer for this movie is currently unavailable.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
