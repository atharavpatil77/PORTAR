export const createSearchQuery = (searchTerm, fields) => {
  if (!searchTerm) return {};

  const searchRegex = new RegExp(searchTerm, 'i');
  return {
    $or: fields.map(field => ({ [field]: searchRegex }))
  };
};

export const createFilterQuery = (filters, allowedFields) => {
  const query = {};
  
  for (const [key, value] of Object.entries(filters)) {
    if (allowedFields.includes(key)) {
      if (Array.isArray(value)) {
        query[key] = { $in: value };
      } else if (typeof value === 'object') {
        const { min, max } = value;
        query[key] = {};
        if (min !== undefined) query[key].$gte = min;
        if (max !== undefined) query[key].$lte = max;
      } else {
        query[key] = value;
      }
    }
  }
  
  return query;
};