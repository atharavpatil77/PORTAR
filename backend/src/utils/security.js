import crypto from 'crypto';

export const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

export const hashData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

export const generateSecureId = () => {
  return crypto.randomUUID();
};