import Joi from 'joi';

export function roomValidation(data) {
    const room = Joi.object({
        roomNumber: Joi.number().required().positive(),
        count: Joi.number().required().positive(),
        price: Joi.number().required().positive(),
        image: Joi.string().required(),
        characteristics: Joi.string().required(),
        status: Joi.string().required().max(50),
    });
    return room.validate(data, {abortEarly: true});
}

export function roomPatchValidation(data) {
    const room = Joi.object({
        roomNumber: Joi.number().optional().positive(),
        count: Joi.number().optional().positive(),
        price: Joi.number().optional().positive(),
        image: Joi.string().optional(),
        characteristics: Joi.string().optional(),
        status: Joi.string().optional().max(50),
    });
    return room.validate(data, {abortEarly: true});
}