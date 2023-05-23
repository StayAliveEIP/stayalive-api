import * as Joi from 'joi';

export const envValidation = Joi.object({
  MONGO_URI: Joi.string().required(),
  MONGO_DATABASE: Joi.string().required(),
})