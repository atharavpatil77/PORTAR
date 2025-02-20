import logger from '../utils/logger.js';

class NotificationService {
  constructor() {
    this.subscribers = new Map();
  }

  subscribe(userId, eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Map());
    }
    this.subscribers.get(eventType).set(userId, callback);
  }

  unsubscribe(userId, eventType) {
    if (this.subscribers.has(eventType)) {
      this.subscribers.get(eventType).delete(userId);
    }
  }

  async notify(userId, eventType, data) {
    try {
      if (this.subscribers.has(eventType)) {
        const callback = this.subscribers.get(eventType).get(userId);
        if (callback) {
          await callback(data);
        }
      }
    } catch (error) {
      logger.error('Notification error:', error);
    }
  }

  async notifyLevelUp(userId, newLevel) {
    await this.notify(userId, 'LEVEL_UP', { level: newLevel });
  }

  async notifyAchievementUnlocked(userId, achievement) {
    await this.notify(userId, 'ACHIEVEMENT_UNLOCKED', { achievement });
  }

  async notifyOrderStatusChange(userId, orderId, status) {
    await this.notify(userId, 'ORDER_STATUS_CHANGE', { orderId, status });
  }
}

export default new NotificationService();