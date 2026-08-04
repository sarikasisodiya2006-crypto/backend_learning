const joi = require('joi');

 const schema = joi.object({
                 name: joi.string().required(),
                 price: joi.number().min(0).required(),
                 category: joi.string().valid("Electronics", "Clothing", "Books", "Home", "Sports").required(),
                 SKU: joi.string().required(),

            });

            module.exports = schema;