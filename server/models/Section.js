const mongoose = require("mongoose"); // Mongoose library for MongoDB interactions

// Define schema for sections
const sectionSchema = new mongoose.Schema({
    sectionName: {
        type: String, // Name of the section
    },
    subSection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "SubSection", // Reference to SubSection model
        },
    ],
});

module.exports = mongoose.model("Section", sectionSchema); // Export Section model