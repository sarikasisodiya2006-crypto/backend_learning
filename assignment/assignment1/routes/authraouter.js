const  validationMiddleware = require('../middleware/validationMiddleware');
const registerSchema = require('../validationSchema/registerValidationSchema');
const loginSchema = require('../validationSchema/loginValidationSchema');
const authMiddelware = require('../middleware/authValidation');
const authorization = require("../middleware/authorization");
const memoryUpload = require("../middleware/memoryStorage");
const express = require("express");
const router = express.Router();
const {
    register,
    login,
    logout,
    getAllUsers,
    getUserById,
    getMyProfile,
    updateProfilePicture,
    deleteProfilePicture,
    refreshAccessToken,

} = require("../controllers/userController");


router.post("/register", memoryUpload.single("profilePicture"),validationMiddleware(registerSchema),register);
 router.post("/login",validationMiddleware(loginSchema),login);
  router.get("/logout",authMiddelware,logout);
  router.get("/getallUsers",authMiddelware,authorization("admin"),getAllUsers);
  router.get("/getUserbyID/:id",authMiddelware,authorization("admin"),getUserById);
  router.get("/getMyProfile",authMiddelware,authorization("admin","seller","user"),getMyProfile);

  router.post("/updateprofille",
    authMiddelware,
    memoryUpload.single("profilePicture"),
    updateProfilePicture);

    router.delete(
    "/deleteProfilePicture",
    authMiddelware,
    deleteProfilePicture
);


router.post(
    "/refreshToken",
    refreshAccessToken
);
  

module.exports = router;