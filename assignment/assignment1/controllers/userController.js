const cloudinary = require("../config/cloudinary");
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
        let profilePictureUrl = null;

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

            profilePictureUrl = result.secure_url;
        }

             const message = await registerUser({
            ...req.body,
            profilePicture: profilePictureUrl
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

module.exports = {
    register,
    login,
    logout,
    getAllUsers,
    getUserById,
    getMyProfile,
};