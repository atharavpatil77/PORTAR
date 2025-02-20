export const optimizeQuery = (query, options = {}) => {
  const optimizedQuery = { ...query };
  const optimizedOptions = { ...options };

  // Add index hints if available
  if (options.index) {
    optimizedOptions.hint = options.index;
  }

  // Limit fields if not specifically requested
  if (!options.select) {
    optimizedOptions.select = getDefaultFields(query);
  }

  // Add lean option for better performance when full mongoose documents aren't needed
  if (options.lean !== false) {
    optimizedOptions.lean = true;
  }

  return { query: optimizedQuery, options: optimizedOptions };
};

const getDefaultFields = (query) => {
  // Define default fields based on the query context
  const defaultFields = {
    users: 'id fullName email',
    orders: 'id status createdAt',
    addresses: 'id label street city'
  };

  // Determine the collection being queried
  const collection = Object.keys(query)[0]?.split('.')[0];
  return defaultFields[collection] || '';
};