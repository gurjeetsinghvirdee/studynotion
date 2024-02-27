const mongoose = require("mongoose"); // Mongoose library for MongoDB interactions

// Define schema for categories
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course", // Reference to Course model
        },
    ],
});

module.exports = mongoose.model("Category", categorySchema); // Export Category model