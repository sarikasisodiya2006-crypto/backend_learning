const joi = require('joi');

const schema = joi.object({
                      email: joi.string().email().required(),
                      Password: joi.string().min(2).max(120).required(),
                    });


module.exports = schema;