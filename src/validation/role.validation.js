import Joi from "joi";

const createRole = {
    body: Joi.object({
        name: Joi.string().trim().required(),
        permissions: Joi.array().items(Joi.string().hex().length(24)).required(),
    }),
};

const getRoleById = {
    params: Joi.object({
        roleId: Joi.string().hex().length(24).required(),
    }),
};

const updateRole = {
    params: Joi.object({
        roleId: Joi.string().hex().length(24).required(),
    }),
    body: Joi.object({
        name: Joi.string().trim(),
        permissions: Joi.array().items(Joi.string().hex().length(24)),
    }).min(1),
};

const deleteRole = {
    params: Joi.object({
        roleId: Joi.string().hex().length(24).required(),
    }),
};

export default { createRole, getRoleById, updateRole, deleteRole };
