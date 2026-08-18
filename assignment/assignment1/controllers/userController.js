const cloudinary = require("../config/cloudinary");
const registerModel = require("../model/registerModel");
const jwt = require("jsonwebtoken");
const {
    registerUser,
    loginUser,
    getAllUsersServices,
    getUserByIdService,
    getMyProfileService,
} = require("../service/authService");

// ================= Register =================

const register = async (req, res) => {
    try {
        // const message = await registerUser(req.body);
        // return res.status(201).send(message);
        let profilePicture = null;

        if (req.file) {

            const result = await new Promise((resolve, reject) => {

                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "profilePictures"
                    },

                    (error, result) => {

                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                uploadStream.end(req.file.buffer);
            });

            profilePicture = {
        url: result.secure_url,
        publicId: result.public_id
    };
        }

             const message = await registerUser({
            ...req.body,
            profilePicture: profilePicture
        });


        return res.status(201).send(message);

    } catch (err) {
        console.log(err);

        return res.status(400).send(err.message);
    }
};

// ================= Login =================

const login = async (req, res) => {
    try {
        const result = await loginUser(req.body);

        res.cookie("givenToken", result.token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
        });

        

        return res.status(200).send(
            `Welcome ${result.firstname}! You are logged in successfully!`
        );
    } catch (err) {
        console.log(err);

        return res.status(400).send(err.message);
    }
};

// ================= Logout =================

const logout = async (req, res) => {
    try {
        res.clearCookie("givenToken");

        return res.send("User logged out successfully!");
    } catch (err) {
        console.log(err);

        return res.status(500).send("SERVER ERROR!");
    }
};

//================get all users ======================
const getAllUsers = async(req,res)=>{
    try {
         const result = await getAllUsersServices();

        res.status(200).send({
            message: "All users fetched successfully",
            users: result});
        
    } catch (error) {
        console.log(error);

        return res.status(400).send(error.message);
    }
};

//===========getallusersbyID==========
const getUserById = async (req, res) => {
    try {
        const user = await getUserByIdService(req.params.id);

        res.status(200).json({
            message: "User fetched successfully",
            user
        });
    } catch (err) {
        res.status(404).json({
            message: err.message
        });
    }
};

//======my profile=======================

const getMyProfile = async (req, res) => {
    try {
        const user = await getMyProfileService(req.user.userID);

        res.status(200).json({
            message: "Profile fetched successfully",
            user
        });
    } catch (err) {
        res.status(404).json({
            message: err.message
        });
    }
};


//====================update profile picture =======================

const updateProfilePicture = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a profile picture"
            });
        }

        const user = await registerModel.findById(req.user.userID);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Upload new image
        const result = await new Promise((resolve, reject) => {

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "profilePictures"
                },
                (error, result) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }

                }
            );

            uploadStream.end(req.file.buffer);
        });


        // Delete old image
        if (user.profilePicture?.publicId) {

            await cloudinary.uploader.destroy(
                user.profilePicture.publicId
            );
        }


        // Save new image details
        user.profilePicture = {
            url: result.secure_url,
            publicId: result.public_id
        };

        await user.save();


        return res.status(200).json({
            message: "Profile picture updated successfully",
            profilePicture: user.profilePicture
        });

    } catch (error) {

        return res.status(500).json({
            message: "Profile picture update failed",
            error: error.message
        });
    }
};



//===============delete profile picture==============
const deleteProfilePicture = async (req, res) => {

    try {

        const user = await registerModel.findById(req.user.userID);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.profilePicture?.publicId) {
            return res.status(404).json({
                message: "Profile picture not found"
            });
        }

        await cloudinary.uploader.destroy(
            user.profilePicture.publicId
        );

        user.profilePicture = {
            url: null,
            publicId: null
        };

        await user.save();

        return res.status(200).json({
            message: "Profile picture deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: "Profile picture deletion failed",
            error: error.message
        });
    }
};



//==========refresh token============
const refreshAccessToken = async (req, res) => {

    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token missing"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_SECRETKEY_REFRESH
        );

        const newToken = jwt.sign(
            {
                userID: decoded.userID
            },
            process.env.JWT_SECRETKEY,
            {
                expiresIn: "15m"
            }
        );

        res.cookie("givenToken", newToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(200).json({
            message: "Access token refreshed successfully"
        });

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });

    }
};



module.exports = {
    register,
    login,
    logout,
    getAllUsers,
    getUserById,
    getMyProfile,
    updateProfilePicture,
    deleteProfilePicture,
    refreshAccessToken
};