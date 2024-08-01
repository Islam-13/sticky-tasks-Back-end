import Joi from "joi";
import { params } from "../../utils/helpers.js";

export const createTask = {
  body: Joi.object({
    title: Joi.string().min(3).max(100),
    priority: Joi.string().valid("low", "medium", "high"),
    status: Joi.string().valid("pending", "completed"),
    category: Joi.string().valid("personal", "work", "occasions", "others"),
  })
    .required()
    .presence("required"),
};

export const updateTask = {
  body: Joi.object({
    title: Joi.string().min(3).max(100),
    priority: Joi.string().valid("low", "medium", "high"),
    category: Joi.string().valid("personal", "work", "occasions", "others"),
    status: Joi.string().valid("pending", "completed"),
  }).required(),
  params: params.params.required(),
};

export const getTasksByCategory = {
  params: Joi.object({
    category: Joi.string().valid("personal", "work", "occasions", "others"),
  }).required(),
};
