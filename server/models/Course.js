const mongoose = require("mongoose"); // Mongoose library for MongoDB interactions

// Define schema for courses
const courseSchema = new mongoose.Schema({
    courseName: { type: String }, // Name of the course
    courseDescription: { type: String }, // Description of the course
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", // Reference to User model for instructor
    },
    whatYouWillLearn: { type: String }, // What users will learn from the course
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section", // Reference to Section model for course content
        },
    ],
    ratingAndReview: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview", // Reference to RatingAndReview model for course ratings and reviews
        },
    ],
    price: { type: Number }, // Price of the course
    thumbnail: { type: String }, // URL of the course thumbnail image
    tag: {
        type: [String], // Tags associated with the course
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Reference to Category model for course category
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User", // Reference to User model for enrolled students
        },
    ],
    instructions: {
        type: [String], // Instructions for the course
    },
    status: {
        type: String,
        enum: ["Draft", "Published"], // Status of the course
    },
    createdAt: {
        type: Date,
        default: Date.now // Date when the course was created
    },
});

module.exports = mongoose.model("Course", courseSchema); // Export Course model