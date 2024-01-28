import * as Joi from 'joi';

export const envValidation: Joi.ObjectSchema = Joi.object({
  PORT: Joi.number(),
  MONGODB_URI: Joi.string().required(),
  MONGODB_DATABASE: Joi.string().required(),
  FRONTEND_URL: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_USERNAME: Joi.string(),
  REDIS_PASSWORD: Joi.string(),
  JWT_SECRET: Joi.string().required(),
  MAILJET_API_KEY: Joi.string().required(),
  MAILJET_API_SECRET: Joi.string().required(),
  MAILJET_SENDER_NAME: Joi.string().required(),
  MAILJET_SENDER_EMAIL: Joi.string().required(),
  ADMIN_DEFAULT_PASSWORD: Joi.string().required(),
  ADMIN_DEFAULT_EMAIL: Joi.string().required(),
});
