const User = require("../models/User"); // User model
const mailSender = require("../utils/mailSender"); // Utility function for sending emails
const bcrypt = require("bcryptjs"); // Library for hashing passwords
const crypto = require("crypto"); // Library for generating random tokens

// Controller to generate and send password reset token
exports.resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        // Check if user exists
        if (!user) {
            return res,json({
                success: false,
                message: `This Email: ${email} is not Registered with us`
            });
        }

        // Generate random token
        const token = crypto.randomBytes(20).toString("hex");
        // Update user details with token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 3600000, // Token expires in 1 hour
            },
            { new: true }
        );
        console.log("DETAILS", updatedDetails);

        // Create URL for password reset
        const url = `http://localhost:3000/update-password/${token}`;

        // Send password reset link via email
        await mailSender(
            email,
            "Password Reset",
            `Your Link for email verification is ${url}. Please go through this url to reset your password.`
        );

        res.json({
            success: true,
            message: "Email Send Successfully, Please check your Email to continue further",
        });
    } catch (error) {
        return res.json({
            error: error.message,
            success: false,
            message: `We are facing some technical issues in sending the reset Link`,
        });
    }
};

// Controller to reset user password using token
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        // Check if passwords match
        if (confirmPassword !== password) {
            return res.json({
                success: false,
                message: "Please check your password it doesn't match",
            });
        }

        // Find user by token
        const userDetails = await User.findOne({ token: token });
        // Check if user exists
        if (!userDetails) {
            return res.json({
                success: false,
                message: "Token is Invalid",
            });
        }

        // Check if token is expired
        if (!(userDetails.resetPasswordExpires > Date.now())) {
            return res.status(403).json({
                success: false,
                message: `Token is Expired, Please Regenerate your token`,
            });
        }

        // Encrypt new password
        const encryptedPassword = await bcrypt.hash(password, 10);
        // Update user password
        await User.findOneAndUpdate(
            { token: token },
            { password: encryptedPassword },
            { new: true }
        );
        res.json({
            success: true,
            message: `Password Reset Successful`,
        });
    } catch (error) {
        return res.json({
            error: error.message,
            success: false,
            message: `Some technical issue in updating your password`,
        });
    }
};