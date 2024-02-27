const mongoose = require("mongoose"); // Mongoose library for MongoDB interactions
const mailSender = require("../utils/mailSender"); // Utility function for sending emails
const emailTemplate = require("../mail/templates/emailVerificationTemplate"); // Email verification template

// OTP Schema definition
const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5, // Document expires after 5 minutes
    },
});

// Function to send verification email
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            emailTemplate(otp)
        );
        console.log("Email sent successfully: ", mailResponse.response);
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
    }
}

// Pre-save hook to send verification email when a new OTP document is created
OTPSchema.pre("save", async function (next) {
    console.log("New document saved to database");

    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp)
    }
    next();
});

// OTP model
const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;