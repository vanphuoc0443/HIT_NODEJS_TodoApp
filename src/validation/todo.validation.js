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

const getTodos = {
  query: Joi.object({
    status: Joi.string().valid("pending", "done"),
    search: Joi.string().trim().allow("").max(100),
    sortBy: Joi.string().valid("createdAt", "updatedAt", "title", "status").default("createdAt"),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
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

export default { createTodo, getTodoById, updateTodo, deleteTodo, getTodos };
