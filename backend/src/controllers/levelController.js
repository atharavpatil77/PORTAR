import Level from '../models/Level.js';
import { ApiError } from '../utils/apiError.js';

// Get all levels for the user's role
export const getLevels = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authorized');
    }

    const { role } = req.user;
    if (!role) {
      throw new ApiError(400, 'User role not found');
    }

    const levels = await Level.find({ role }).sort({ requiredTrips: 1 });
    res.json(levels);
  } catch (error) {
    next(error);
  }
};

// Get level by ID
export const getLevelById = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authorized');
    }

    const { role } = req.user;
    if (!role) {
      throw new ApiError(400, 'User role not found');
    }

    const level = await Level.findOne({ 
      _id: req.params.id,
      role 
    });
    
    if (!level) {
      throw new ApiError(404, 'Level not found');
    }

    res.json(level);
  } catch (error) {
    next(error);
  }
};

// Get user's current level
export const getUserLevel = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authorized');
    }

    const { completedTrips, role } = req.user;
    if (!role) {
      throw new ApiError(400, 'User role not found');
    }

    const level = await Level.findOne({
      role,
      requiredTrips: { $lte: completedTrips || 0 }
    }).sort({ requiredTrips: -1 });

    if (!level) {
      // If no level found, return the first level for their role
      const firstLevel = await Level.findOne({ role }).sort({ requiredTrips: 1 });
      if (!firstLevel) {
        throw new ApiError(404, 'No levels found for your role');
      }
      return res.json(firstLevel);
    }

    res.json(level);
  } catch (error) {
    next(error);
  }
};

// Get next level
export const getNextLevel = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authorized');
    }

    const { completedTrips, role } = req.user;
    if (!role) {
      throw new ApiError(400, 'User role not found');
    }

    const nextLevel = await Level.findOne({
      role,
      requiredTrips: { $gt: completedTrips || 0 }
    }).sort({ requiredTrips: 1 });

    if (!nextLevel) {
      // If no next level found, return the highest level for their role
      const highestLevel = await Level.findOne({ role }).sort({ requiredTrips: -1 });
      if (!highestLevel) {
        throw new ApiError(404, 'No levels found for your role');
      }
      return res.json(highestLevel);
    }

    res.json(nextLevel);
  } catch (error) {
    next(error);
  }
};
