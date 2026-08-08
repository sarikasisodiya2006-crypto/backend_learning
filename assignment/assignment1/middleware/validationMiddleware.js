const joi = require('joi');

const validationMiddleware  = (schema)=>{
    return (req,res,next)=>{
         const{error} = schema.validate(req.body);
         console.log(req.body);
            if(error){
                return res.status(400).send(error.details[0].message);
            }
            next();
    };
};

module.exports = validationMiddleware;