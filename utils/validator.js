const Joi = require("@hapi/joi");

const validationSignUp = (req, res, next) => {
    // Define the validation schema using Joi
    const schema = Joi.object({
        firstName: Joi.string()
            .pattern(/^[A-Za-z]+$/)
            .min(2)
            .required()
            .messages({
                "any.required": "Please provide your first name.",
                "string.empty": "First name cannot be left empty.",
                "string.pattern.base": "First name should only contain letters.",
                "string.min": "First name should be at least 2 characters long.",
            }),
        lastName: Joi.string()
            .pattern(/^[A-Za-z]+$/)
            .min(2)
            .required()
            .messages({
                "any.required": "Please provide your last name.",
                "string.empty": "Last name cannot be left empty.",
                "string.pattern.base": "Last name should only contain letters.",
                "string.min": "Last name should be at least 2 characters long.",
            }),
        email: Joi.string().email().required().messages({
            "any.required": "Please provide your email address.",
            "string.empty": "Email address cannot be left empty.",
            "string.email": "Invalid email format. Please use a valid email address.",
        }),
        phoneNumber: Joi.string()
            .length(11)
            .pattern(/^\d+$/)
            .required()
            .messages({
                "any.required": "Please provide your phone number.",
                "string.length": "Phone number should be exactly 11 digits.",
                "string.pattern.base": "Phone number should contain only numeric digits.",
            }),
        password: Joi.string()
            .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
            .required()
            .messages({
                "any.required": "Please provide a password.",
                "string.empty": "Password cannot be left empty.",
                "string.pattern.base":
                    "Password must be at least 8 characters long and include at least one uppercase letter and one special character (!@#$%^&*).",
            }),
        confirmPassword: Joi.string()
            .valid(Joi.ref("password"))
            .required()
            .messages({
                "any.only": "Passwords do not match. Please make sure your passwords match.",
                "string.empty": "Please confirm your password.",
                "any.required": "Please confirm your password.",
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
        firstName: Joi.string()
            .pattern(/^[A-Za-z]+$/)
            .min(2)
            .messages({
                "string.empty": "First name cannot be left empty.",
                "string.pattern.base": "First name should only contain letters.",
                "string.min": "First name should be at least 2 characters long.",
            }),
        lastName: Joi.string()
            .pattern(/^[A-Za-z]+$/)
            .min(2)
            .messages({
                "string.empty": "Last name cannot be left empty.",
                "string.pattern.base": "Last name should only contain letters.",
                "string.min": "Last name should be at least 2 characters long.",
            }),
        email: Joi.string().email().messages({
            "string.empty": "Email address cannot be left empty.",
            "string.email": "Invalid email format. Please use a valid email address.",
        }),
        phoneNumber: Joi.string()
            .length(11)
            .pattern(/^\d+$/)
            .messages({
                "string.length": "Phone number should be exactly 11 digits.",
                "string.pattern.base": "Phone number should contain only numeric digits.",
            }),
        newPassword: Joi.string()
            .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
            .messages({
                "string.empty": "New password cannot be left empty.",
                "string.pattern.base":
                    "New password must be at least 8 characters long and include at least one uppercase letter and one special character (!@#$%^&*).",
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
            .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
            .required()
            .messages({
                "any.required": "Please provide new password.",
                "string.empty": "New password cannot be left empty.",
                "string.pattern.base":
                    "New password must be at least 8 characters long and include at least one uppercase letter and one special character (!@#$%^&*).",
            }),
        existingPassword: Joi.string()
            .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
            .required()
            .messages({
                "any.required": "Please provide Existing password.",
                "string.empty": "Existing password cannot be left empty.",
                "string.pattern.base":
                    "Existing password must be at least 8 characters long and include at least one uppercase letter and one special character (!@#$%^&*).",
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