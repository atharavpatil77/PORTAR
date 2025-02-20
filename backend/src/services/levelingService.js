import User from '../models/User.js';
import Achievement from '../models/Achievement.js';
import { ApiError } from '../utils/apiError.js';

const XP_THRESHOLDS = {
  1: 0,
  2: 100,
  3: 300,
  4: 600,
  5: 1000,
  6: 1500,
  7: 2100,
  8: 2800,
  9: 3600,
  10: 4500
};

export const calculateLevel = (xp) => {
  let level = 1;
  for (const [lvl, threshold] of Object.entries(XP_THRESHOLDS)) {
    if (xp >= threshold) {
      level = parseInt(lvl);
    } else {
      break;
    }
  }
  return level;
};

export const awardXP = async (userId, xpAmount) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const oldLevel = calculateLevel(user.xp);
    user.xp += xpAmount;
    const newLevel = calculateLevel(user.xp);

    if (newLevel > oldLevel) {
      user.level = newLevel;
      // Could emit an event for level up notification
    }

    await user.save();
    return user;
  } catch (error) {
    throw new ApiError(500, 'Error awarding XP');
  }
};

export const checkAchievements = async (userId) => {
  try {
    const user = await User.findById(userId).populate('achievements');
    const allAchievements = await Achievement.find({});
    const newAchievements = [];

    for (const achievement of allAchievements) {
      if (!user.achievements.find(a => a._id.equals(achievement._id))) {
        const eligible = await checkAchievementEligibility(user, achievement);
        if (eligible) {
          user.achievements.push(achievement._id);
          await awardXP(userId, achievement.xpReward);
          newAchievements.push(achievement);
        }
      }
    }

    await user.save();
    return newAchievements;
  } catch (error) {
    throw new ApiError(500, 'Error checking achievements');
  }
};

const checkAchievementEligibility = async (user, achievement) => {
  switch (achievement.type) {
    case 'LEVEL_REACHED':
      return user.level >= achievement.criteria.level;
    case 'ORDERS_COMPLETED':
      return user.completedOrders >= achievement.criteria.count;
    case 'XP_EARNED':
      return user.xp >= achievement.criteria.xp;
    default:
      return false;
  }
};