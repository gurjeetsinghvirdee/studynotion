const mongoose = require("mongoose"); // Mongoose library for MongoDB interactions

// Define schema for subsections
const subSectionSchema = new mongoose.Schema({
    title: { type: String }, // Title of the subsection
    timeDuration: { type: String }, // Duration of the subsection
    description: { type: String }, // Description of the subsection
    videoUrl: { type: String }, // URL of the video associated with the subsection
});

module.exports = mongoose.model("SubSection", subSectionSchema); // Export SubSection model
