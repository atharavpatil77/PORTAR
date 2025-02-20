const COUNTRY_CODES = ['US', 'CA', 'GB', 'AU', 'NZ']; // Add more as needed

export const validateZipCode = (zipCode, country) => {
  const patterns = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/,
    GB: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/,
    AU: /^\d{4}$/,
    NZ: /^\d{4}$/
  };

  return patterns[country]?.test(zipCode) ?? false;
};

export const validateAddressFields = (address) => {
  const errors = [];

  if (!address.street || address.street.length < 5) {
    errors.push('Street address must be at least 5 characters long');
  }

  if (!address.city || address.city.length < 2) {
    errors.push('City name must be at least 2 characters long');
  }

  if (!address.state || address.state.length < 2) {
    errors.push('State/Province must be at least 2 characters long');
  }

  if (!address.country || !COUNTRY_CODES.includes(address.country)) {
    errors.push('Invalid country code');
  }

  if (!validateZipCode(address.zipCode, address.country)) {
    errors.push('Invalid ZIP/Postal code format for the specified country');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateAddressLimit = async (userId, Address) => {
  const MAX_ADDRESSES = 10;
  const count = await Address.countDocuments({ user: userId });
  return count < MAX_ADDRESSES;
};