import { formatAddressResponse } from '../formatters/responseFormatter.js';

export const transformAddressForStorage = (addressData) => {
  return {
    label: addressData.label.trim(),
    street: addressData.street.trim(),
    city: addressData.city.trim(),
    state: addressData.state.trim(),
    zipCode: addressData.zipCode.trim().toUpperCase(),
    country: addressData.country.trim(),
    isDefault: Boolean(addressData.isDefault)
  };
};

export const normalizeAddress = (address) => {
  return {
    street: address.street.replace(/\s+/g, ' ').trim(),
    city: address.city.toLowerCase().trim(),
    state: address.state.toUpperCase().trim(),
    zipCode: address.zipCode.replace(/\s+/g, '').toUpperCase(),
    country: address.country.trim()
  };
};

export const compareAddresses = (addr1, addr2) => {
  const norm1 = normalizeAddress(addr1);
  const norm2 = normalizeAddress(addr2);
  
  return (
    norm1.street === norm2.street &&
    norm1.city === norm2.city &&
    norm1.state === norm2.state &&
    norm1.zipCode === norm2.zipCode &&
    norm1.country === norm2.country
  );
};