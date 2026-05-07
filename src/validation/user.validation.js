import Joi from "joi";

const createUser = {
    body: Joi.object({
        username: Joi.string().trim().min(3).max(50).required().messages({
            "string.empty": "Tên không được để trống",
            "string.min": "Tên phải có ít nhất 3 ký tự",
            "string.max": "Tên tối đa 50 ký tự",
        }),
        password: Joi.string().trim().min(6).max(24).required(),
        avatar: Joi.string().trim(),
        status: Joi.string().valid("active", "inactive"),
    }),
};

const getUserById = {
    params: Joi.object({
        userId: Joi.string().hex().length(24).required(),
    }),
};

const updateUser = {
    params: Joi.object({
        userId: Joi.string().hex().length(24).required(),
    }),
    body: Joi.object({
        username: Joi.string().trim().min(3).max(50),
        password: Joi.string().trim().min(6).max(24),
        avatar: Joi.string().trim(),
        status: Joi.string().valid("active", "inactive"),
        role: Joi.string().hex().length(24),
    }).min(1),
};

const deleteUser = {
    params: Joi.object({
        userId: Joi.string().hex().length(24).required(),
    }),
};

export default { createUser, getUserById, updateUser, deleteUser };