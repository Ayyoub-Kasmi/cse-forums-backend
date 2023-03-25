const Joi = require('joi');

// const supplierSchema = Joi.object({
//     Id: Joi.number().greater(0),
//     name: Joi.string().alphanum().min(1).max(191).required(),
//     contact: Joi.string().alphanum().min(1).max(191).required(),
//     email: Joi.string().email().max(191).required(),
//     phone_num: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
//     address: Joi.string().alphanum().min(1).max(191).required(),
// });

module.exports = {
    schemas: {
        signupSchema: Joi.object({
            username: Joi.string().alphanum().min(1).max(30).required(),
            email: Joi.string().email().max(191).required(),
            password: Joi.string().min(6).max(30).required(),
            title: Joi.string().min(1).max(30),
            bio: Joi.string().max(200),
            facebook_id: Joi.string(),
            instagram_id: Joi.string(),
            github_id: Joi.string(),
        }),

        loginSchema: Joi.object({
            email: Joi.string().email().max(191).required(),
            password: Joi.string().min(6).required(),
        }),
        answerSchema: Joi.object({
            content: Joi.string().max(500).required(),
            user_id: Joi.number().required(),
            question_id: Joi.number().required(),
        })
    },
    validateBody: (schema) => {
        return (req, res, next) => {
            const {error} = schema.validate(req.body);
            
            if(error) {
                res.status(400).json({
                    success: false,
                    message: error.message, //here we can customize the error message even more
                    data: {}
                });
            }else {
                next();
            }
        }
    }
}