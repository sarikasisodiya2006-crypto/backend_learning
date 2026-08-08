const  validationMiddleware = require('../middleware/validationMiddleware');
const validationSchema = require('../validationSchema/createProductValidationSchema');
const authMiddelware = require('../middleware/authValidation');
const authorization = require('../middleware/authorization');
const express = require("express");
const router = express.Router();
const  {
         createProduct ,
         getProduct,
         deleteStudentbySKU ,
            updateProduct
            
        } = require("../controllers/productController")

 router.post("/createProduct",authMiddelware,validationMiddleware(validationSchema),authorization("admin","seller"),createProduct );
 router.get("/getProduct",authMiddelware,getProduct);
  router.delete("/deleteStudentbySKU/:sku",authorization("admin","seller"),authMiddelware,deleteStudentbySKU);
  router.put("/updateProduct/:sku",authorization("admin","seller"),authMiddelware,updateProduct);
  module.exports = router;