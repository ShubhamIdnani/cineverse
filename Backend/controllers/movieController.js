import Movie from '../models/Movie.js';

// @desc    Fetch all local admin movies
// @route   GET /api/movies
// @access  Public
export const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a movie
// @route   POST /api/movies
// @access  Private/Admin
export const addMovie = async (req, res, next) => {
  try {
    const movie = new Movie({
      ...req.body,
      addedBy: req.user._id,
    });
    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
export const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      movie.title = req.body.title || movie.title;
      movie.posterImage = req.body.posterImage || movie.posterImage;
      movie.description = req.body.description || movie.description;
      movie.movieId = req.body.movieId || movie.movieId;
      movie.releaseDate = req.body.releaseDate || movie.releaseDate;
      movie.trailerUrl = req.body.trailerUrl || movie.trailerUrl;
      movie.genre = req.body.genre || movie.genre;
      movie.category = req.body.category || movie.category;

      const updatedMovie = await movie.save();
      res.status(200).json(updatedMovie);
    } else {
      res.status(404);
      throw new Error('Movie not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      await Movie.deleteOne({ _id: movie._id });
      res.status(200).json({ message: 'Movie removed' });
    } else {
      res.status(404);
      throw new Error('Movie not found');
    }
  } catch (error) {
    next(error);
  }
};
