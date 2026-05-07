import joi from "joi";

const login = {
    body: joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
    }),
};

const logout = {
    body: joi.object({}),
};

const refreshToken = {
    body: joi.object({}),
};

const getMe = {
    body: joi.object({}),
};

export default { login, logout, refreshToken, getMe };