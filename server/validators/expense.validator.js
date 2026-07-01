import Joi from "joi";

export const expenseSchema = Joi.object({
    groupId: Joi.string().required(),
    amount: Joi.number().required().min(1),
    description: Joi.string(),
    // paidBy: Joi.string().required()
})