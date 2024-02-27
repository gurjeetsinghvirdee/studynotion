const mongoose = require("mongoose"); // Mongoose library for MongoDB interactions

// Define schema for ratings and reviews
const ratingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", // Reference to User model
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course", // Reference to Course model
        index: true,
    },
});

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema); // Export RatingAndReview model
