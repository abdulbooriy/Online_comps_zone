import Joi from "joi";

export function userValidation(data) {
    const users = Joi.object({
        name: Joi.string().required().max(50).min(2),
        phone: Joi.string().required().max(13),
        password: Joi.string().required(),
        role: Joi.string().required(),
    });
    return users.validate(data, {abortEarly: true});
}

export function userUpdateValidation(data) {
    const users = Joi.object({
        name: Joi.string().optional().max(50).min(2),
        phone: Joi.string().optional(),
        password: Joi.string().optional(),
        role: Joi.string().optional(),
    });
    return users.validate(data, {abortEarly: true});
}