const  validationMiddleware = require('../middleware/validationMiddleware');
const validationSchema = require('../validationSchema/createProductValidationSchema');
const authMiddelware = require('../middleware/authValidation');
const express = require("express");
const router = express.Router();
const {
    register,
    login,
    logout
} = require("../controllers/userController");

 router.post("/createProduct",authMiddelware,validationMiddleware(validationSchema));
 router.get("/getProduct",authMiddelware);
  router.delete("/deleteStudentbySKU/:sku",authMiddelware);
  router.put("/updateProduct/:sku",authMiddelware);
  module.exports = router;