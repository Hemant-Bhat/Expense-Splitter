// import Joi = require("joi");

export function formatJoiError(err) { // : Joi.ValidationError
    const fieldErrors = err.details.reduce((acc, detail) => {
        const field = detail.path.join('.');
        acc[field] = detail.message.replace(/['"]/g, '');
        return acc;
    }, {}) // as Record<string, string>


    return {
        status: 400,
        code: "VALIDATION_ERROR",
        message: "Validation Failed",
        fieldErrors,


        ...(process.env.NODE_ENV == 'development' && ({ _Original_details: err }))
    }
}