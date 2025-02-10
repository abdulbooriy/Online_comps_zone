import Joi from "joi";

function orderValidation(data) {
    const orders = Joi.object({
        userId: Joi.number().required().positive(),
        totalPrice: Joi.number().required().positive(),
        payment: Joi.string().required().max(7),
        status: Joi.string().required(),
    });
    return orders.validate(data, {abortEarly: true});
}

export default orderValidation;