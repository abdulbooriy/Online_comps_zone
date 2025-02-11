import Joi from "joi";

export function orderValidation(data) {
    const orders = Joi.object({
        userId: Joi.number().required().positive(),
        totalPrice: Joi.number().required().positive(),
        payment: Joi.string().required(),
        status: Joi.string().required(),
    });
    return orders.validate(data, {abortEarly: true});
}

export function orderUpdateValidation(data) {
    const orders = Joi.object({
        userId: Joi.number().optional().positive(),
        totalPrice: Joi.number().optional().positive(),
        payment: Joi.string().optional(),
        status: Joi.string().optional(),
    });
    return orders.validate(data, {abortEarly: true});
}