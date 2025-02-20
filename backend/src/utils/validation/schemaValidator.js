import Joi from 'joi';

export const validateSchema = (schema) => {
  return (data) => {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return {
        isValid: false,
        errors,
        value: null
      };
    }

    return {
      isValid: true,
      errors: [],
      value
    };
  };
};

export const commonSchemas = {
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\+?[\d\s-]{10,15}$/),
  password: Joi.string().min(8),
  date: Joi.date().iso(),
  pagination: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100)
  })
};