const mongoose = require("mongoose"); // Mongoose library for MongoDB interactions

// Define schema for user profiles
const profileSchema = new mongoose.Schema({
    gender: {
        type: String, // Gender of the user
    },
    dateOfBirth: {
        type: String, // Date of birth of the user
    },
    about: {
        type: String,
        trim: true, // Trim whitespace from the beginning and end of the string
    },
    contactNumber: {
        type: Number,
        trim: true, // Trim whitespace from the beginning and end of the string
    },
});

module.exports = mongoose.model("Profile", profileSchema); // Export Profile model