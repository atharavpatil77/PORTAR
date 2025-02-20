import axiosInstance from '../../utils/http/axiosInstance';
import { API_ENDPOINTS } from '../../config/api.config';
import { withRetry } from '../../utils/network/retryHandler';

export const addressApi = {
  getAddresses: withRetry(async () => {
    return await axiosInstance.get(API_ENDPOINTS.addresses.list);
  }),

  createAddress: withRetry(async (addressData) => {
    return await axiosInstance.post(API_ENDPOINTS.addresses.create, addressData);
  }),

  updateAddress: withRetry(async (id, addressData) => {
    return await axiosInstance.put(API_ENDPOINTS.addresses.update(id), addressData);
  }),

  deleteAddress: withRetry(async (id) => {
    return await axiosInstance.delete(API_ENDPOINTS.addresses.delete(id));
  }),

  setDefaultAddress: withRetry(async (id) => {
    return await axiosInstance.put(API_ENDPOINTS.addresses.setDefault(id));
  })
};