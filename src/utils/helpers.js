import Joi from "joi";
import { Types } from "mongoose";

export const systemRoles = {
  user: "user",
  admin: "admin",
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
export { AppError };

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

export const objectIdValidation = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? value
    : helper.message("Invalid params Id");
};

export const params = {
  params: Joi.object({
    _id: Joi.string().custom(objectIdValidation),
  }),
};
