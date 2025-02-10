import Joi from "joi";

function productValidation(data) {
    const product = Joi.object({
        compNumber: Joi.number().required().positive(),
        price: Joi.number().required().positive(),
        type: Joi.string().required(),
        image: Joi.string().optional(),
        status: Joi.string().required(),
        characteristics: Joi.string().required(),
    });
    return product.validate(data, {abortEarly: true});
}

export default productValidation;