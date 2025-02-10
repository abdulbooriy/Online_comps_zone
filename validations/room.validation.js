import Joi from 'joi';

function roomValidation(data) {
    const room = Joi.object({
        roomNumber: Joi.number().positive().required(),
        count: Joi.number().required().positive(),
        price: Joi.number().required().positive(),
        image: Joi.string().optional(),
        characteristics: Joi.string().required(),
        status: Joi.string().required().max(50),
    });
    return room.validate(data, {abortEarly: true});
}

export default roomValidation;