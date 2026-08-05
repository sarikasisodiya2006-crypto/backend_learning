const {
    registerUser,
    loginUser,
} = require("../service/authService");

// ================= Register =================

const register = async (req, res) => {
    try {
        const message = await registerUser(req.body);

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

module.exports = {
    register,
    login,
    logout,
};