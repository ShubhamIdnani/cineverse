import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  posterImage: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  movieId: {
    type: String,
    required: true,
    unique: true,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  trailerUrl: {
    type: String,
  },
  genre: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true, // e.g. 'Movie', 'TV Show'
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true,
});

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
