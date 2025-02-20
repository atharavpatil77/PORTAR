export const retryWithBackoff = async (fn, retries = 3, backoffMs = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;

    await new Promise(resolve => setTimeout(resolve, backoffMs));
    return retryWithBackoff(fn, retries - 1, backoffMs * 2);
  }
};

export const withRetry = (fn) => {
  return async (...args) => {
    return retryWithBackoff(() => fn(...args));
  };
};