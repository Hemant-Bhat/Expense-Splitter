import { formatJoiError } from "./errorHandler.js";

export const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body);

        req.body = value; // assingin the obj which is return by Joi

        if (error) {
            return res.status(400).json(formatJoiError(error));
        }

        next();
    };
};
