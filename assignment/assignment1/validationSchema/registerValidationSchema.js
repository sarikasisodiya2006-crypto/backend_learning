const joi = require('joi');

const schema = joi.object({
                firstname : joi.string().min(2).max(128).required().pattern(/^[a-zA-Z ]+$/).trim(),
                lastname : joi.string().min(2).max(128).required().pattern(/^[a-zA-Z ]+$/).trim(),
                email : joi.string().email().required().trim().lowercase(),
                dob : joi.date().required(),
                gender : joi.string().valid("male","female","other").required(),
                createPassword : joi.string().min(2).max(128).required().trim(),
                confirmPassword : joi.string().min(2).max(128).required().trim(),
                role : joi.string().required().valid("admin","user","seller"),
            });

            module.exports = schema;