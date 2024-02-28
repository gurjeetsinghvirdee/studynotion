const Section = require("../models/Section"); // Importing Section model
const Course = require("../models/Course"); // Importing Course model
const SubSection = require("../models/SubSection"); // Importing SubSection model

// Function to create a new section
exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body; // Extracting section name and course ID from request body

        // Checking if required properties are provided
        if (!sectionName || !courseId ) {
            return res.status(400).json({
                success: false,
                message: "Missing required properties",
            });
        }

        // Creating a new section
        const newSection = await Section.create({ sectionName });

        // Updating course by adding the new section
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                },
            },
            { new: true }
        )
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        // Sending response
        res.status(200).json({
            success: true,
            message: "Selection created successfully",
            updatedCourse,
        });
    } catch (error) { // Handling errors
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Function to update a section
exports.updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId, courseId } = req.body; // Extracting section name, section ID, and course ID from request body

        // Updating the section
        const section = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }
        );

        // Finding and populating course details
        const course = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();

        // Sending response
        res.status(200).json({
            success: true,
            message: section,
            data: course,
        });
    } catch (error) { // Handling errors
        console.error("Error updating section:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Function to delete a section
exports.deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body; // Extracting section ID and course ID from request body

        // Updating the course by removing the section
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            }
        })

        // Finding the section to be deleted
        const section = await Section.findById(sectionId);

        // If section not found, return 404 error
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            })
        }

        // Deleting related sub-sections
        await SubSection.deleteMany({
            _id: {
                $in: section.subSection
            }
        });

        // Deleting the section
        await Section.findByIdAndDelete(sectionId);

        // Finding and populating course details
        const course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        })
        .exec();

        // Sending response
        res.status(200).json({
            success: true,
            message: "Section Deleted",
            data: course 
        });
    } catch (error) { // Handling errors
        console.error("Error deleting section: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};