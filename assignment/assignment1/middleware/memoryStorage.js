const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
        "video/mp4",
        "video/mpeg",
        "video/quicktime"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image and video files are allowed!"), false);
    }
};

const memoryUpload = multer({

    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 2
    },
    fileFilter: fileFilter

});

module.exports = memoryUpload;