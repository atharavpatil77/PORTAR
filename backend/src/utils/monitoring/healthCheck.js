import mongoose from 'mongoose';
import logger from '../logger.js';

class HealthCheck {
  async checkDatabase() {
    try {
      const status = mongoose.connection.readyState;
      const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      };
      
      return {
        status: states[status] || 'unknown',
        healthy: status === 1
      };
    } catch (error) {
      logger.error('Database health check failed:', error);
      return {
        status: 'error',
        healthy: false,
        error: error.message
      };
    }
  }

  async checkMemory() {
    const used = process.memoryUsage();
    return {
      rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(used.external / 1024 / 1024)}MB`,
      healthy: used.heapUsed < used.heapTotal * 0.9
    };
  }

  async fullCheck() {
    const [dbHealth, memoryHealth] = await Promise.all([
      this.checkDatabase(),
      this.checkMemory()
    ]);

    return {
      timestamp: new Date().toISOString(),
      database: dbHealth,
      memory: memoryHealth,
      uptime: process.uptime(),
      healthy: dbHealth.healthy && memoryHealth.healthy
    };
  }
}

export default new HealthCheck();