const validationMiddleware = require('../middleware/validationMiddleware');
const validationSchema = require('../validationSchema/createAddressValidationSchema');
const authValidation = require('../middleware/authValidation');
const authorization = require('../middleware/authorization');
const express = require("express");
const router = express.Router();
const {
    createAddress
} = require("../controllers/addressController");

router.post("/createAddress",authValidation,validationMiddleware(validationSchema),authorization("admin","user","seller"),createAddress);

module.exports = router;