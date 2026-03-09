import mongoose from 'mongoose';

// Flexible schema that can map TMDB items (where we only store ID, title, and poster)
const listItemSchema = new mongoose.Schema({
  tmdbId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  posterPath: {
    type: String,
  },
  mediaType: {
    type: String, // 'movie', 'tv'
    default: 'movie',
  },
  addedAt: {
    type: Date,
    default: Date.now,
  }
});

const movieListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  favorites: [listItemSchema],
  history: [listItemSchema],
}, {
  timestamps: true,
});

const MovieList = mongoose.model('MovieList', movieListSchema);
export default MovieList;
