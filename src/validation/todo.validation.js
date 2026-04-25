import Joi from "joi";

const createTodo = {
  body: Joi.object({
    title: Joi.string().trim().min(3).max(100).required().messages({
      "string.empty": "Tiêu đề không được để trống",
      "string.min": "Tiêu đề phải có ít nhất 3 ký tự",
      "string.max": "Tiêu đề tối đa 100 ký tự",
    }),
    description: Joi.string().trim().allow("").max(500),
    status: Joi.string().valid("pending", "done"),
  }),
};

const getTodoById = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required().messages({
      "string.length": "ID không hợp lệ",
    }),
  }),
};

const updateTodo = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    title: Joi.string().trim().min(3).max(100),
    description: Joi.string().trim().allow("").max(500),
    status: Joi.string().valid("pending", "done"),
  }).min(1),
};

const deleteTodo = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

export default { createTodo, getTodoById, updateTodo, deleteTodo };
