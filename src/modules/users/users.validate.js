import Joi from "joi";

export const signUp = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(15).required(),
    lastName: Joi.string().min(3).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
    phone: Joi.string().min(10).max(11),
  }),
};

export const signIn = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
  }).required(),
};

export const updateProfile = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(15),
    lastName: Joi.string().min(3).max(15),
    phone: Joi.string().min(10).max(11),
  }).required(),
};

export const changePassword = {
  body: Joi.object({
    password: Joi.string().min(6).max(15).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  }).required(),
};
