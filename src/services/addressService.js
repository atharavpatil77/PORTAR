import api from './api';

export const addressService = {
  async createAddress(addressData) {
    return await api.post('/addresses', addressData);
  },

  async getAddresses() {
    return await api.get('/addresses');
  },

  async updateAddress(id, addressData) {
    return await api.put(`/addresses/${id}`, addressData);
  },

  async deleteAddress(id) {
    return await api.delete(`/addresses/${id}`);
  },

  async setDefaultAddress(id) {
    return await api.put(`/addresses/${id}/default`);
  }
};