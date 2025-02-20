class QueueManager {
  constructor() {
    this.queues = new Map();
  }

  addToQueue(queueName, task) {
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, []);
    }
    this.queues.get(queueName).push({
      task,
      timestamp: Date.now(),
      status: 'pending'
    });
  }

  async processQueue(queueName) {
    const queue = this.queues.get(queueName);
    if (!queue || queue.length === 0) return;

    const item = queue[0];
    try {
      item.status = 'processing';
      await item.task();
      item.status = 'completed';
    } catch (error) {
      item.status = 'failed';
      item.error = error.message;
    }

    queue.shift();
  }

  getQueueStatus(queueName) {
    const queue = this.queues.get(queueName);
    if (!queue) return { length: 0, pending: 0, processing: 0 };

    return {
      length: queue.length,
      pending: queue.filter(item => item.status === 'pending').length,
      processing: queue.filter(item => item.status === 'processing').length
    };
  }

  clearQueue(queueName) {
    this.queues.delete(queueName);
  }
}

export default new QueueManager();