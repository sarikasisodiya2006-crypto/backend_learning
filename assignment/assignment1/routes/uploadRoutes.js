const express = require("express");

const router = express.Router();

const diskUpload = require("../middleware/diskStorage");
const memoryUpload = require("../middleware/memoryStorage");

const {
    uploadDiskFileController,
    uploadMemoryFileController
} = require("../controllers/uploaddController");


router.post(
    "/uploadDisk",
    diskUpload.array("files", 2),
    uploadDiskFileController
);


router.post(
    "/uploadMemory",
    memoryUpload.array("files", 2),
    uploadMemoryFileController
);


module.exports = router;