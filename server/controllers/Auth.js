const bcrypt = require("bcrypt"); // Library for hashing passwords
const User = require("../models/User"); // User model
const OTP = require("../models/OTP"); // OTP model
const jwt = require("jsonwebtoken"); // Library for generating JWT tokens
const otpGenerator = require("otp-generator"); // Library for generating OTPs
const mailSender = require("../utils/mailSender"); // Utility function for sending emails
const { passwordUpdated } = require("../mail/templates/passwordUpdate"); // Template for password update email
const Profile = require("../models/Profile"); // Profile model
require("dotenv").config() // Environment variables

// Function to handle user signup
exports.signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            accountType,
            contactNumber,
            otp,
        } = req.body
        
        // Check if all required fields are provided
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !accountType ||
            !contactNumber ||
            !otp
        ) {
            return res.status(403).send({
                success: false,
                message: "All fields are required",
            })
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Password and Confirm Password do not match. Please try again.",
            })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            })
        }

        // Check if OTP is valid
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
        console.log(response);
        if (response.length === 0 || otp !== response[0].otp) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Determine if user is approved (assumed based on account type)
        let approved = ""
        approved === "Instructor" ? (approved = false) : (approved = true)

        // Create profile details
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })

        // Create new user
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image: "",
        })

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again."
        })
    }
}

// Function to handle user login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            })
        }

        // Find user by email
        const user = await User.findOne({ email }).populate("additionalDetails")

        // If user does not exist
        if (!user) {
            return res.status(401).json({
                success: false,
                message: `User is not Registered with us, Please SignUp to Continue`,
            })
        }

        // Check if password is correct
        if (await bcrypt.compare(password, user.password)) {
            // Generate JWT token
            const token = jwt.sign(
                { 
                    email: user.email, 
                    id: user._id, 
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiredIn: "24h",
                }
            )

            // Remove password from user object
            user.token = token
            user.password = undefined

            // Set JWT token as cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookies("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User Login Success",
            })
        } else {
            return res.status(401).json({
                success: false,
                message: `Password is incorrect`,
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again.`,
        })
    }
}

// Function to send OTP
exports.sendotp = async (req, res) => {
    try {
        const { email } = req.body 

        // Check if user is already registered
        const checkUserPresent = await User.findOne({ email })

        if (checkUserPresent) {
            return res.status(401).json ({
                success: false,
                message: `User is Already Registered`,
            })
        }

        // Generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        const result = await OTP.findOne({ otp: otp })
        console.log("Result is Generate OTP function");
        console.log("OTP", otp);
        console.log("Result", result);
        // Ensure OTP is unique
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            })
        }
        const otpPayload = { email, otp }
        // Save OTP to database
        const otpBody = await OTP.create(otpPayload)
        console.log("OTP Body", otpBody);
        res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ 
            success: false,
            error: error.message
        })
    }
}

// Function to change user password
exports.changePassword = async (req, res) => {
    try {
        const userDetails = await User.findById(req.user.id)
        const { oldPassword, newPassword } = req.body
        // Check if old password matches
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        )
        if (!isPasswordMatch) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "The password is incorrect"
                })
        }

        // Encrypt new password
        const encryptedPassword = await bcrypt.hash(newPassword, 10)
        // Update password in database
        const updatedUserDetails = await
        User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        )

        try {
            // Send email notification for password update
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Your Password has been updated",
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            )
            console.log("Email sent successfully:", emailResponse.response);
        } catch (error) {
            console.error("Oops! Something went wrong while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Oops! Something went wrong while sending email",
                error: error.message,
            })
        }

        return res
            .status(200)
            .json({
                success: true,
                message: "Password updated successfully"
            })
    } catch (error) {
        console.error("Error occurred while updating password", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message
        })
    }
}