const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

// Middleware function for authentication
exports.auth = async (req, res, next) => {
    try {
        // Extract token from request headers, body, or cookies
        const token = 
            req.cookies.token ||
            req.body.token ||
            req.header("Authorization").replace("Bearer", "");

        // Check if token exists
        if (!token) {
            return res.status(401).json({ success: false, message: `Token Missing` });
        }

        try {
            // Verify token and decode user information
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch (error) {
            // Return error if token is invalid
            return res
                .status(401)
                .json({ success: false, message: "Token is invalid" });
        }

        next(); // Proceed to next middleware
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: `Something went wrong while validating the token`,
        });
    }
};

// Middleware function to check if user is a student
exports.isStudent = async (req, res, next) => {
    try {
        // Find user details based on email from decoded token
        const userDetails = await User.findOne({ email: req.user.email });

        // Check if user account type is student
        if (userDetails.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students",
            });
        }
        next(); // Proceed to next middleware
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User role can't be verified` });
    }
};

// Middleware function to check if user is an admin
exports.isAdmin = async (req, res, next) => {
    try {
        // Find user details based on email from decoded token
        const userDetails = await User.findOne({ email: req.user.email });

        // Check if user account type is admin
        if (userDetails.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for admins",
            });
        }
        next(); // Proceed to next middleware
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User role can't be verified` });
    }
};

// Middleware function to check if user is an instructor
exports.isInstructor = async (req, res, next) => {
    try {
        // Find user details based on email from decoded token
        const userDetails = await User.findOne({ email: req.user.email });

        // Check if user account type is instructor
        if (userDetails.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for instructors",
            });
        }
        next(); // Proceed to next middleware
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User role can't be verified` });
    }
};
