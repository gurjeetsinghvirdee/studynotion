// Importing necessary modules
const express = require("express");
const router = express.Router();

// Importing authentication controllers
const {
    login,
    signup,
    sendotp,
    changePassword,
} = require("../controllers/Auth");

// Importing reset password controllers
const {
    resetPasswordToken,
    resetPassword
} = require("../controllers/ResetPassword");

// Importing authentication middleware
const { auth } = require("../middlewares/auth");

// --------------------------> Authentication Routes <----------------------------

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signup);

// Route for sending OTP
router.post("/sendotp", sendotp);

// Route for changing password
router.post("/changePassword", changePassword);

// ---------------------------> Reset Password <-------------------------

// Route for generating reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting password
router.post("/reset-password", resetPassword);

// Exporting the router
module.exports = router;