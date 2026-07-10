import Joi from "joi";

export const groupSchema = Joi.object({
    name: Joi.string().label("Group name").required().min(3),
    members: Joi.array().items(Joi.string().email()).default([]),
    // members: Joi.array().items(Joi.object({
    //     email: Joi.string().email(),
    //     amount: Joi.number().default(0)
    // })).default([])
});

export const removeMemberSchema = Joi.object({
    groupId: Joi.string().required().min(20),
    members: Joi.array().required().min(1).items(Joi.string().email()),
});
