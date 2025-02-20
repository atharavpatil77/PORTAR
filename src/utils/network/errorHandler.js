export class NetworkError extends Error {
  constructor(message = 'Network error occurred', status = 0) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

export const handleNetworkError = (error) => {
  if (!navigator.onLine) {
    throw new NetworkError('No internet connection. Please check your network.');
  }

  if (error.message === 'Network Error') {
    throw new NetworkError('Unable to connect to server. Please try again later.');
  }

  throw error;
};