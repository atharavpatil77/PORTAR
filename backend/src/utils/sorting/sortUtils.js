export const parseSortString = (sortString) => {
  if (!sortString) return { createdAt: -1 };

  return sortString.split(',').reduce((acc, field) => {
    const order = field.startsWith('-') ? -1 : 1;
    const key = field.replace(/^-/, '');
    acc[key] = order;
    return acc;
  }, {});
};

export const validateSortFields = (sortFields, allowedFields) => {
  const invalidFields = Object.keys(sortFields).filter(
    field => !allowedFields.includes(field.replace(/^-/, ''))
  );
  
  return {
    isValid: invalidFields.length === 0,
    invalidFields
  };
};