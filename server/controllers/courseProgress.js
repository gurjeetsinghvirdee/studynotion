// Importing necessary modules and models
const mongoose = require("mongoose");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");

// Controller function to update course progress
exports.updateCourseProgress = async (req, res) => {
    // Destructuring courseId, subsectionId, and userId from request body and user object
    const { courseId, subsectionId } = req.body;
    const userId = req.user.id;

    try {
        // Finding the subsection by its ID
        const subSection = await SubSection.findById(subsectionId);
        // Handling if the subsection doesn't exist
        if (!subSection) {
            return res.status(404).json({
                error: "Invalid subsection"
            });
        }

        // Finding course progress based on courseID and userId
        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        });

        // Handling if course progress doesn't exist
        if (!courseProgress) {
            return res.status(404).json({
                success: false,
                message: "Course progress does not exist",
            });
        } else {
            // Checking if the subsection is already completed
            if (courseProgress.completedVideos.includes(subsectionId)) {
                return res.status(400).json({
                    error: "Subsection already completed"
                });
            }
            // Adding the completed subsection to course progress
            courseProgress.completedVideos.push(subsectionId);
        }

        // Saving the updated course progress
        await courseProgress.save();

        // Responding with success message
        return res.status(200).json({
            message: "Course progress updated"
        });
    } catch (error) {
        // Handling errors
        console.error(error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};