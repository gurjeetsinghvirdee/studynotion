const mongoose = require("mongoose"); // Mongoose library for MongoDB interactions

// Define schema for course progress tracking
const courseProgressSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course", // Reference to Course model
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model
    },
    completedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection", // Reference to SubSection model
        },
    ],
});

module.exports = mongoose.model("CourseProgress", courseProgressSchema); // Export CourseProgress model