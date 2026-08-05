const  validationMiddleware = require('../middleware/validationMiddleware');
const validationSchema = require('../validationSchema/createProductValidationSchema');
const authMiddelware = require('../middleware/authValidation');
const express = require("express");
const router = express.Router();
const  {
         createProduct ,
         getProduct,
         deleteStudentbySKU ,
            updateProduct
            
        } = require("../controllers/productController")

 router.post("/createProduct",authMiddelware,validationMiddleware(validationSchema),createProduct );
 router.get("/getProduct",authMiddelware,getProduct);
  router.delete("/deleteStudentbySKU/:sku",authMiddelware,deleteStudentbySKU);
  router.put("/updateProduct/:sku",authMiddelware,updateProduct);
  module.exports = router;