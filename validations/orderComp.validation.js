import Joi from "joi";

function orderCompValidation(data){
    const orderComp = Joi.object({
        productId: Joi.number().required().positive(),
        orderId: Joi.number().required().positive(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
        vipTime: Joi.boolean().required(),
        summa: Joi.number().required().positive(),
        roomId: Joi.number().required().positive(),
    });
    return orderComp.validate(data, {abortEarly: true});
}

export default orderCompValidation;