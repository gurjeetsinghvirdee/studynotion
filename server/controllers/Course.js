const Course = require("../models/Course"); // Course model
const Category = require("../models/Category"); // Category model
const Section = require("../models/Section"); // Section model
const SubSection = require("../models/SubSection"); // SubSection model
const User = require("../models/User"); // User model
const { uploadImageToCloudinary } = require("../utils/imageUploader"); // Utility function for uploading images
const CourseProgress = require("../models/CourseProgress"); // CourseProgress model
const { convertSecondsToDuration } = require("../utils/secToDuration"); // Utility function for converting seconds to duration

// Controller to create a new course
exports.createCourse = async (req, res) => {
    try {
        const userId = req.user.userId

        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag: _tag,
            category,
            status,
            instructions: _instructions,
        } = req.body

        const thumbnail = req.files.thumbnailImage

        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)

        console.log("tag", tag);
        console.log("instructions", instructions);

        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag.length ||
            !thumbnail ||
            !category ||
            !instructions.length
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory",
            })
        }

        if (!status || status === undefined) {
            status = "Draft"
        }

        const instructionDetails = await User.findById(userId, {
            accountType: "Instructor",
        })

        if (!instructionDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details not found",
            })
        }

        const categoryDetails = await Category.findById(category)
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details not found"
            })
        }

        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
        )
        console.log(thumbnailImage);

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions,
        })

        await User.findByIdAndUpdate(
            {
                _id: instructionDetails._id,
            },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        )

        const categoryDetails2 = await Category.findOneAndUpdate(
            { _id: category },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        )
        console.log("HERE", categoryDetails2);
        res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course created successfully",
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        })
    }
}

// Controller to edit course details
exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const updates = req.body
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).json({
                error: "Course not found"
            })
        }

        if (req.files) {
            console.log("thumbnail update");
            const thumbnail = req.files.thumbnailImage
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url
        }

        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (key === "tag" || key === "instructions") {
                    course[key] = JSON.parse(updates[key])
                } else {
                    course[key] = updates[key]
                }
            }
        }

        await course.save()

        const updatedCourse = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()
        
            res.json({
                success: true,
                message: "Course updated successfully",
                data: updatedCourse,
            })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

// Controller to get all published courses
exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find(
            { status: "Published" },
            {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEnrolled: true,
            }
        )

            .populate("instructor")
            .exec()

        return res.status(200).json({
            success: true,
            data: allCourses,
        })
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            success: false,
            message: `Can't fetch course data`,
            error: error.message,
        })
    }
}

// Controller to get details of a specific course
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body
        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additional Details",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                    select: "-videoUrl",
                },
            })
            .exec()

        if (!courseDetails) {
            return res.status(400).json({
                success: fail,
                message: `Could not find course with id: ${courseId}`,
            })
        }

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
    }
}

