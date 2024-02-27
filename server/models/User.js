const mongoose = require("mongoose"); // Mongoose library for MongoDB interactions

// Define schema for users
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        enum: ["Admin", "Student", "Instructor"],
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile", // Reference to Profile model
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course", // Reference to Course model
        },
    ],
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    image: {
        type: String,
        required: true,
    },
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress", // Reference to CourseProgress model
        },
    ],
},
{ timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

module.exports = mongoose.model("User", userSchema); // Export User model