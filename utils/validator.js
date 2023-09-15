const Joi = require("@hapi/joi");

const validationSignUp = (req, res, next) => {
    // Define the validation schema using Joi
    const schema = Joi.object({
        firstName: Joi.string().min(3).required().messages({
            "any.required": "First name is required.",
            "string.empty": "First name cannot be an empty string.",
            "string.min": "First name must be at least 3 characters long.",
        }),
        lastName: Joi.string().min(3).required().messages({
            "any.required": "Last name is required.",
            "string.empty": "Last name cannot be an empty string.",
            "string.min": "Last name must be at least 3 characters long.",
        }),
        email: Joi.string().email().required().messages({
            "any.required": "Email is required.",
            "string.email": "Invalid email format.",
        }),
        phoneNumber: Joi.string()
            .length(11)
            .pattern(/^\d+$/)
            .required()
            .messages({
                "any.required": "Phone number is required.",
                "string.length": "Phone number must be exactly 11 digits.",
                "string.pattern.base": "Phone number must contain only numeric digits.",
            }),
        password: Joi.string()
            .min(8)
            .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?!.*[!@#$%^&*\\s]).*$"))
            .required()
            .messages({
                "any.required": "Password is required.",
                "string.min": "Password must be at least 8 characters long.",
                "string.pattern.base":
                    "Password must contain at least one uppercase letter, one lowercase letter, and no special characters or empty space.",
            }),
    });

    // Validate the request body against the schema
    const { error } = schema.validate(req.body, { abortEarly: false });

    // If there's a validation error, return a response with the error details
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(" ");
        return res.status(400).json({ error: errorMessage });
    }

    // If validation is successful, move to the next middleware
    next();
};



const validationUpdate = (req, res, next) => {
    // Define the validation schema using Joi
    const schema = Joi.object({
        firstName: Joi.string().min(3).messages({
            "string.empty": "First name cannot be an empty string.",
            "string.min": "First name must be at least 3 characters long.",
        }),
        lastName: Joi.string().min(3).messages({
            "string.empty": "Last name cannot be an empty string.",
            "string.min": "Last name must be at least 3 characters long.",
        }),
        email: Joi.string().email().messages({
            "string.email": "Invalid email format.",
        }),
        phoneNumber: Joi.string()
            .length(11)
            .pattern(/^\d+$/)
            .messages({
                "string.length": "Phone number must be exactly 11 digits.",
                "string.pattern.base": "Phone number must contain only numeric digits.",
            }),
        newPassword: Joi.string()
            .min(8)
            .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?!.*[!@#$%^&*\\s]).*$"))
            .messages({
                "string.min": "New Password must be at least 8 characters long.",
                "string.pattern.base":
                    "New Password must contain at least one uppercase letter, one lowercase letter, and no special characters or empty space.",
            }),
    });

    // Validate the request body against the schema
    const { error } = schema.validate(req.body, { abortEarly: false });

    // If there's a validation error, return a response with the error details
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(" ");
        return res.status(400).json({ error: errorMessage });
    }

    // If validation is successful, move to the next middleware
    next();
};



const validationPassword = (req, res, next) => {
    // Define the validation schema using Joi
    const schema = Joi.object({
        newPassword: Joi.string()
            .min(8)
            .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?!.*[!@#$%^&*\\s]).*$"))
            .required()
            .messages({
                "any.required": "New Password is required.",
                "string.min": "New Password must be at least 8 characters long.",
                "string.pattern.base":
                    "New Password must contain at least one uppercase letter, one lowercase letter, and no special characters or empty space.",
            }),
        existingPassword: Joi.string()
            .min(8)
            .pattern(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?!.*[!@#$%^&*\\s]).*$"))
            .required()
            .messages({
                "any.required": "Existing Password is required.",
                "string.min": "Existing Password must be at least 8 characters long.",
                "string.pattern.base":
                    "Existing Password must contain at least one uppercase letter, one lowercase letter, and no special characters or empty space.",
            }),
    });

    // Validate the request body against the schema
    const { error } = schema.validate(req.body, { abortEarly: false });

    // If there's a validation error, return a response with the error details
    if (error) {
        const errorMessage = error.details.map((err) => err.message).join(" ");
        return res.status(400).json({ error: errorMessage });
    }

    // If validation is successful, move to the next middleware
    next();
};



// const validationCustomerAddress = (req, res, next) => {
//     // Define the validation schema using Joi
//     const schema = Joi.object({
//         customerAddress: Joi.string()
//             .required()
//             .trim()
//             .messages({
//                 "string.base": "Customer address must be a string.",
//                 "string.empty": "Customer address must not be an empty string.",
//                 "any.required": "Customer address is required.",
//             }),
//         cashBackToggle: Joi.boolean(),
//     });

//     // Validate the request body against the schema
//     const { error } = schema.validate(req.body, { abortEarly: false });

//     // If there's a validation error, return a response with the error details
//     if (error) {
//         const errorMessage = error.details.map((err) => err.message).join(" ");
//         return res.status(400).json({ error: errorMessage });
//     }

//     // If validation is successful, move to the next middleware
//     next();
// };




module.exports = {
    validationSignUp,
    validationUpdate,
    validationPassword,
    // validationCustomerAddress
}