import * as Joi from 'joi';

export const envValidation = Joi.object({
  MONGODB_URI: Joi.string().required(),
  MONGODB_DATABASE: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
});
