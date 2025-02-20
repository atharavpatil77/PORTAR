import logger from '../utils/logger.js';
import performanceMonitor from '../utils/monitoring/performanceMonitor.js';

export const requestLogger = (req, res, next) => {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = Date.now();

  // Log request
  logger.info('Incoming request', {
    id: requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  performanceMonitor.startTimer(`request-${requestId}`);

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const metric = performanceMonitor.endTimer(`request-${requestId}`);

    logger.info('Request completed', {
      id: requestId,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      performance: metric
    });
  });

  next();
};