import Joi from "joi"
const registerUserValidation = Joi.object({
  username: Joi.string().max(30).required(),
  password: Joi.string().max(60).required(),
  name: Joi.string().max(60).required()
});

const loginUserValidation = Joi.object({
  username: Joi.string().max(30).required(),
  password: Joi.string().max(60).required(),
});

const getUserValidation = Joi.string().max(30).required();

const userUpdateValidation = Joi.object({
  username: Joi.string().max(30).required(),
  password: Joi.string().max(60).optional(),
  name: Joi.string().max(60).optional()
});

export {
  registerUserValidation,
  loginUserValidation,
  getUserValidation,
  userUpdateValidation
};
