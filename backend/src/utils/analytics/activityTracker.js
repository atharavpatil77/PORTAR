import logger from '../logger.js';

class ActivityTracker {
  constructor() {
    this.activities = new Map();
  }

  trackUserActivity(userId, action, details = {}) {
    const activity = {
      timestamp: new Date(),
      action,
      details,
      sessionId: details.sessionId
    };

    if (!this.activities.has(userId)) {
      this.activities.set(userId, []);
    }

    this.activities.get(userId).push(activity);
    this.pruneOldActivities(userId);
    
    logger.info('User Activity', { userId, ...activity });
  }

  getUserActivities(userId, limit = 10) {
    return (this.activities.get(userId) || [])
      .slice(-limit)
      .reverse();
  }

  getActiveUsers(minutes = 15) {
    const activeUsers = new Set();
    const threshold = new Date(Date.now() - minutes * 60 * 1000);

    for (const [userId, activities] of this.activities) {
      const lastActivity = activities[activities.length - 1];
      if (lastActivity && lastActivity.timestamp > threshold) {
        activeUsers.add(userId);
      }
    }

    return Array.from(activeUsers);
  }

  pruneOldActivities(userId, maxAge = 24 * 60 * 60 * 1000) { // 24 hours
    const activities = this.activities.get(userId);
    if (!activities) return;

    const threshold = new Date(Date.now() - maxAge);
    const validActivities = activities.filter(a => a.timestamp > threshold);
    
    this.activities.set(userId, validActivities);
  }

  generateActivityReport(userId) {
    const activities = this.activities.get(userId) || [];
    const actionCounts = activities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1;
      return acc;
    }, {});

    return {
      userId,
      totalActivities: activities.length,
      actionCounts,
      lastActivity: activities[activities.length - 1]?.timestamp
    };
  }
}

export default new ActivityTracker();