import { ACHIEVEMENT_TYPES } from '../constants.js';

export const validateAchievementCriteria = (type, criteria) => {
  const errors = [];

  switch (type) {
    case ACHIEVEMENT_TYPES.LEVEL_REACHED:
      if (!criteria.level || criteria.level < 1 || criteria.level > 100) {
        errors.push('Level must be between 1 and 100');
      }
      break;

    case ACHIEVEMENT_TYPES.ORDERS_COMPLETED:
      if (!criteria.count || criteria.count < 1) {
        errors.push('Order count must be positive');
      }
      break;

    case ACHIEVEMENT_TYPES.XP_EARNED:
      if (!criteria.xp || criteria.xp < 1) {
        errors.push('XP threshold must be positive');
      }
      break;

    default:
      errors.push('Invalid achievement type');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateAchievementReward = (xpReward, type) => {
  const maxRewards = {
    [ACHIEVEMENT_TYPES.LEVEL_REACHED]: 1000,
    [ACHIEVEMENT_TYPES.ORDERS_COMPLETED]: 500,
    [ACHIEVEMENT_TYPES.XP_EARNED]: 2000
  };

  return xpReward > 0 && xpReward <= maxRewards[type];
};

export const validateAchievementIcon = (icon) => {
  const validIconTypes = ['emoji', 'svg', 'url'];
  const errors = [];

  if (!icon.type || !validIconTypes.includes(icon.type)) {
    errors.push('Invalid icon type');
  }

  if (!icon.value) {
    errors.push('Icon value is required');
  }

  if (icon.type === 'url' && !isValidUrl(icon.value)) {
    errors.push('Invalid icon URL');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};