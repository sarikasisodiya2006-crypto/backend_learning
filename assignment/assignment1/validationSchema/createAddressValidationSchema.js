const joi = require('joi');
//  const { type } = require('./registerValidationSchema');
 const { addressModel } = require('../model');

const schema = joi.object({

    type: joi.string().valid("home", "office", "hostel", "other").required(),
    address: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    pincode: joi.string().required(),
});

module.exports = schema;