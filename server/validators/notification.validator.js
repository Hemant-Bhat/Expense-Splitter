import Joi from "joi";

export const nofitySchema = Joi.object({
    expenseId: Joi.string().required().min(12),
    participantEmail: Joi.string().required().email(),
});
