import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import MovieList from '../models/MovieList.js';

const router = express.Router();

// Helper fn
const getOrCreateList = async (userId) => {
  let list = await MovieList.findOne({ user: userId });
  if (!list) list = await MovieList.create({ user: userId });
  return list;
};

// @desc    Get user lists (favorites & history)
// @route   GET /api/profile/lists
// @access  Private
router.get('/lists', protect, async (req, res, next) => {
  try {
    const list = await getOrCreateList(req.user._id);
    res.status(200).json(list);
  } catch (error) {
        next(error);
  }
});

// @desc    Add/Remove to Favorites
// @route   POST /api/profile/favorites
// @access  Private
router.post('/favorites', protect, async (req, res, next) => {
  try {
    const { action, item } = req.body; // action: 'add' or 'remove'
    const list = await getOrCreateList(req.user._id);

    if (action === 'add') {
      const exists = list.favorites.find(f => f.tmdbId === item.tmdbId);
      if (!exists) list.favorites.push(item);
    } else if (action === 'remove') {
      list.favorites = list.favorites.filter(f => f.tmdbId !== item.tmdbId);
    }

    await list.save();
    res.status(200).json(list.favorites);
  } catch (error) {
    next(error);
  }
});

// @desc    Add to History
// @route   POST /api/profile/history
// @access  Private
router.post('/history', protect, async (req, res, next) => {
  try {
    const { item } = req.body;
    const list = await getOrCreateList(req.user._id);

    // Remove if already exists so we can push it to the top/end (recent)
    list.history = list.history.filter(h => h.tmdbId !== item.tmdbId);
    list.history.unshift(item);

    // Limit history to 50 items
    if (list.history.length > 50) {
      list.history.pop();
    }

    await list.save();
    res.status(200).json(list.history);
  } catch (error) {
    next(error);
  }
});

export default router;
