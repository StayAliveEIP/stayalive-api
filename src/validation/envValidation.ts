import * as Joi from 'joi';

export const envValidation: Joi.ObjectSchema = Joi.object({
  MONGODB_URI: Joi.string().required(),
  MONGODB_DATABASE: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  MAILJET_API_KEY: Joi.string().required(),
  MAILJET_API_SECRET: Joi.string().required(),
  MAILJET_SENDER_NAME: Joi.string().required(),
  MAILJET_SENDER_EMAIL: Joi.string().required(),
});
