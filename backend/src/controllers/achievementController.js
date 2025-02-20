import Achievement from '../models/Achievement.js';
import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { checkAchievements } from '../services/levelingService.js';

export const getAchievements = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('achievements');
    res.json(user.achievements);
  } catch (error) {
    next(error);
  }
};

export const checkUserAchievements = async (req, res, next) => {
  try {
    const achievements = await checkAchievements(req.user.id);
    res.json(achievements);
  } catch (error) {
    next(error);
  }
};

export const createAchievement = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized');
    }

    const achievement = await Achievement.create(req.body);
    res.status(201).json(achievement);
  } catch (error) {
    next(error);
  }
};

export const updateAchievement = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized');
    }

    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!achievement) {
      throw new ApiError(404,'Achievement not found');
    }

    res.json(achievement);
  } catch (error) {
    next(error);
  }
};