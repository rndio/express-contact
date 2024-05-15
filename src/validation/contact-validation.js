import Joi from "joi"

const getMessageValidation = Joi.number().integer().required();

const searchMessageValidation = Joi.object({
  page: Joi.number().integer().min(1).positive().default(1),
  size: Joi.number().integer().min(1).max(100).positive().default(10),
  name: Joi.string().max(100).optional(),
  email: Joi.string().max(100).optional(),
  message: Joi.string().max(10000).optional()
});

const storeMessageValidation = Joi.object({
  name: Joi.string().max(100).optional(),
  email: Joi.string().email().max(100).optional(),
  message: Joi.string().max(10000).required(),
  user_id: Joi.number().integer().required()
});


export {
  getMessageValidation,
  searchMessageValidation,
  storeMessageValidation
};
