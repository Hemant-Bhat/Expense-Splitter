import Joi from "joi";

const basicInfo = { 
    email: Joi.string().label('Email').required().email(),
    password: Joi.string().label('Password').required().min(3),
}
''
export const registerSchema = Joi.object({
    ...basicInfo,
    confirmPassword: Joi.string().label('Confirm Password').required().equal(Joi.ref('password')).messages({ 
        'any.only': 'Password and {{#label}}  do not match'
    }),
})

export const loginSchema = Joi.object({
    ...basicInfo,
})