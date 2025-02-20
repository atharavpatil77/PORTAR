import logger from '../logger.js';

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  startTimer(label) {
    this.metrics.set(label, {
      start: process.hrtime(),
      memory: process.memoryUsage()
    });
  }

  endTimer(label) {
    const metric = this.metrics.get(label);
    if (!metric) return null;

    const diff = process.hrtime(metric.start);
    const duration = (diff[0] * 1e9 + diff[1]) / 1e6; // Convert to milliseconds
    const memoryDiff = {
      heapUsed: process.memoryUsage().heapUsed - metric.memory.heapUsed,
      external: process.memoryUsage().external - metric.memory.external
    };

    this.metrics.delete(label);
    
    logger.info('Performance metric', {
      label,
      duration: `${duration.toFixed(2)}ms`,
      memoryDiff: {
        heapUsed: `${(memoryDiff.heapUsed / 1024 / 1024).toFixed(2)}MB`,
        external: `${(memoryDiff.external / 1024 / 1024).toFixed(2)}MB`
      }
    });

    return { duration, memoryDiff };
  }
}

export default new PerformanceMonitor();