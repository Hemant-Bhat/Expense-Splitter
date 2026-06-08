import Joi from "joi";

export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    confirmPassword: Joi.valid(Joi.ref('password')).required(),
})

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
})