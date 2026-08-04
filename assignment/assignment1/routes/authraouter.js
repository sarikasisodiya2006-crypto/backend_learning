const  validationMiddleware = require('../middleware/validationMiddleware');
const registerSchema = require('../validationSchema/registerValidationSchema');
const loginSchema = require('../validationSchema/loginValidationSchema');
const authMiddelware = require('../middleware/authValidation');
const express = require("express");
const router = express.Router();
const {
    register,
    login,
    logout
} = require("../controllers/userController");


router.post("/register", validationMiddleware(registerSchema),register);
 router.post("/login",validationMiddleware(loginSchema),login);
  router.get("/logout",authMiddelware,logout);

module.exports = router;