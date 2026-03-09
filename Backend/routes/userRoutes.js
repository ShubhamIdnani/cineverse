import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import MovieList from '../models/MovieList.js';

const router = express.Router();

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    await User.deleteOne({ _id: user._id });
    await MovieList.deleteOne({ user: user._id });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// @desc    Toggle Ban user (admin)
// @route   PUT /api/users/:id/ban
// @access  Private/Admin
router.put('/:id/ban', protect, admin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    user.isBanned = !user.isBanned;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
