const { registerModel } = require("../model");
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

module.exports = {
    registerUser,
    loginUser,
};