const Course = require("../models/Course"); // Importing Course model
const Category = require("../models/Category"); // Importing Category model
const Section = require("../models/Section"); // Importing Section model
const SubSection = require("../models/SubSection"); // Importing SubSection model
const User = require("../models/User"); // Importing User model
const { uploadImageToCloudinary } = require("../utils/imageUploader"); // Importing Utility function for uploading images
const CourseProgress = require("../models/CourseProgress"); // Importing CourseProgress model
const { convertSecondsToDuration } = require("../utils/secToDuration"); // Importing Utility function for converting seconds to duration

// Controller to create a new course
exports.createCourse = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracting user id from request

        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag: _tag,
            category,
            status,
            instructions: _instructions,
        } = req.body; // Extracting required fields from request body

        const thumbnail = req.files.thumbnailImage; // Extracting thumbnail image from request

        const tag = JSON.parse(_tag); // Parsing tag from string to JSON
        const instructions = JSON.parse(_instructions); // Parsing instructions from string to JSON

        console.log("tag", tag);
        console.log("instructions", instructions);

        // Validation checks for mandatory fields
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
            });
        }

        if (!status || status === undefined) {
            status = "Draft";
        }

        // Fetching instructor details
        const instructionDetails = await User.findById(userId, {
            accountType: "Instructor",
        });

        // If instructor details not found
        if (!instructionDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details not found",
            });
        }

        // Fetching category details
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details not found"
            });
        }

        // Uploading thumbnail image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
        );
        console.log(thumbnailImage);

        // Creating new course
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
        });

        // Updating instructor's courses
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
        );

        // Adding course to category's courses
        const categoryDetails2 = await Category.findOneAndUpdate(
            { _id: category },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true }
        );
        console.log("HERE", categoryDetails2);
        res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course created successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
};

// Controller to edit course details
exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body; // Extracting courseId from request body
        const updates = req.body; // Extracting updates from request body
        const course = await Course.findById(courseId); // Finding course by id

        if (!course) {
            return res.status(404).json({
                error: "Course not found"
            });
        }

        if (req.files) {
            console.log("thumbnail update");
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            );
            course.thumbnail = thumbnailImage.secure_url;
        }

        // Updating course details
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (key === "tag" || key === "instructions") {
                    course[key] = JSON.parse(updates[key]);
                } else {
                    course[key] = updates[key];
                }
            }
        }

        await course.save(); // Saving updated course

        // Populating course details with references
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
            .exec();
        
        res.json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

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
            .exec();

        return res.status(200).json({
            success: true,
            data: allCourses,
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            success: false,
            message: `Can't fetch course data`,
            error: error.message,
        });
    }
};

// Controller to get details of a specific course
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
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
            .exec();

        if (!courseDetails) {
            return res.status(400).json({
                success: fail,
                message: `Could not find course with id: ${courseId}`,
            });
        }

        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration);
                totalDurationInSeconds += timeDurationInSeconds;
            });
        });

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Controller to get full details of a specific course for a user
exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;
        const courseDetails = await Course.findOne({
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
            .exec();

        let courseProgressCount = await CourseProgress.find({
            courseID: courseId,
            userId: userId,
        });

        console.log("courseProgressCount :", courseProgressCount);

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            });
        }

        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration);
                totalDurationInSeconds += timeDurationInSeconds;
            });
        });

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos
                    ? courseProgressCount?.completedVideos
                    : [],
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Controller to get courses of a specific instructor
exports.getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id;
        const instructorCourses = await Course.find({
            instructor: instructorId,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: instructorCourses,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        });
    }
};

// Controller to delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({
                message: "Course not found"
            });
        }

        const studentsEnrolled = course.studentsEnrolled;
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentsId, {
                $pull: { courses: courseId },
            });
        }

        const courseSections = course.courseContent;
        for (const sectionId of courseSections) {
            const section = await Section.findById(sectionId);
            if (section) {
                const subSections = section.subSection;
                for (const subSectionId of subSections) {
                    await SubSection.findByIdAndDelete(subSectionId);
                }
            }

            await Section.findByIdAndDelete(sectionId);
        }

        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: "Course Deleted Successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};