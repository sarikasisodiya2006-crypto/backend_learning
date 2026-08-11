const validationMiddleware = require('../middleware/validationMiddleware');
const validationSchema = require('../validationSchema/createAddressValidationSchema');
const authValidation = require('../middleware/authValidation');
const authorization = require('../middleware/authorization');
const express = require("express");
const router = express.Router();
const {
    createAddress,
    getAllAddressesController,
    getAddressByIdController,
    updateAddressController,
    deleteAddressController,
    findNearbyAddresses
} = require("../controllers/addressController");

router.post("/createAddress",authValidation,validationMiddleware(validationSchema),authorization("admin","user","seller"),createAddress);
router.get("/getAllAddresses",authValidation, authorization("admin"),getAllAddressesController);

router.get("/getAddressById/:id",authValidation ,authorization("admin","user","seller"), getAddressByIdController);

router.put("/updateAddress/:id", authValidation,authorization("admin","user","seller"), updateAddressController);

router.delete("/deleteAddress/:id", authValidation,authorization("admin","user","seller"), deleteAddressController);

router.get(
    "/nearby",
    authValidation,
    authorization("admin","user","seller"),
    findNearbyAddresses
);

module.exports = router;