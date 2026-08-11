const joi = require('joi');
//  const { type } = require('./registerValidationSchema');
 const { addressModel } = require('../model');

const schema = joi.object({

    type: joi.string().valid("home", "office", "hostel", "other").required(),
    address: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    pincode: joi.string().required(),
    longitude: joi.number().required(),
    latitude: joi.number().required(),

});

module.exports = schema;