const registerModel  = require("../model/registerModel");
const{addressModel}= require("../model/addressModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ================= Register =================

const registerUser = async (data) => {
    const {
        firstname,
        lastname,
        email,
        dob,
        gender,
        role,
        createPassword,
        confirmPassword,
        
    } = data;

    if (createPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
    }

    const userExists = await registerModel.findOne({ email });

    if (userExists) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(
        createPassword,
        Number(process.env.SALT)
    );

    const userData = {
        firstname,
        lastname,
        email,
        dob,
        gender,
        role,
        Password: hashedPassword,
    };

    await registerModel.create(userData);

    return "User registered successfully";
};

// ================= Login =================

const loginUser = async (data) => {
    const { email, Password } = data;

    const userExist = await registerModel.findOne({ email });

    if (!userExist) {
        throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
        Password,
        userExist.Password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
        { userID: userExist._id ,role:userExist.role},
        process.env.JWT_SECRETKEY,
        { expiresIn: "1h" }
    );

    return {
        token,
        firstname: userExist.firstname,
    };
};

//===============getallusers==========
const getAllUsersServices = async()=>{
    const users = await registerModel.find().populate("addresses");
    return users;
};

//=======get user by id===========
const getUserByIdService = async (id) => {
    const user = await registerModel
        .findById(id)
        .select("-Password").populate("addresses");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

//======my profile===============================

const getMyProfileService = async (userId) => {
    const user = await registerModel
        .findById(userId)
        .select("-Password").populate("addresses");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsersServices,
    getUserByIdService,
    getMyProfileService,
};