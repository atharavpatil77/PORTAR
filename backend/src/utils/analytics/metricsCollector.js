import logger from '../logger.js';

class MetricsCollector {
  constructor() {
    this.metrics = {
      orders: {
        total: 0,
        completed: 0,
        cancelled: 0,
        avgDeliveryTime: 0
      },
      users: {
        total: 0,
        active: 0,
        avgOrdersPerUser: 0
      },
      performance: {
        avgResponseTime: 0,
        errorRate: 0,
        requestCount: 0
      }
    };
  }

  updateOrderMetrics(orders) {
    const completed = orders.filter(o => o.status === 'delivered');
    const cancelled = orders.filter(o => o.status === 'cancelled');
    
    const totalDeliveryTime = completed.reduce((sum, order) => {
      const start = new Date(order.createdAt);
      const end = new Date(order.timeline.slice(-1)[0].timestamp);
      return sum + (end - start);
    }, 0);

    this.metrics.orders = {
      total: orders.length,
      completed: completed.length,
      cancelled: cancelled.length,
      avgDeliveryTime: completed.length ? totalDeliveryTime / completed.length : 0
    };
  }

  updateUserMetrics(users, orders) {
    const activeUsers = users.filter(u => 
      orders.some(o => o.user.toString() === u._id.toString())
    );

    this.metrics.users = {
      total: users.length,
      active: activeUsers.length,
      avgOrdersPerUser: users.length ? orders.length / users.length : 0
    };
  }

  recordResponseTime(duration) {
    const { performance } = this.metrics;
    performance.requestCount++;
    performance.avgResponseTime = 
      (performance.avgResponseTime * (performance.requestCount - 1) + duration) / 
      performance.requestCount;
  }

  recordError() {
    const { performance } = this.metrics;
    performance.errorRate = 
      (performance.errorRate * performance.requestCount + 1) / 
      (performance.requestCount + 1);
  }

  getMetrics() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString()
    };
  }

  logMetrics() {
    logger.info('System Metrics', this.getMetrics());
  }
}

export default new MetricsCollector();