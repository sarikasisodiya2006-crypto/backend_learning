const cloudinary = require("../config/cloudinary");



const uploadDiskFileController = async (req, res) => {

    try {

        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        return res.status(200).json({
            message: "Files uploaded successfully using disk storage",
            files: req.files
        });

    } catch (error) {

        return res.status(500).json({
            message: "Upload failed",
            error: error.message
        });

    }
};


const uploadMemoryFileController = async (req, res) => {

    // try {

    //     console.log("BODY:", req.body);
    //     console.log("FILES:", req.files);

    //     return res.status(200).json({
    //         message: "Files received using memory storage",
    //         files: req.files.map(file => ({
    //             originalname: file.originalname,
    //             mimetype: file.mimetype,
    //             size: file.size
    //         }))
    //     });

    // } catch (error) {

    //     return res.status(500).json({
    //         message: "Upload failed",
    //         error: error.message
    //     });

    // }

        try {

        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({
                message: "Please upload files"
            });
        }

        const uploadedFiles = [];

        for (const file of files) {

            const result = await new Promise((resolve, reject) => {

                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "my-app"
                    },

                    (error, result) => {

                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                uploadStream.end(file.buffer);
            });

            uploadedFiles.push({
                originalname: file.originalname,
                imageUrl: result.secure_url,
                publicId: result.public_id
            });
        }

        return res.status(200).json({
            message: "Files uploaded successfully",
            files: uploadedFiles
        });

    } catch (error) {

        return res.status(500).json({
            message: "Image upload failed",
            error: error.message
        })

    }


};


module.exports = {
    uploadDiskFileController,
    uploadMemoryFileController
};