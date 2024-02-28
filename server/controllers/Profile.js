// Import required modules
const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mongoose = require("mongoose");
const { convertSecondsToDuration } = require("../utils/secToDuration");

// Controller function to update user profile
exports.updateProfile = async (req, res) => {
    try {
        // Extract profile data from request body
        const {
            firstName = "",
            lastName = "",
            dateOfBirth = "",
            about = "",
            contactNumber = "",
            gender = "",
        } = req.body;

        // Extract user id from request
        const id = req.user.id;

        // Find user details and profile
        const userDetails = await User.findById(id);
        const profile = await Profile.findById(userDetails.additionalDetails);

        // Update user details
        const user = await User.findByIdAndUpdate(id, {
            firstName,
            lastName,
        });
        await user.save();

        // Update profile details
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.contactNumber = contactNumber;
        profile.gender = gender;
        await profile.save();

        // Fetch updated user details with profile
        const updatedUserDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec();

        // Return success response
        return res.json({
            success: true,
            message: "Profile updated successfully",
            updatedUserDetails,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Controller function to delete user account
exports.deleteAccount = async (req, res) => {
    try {
        // Extract user id from request
        const id = req.user.id;

        // Find user details
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete user profile and enrolled courses
        await Profile.findByIdAndDelete(user.additionalDetails);
        for (const courseId of user.courses) {
            await Course.findByIdAndUpdate(
                courseId,
                { $pull: { studentsEnrolled: id } },
                { new: true }
            );
        }

        // Delete user account
        await User.findByIdAndDelete(id);

        // Return success response
        return res.status(200).json({
            success: true,
            message: "User account deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "User account could not be deleted"
        });
    }
};

// Controller function to get all user details
exports.getAllUserDetails = async (req, res) => {
    try {
        // Extract user id from request
        const id = req.user.id;

        // Find and populate user details
        const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec();
        console.log(userDetails);

        // Return user details
        res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            data: userDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Controller function to update user display picture
exports.updateDisplayPicture = async (req, res) => {
    try {
        // Extract display picture from request
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;

        // Upload image to Cloudinary
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        );

        // Update user profile with image
        const updatedProfile = await User.findByIdAndUpdate(
            { _id: userId },
            { image: `Image updated successfully` },
            { new: true }
        );

        // Return success response
        res.send({
            success: true,
            message: `Image updated successfully`,
            data: updatedProfile,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Controller function to get enrolled courses of a user
exports.getEnrolledCourses = async (req, res) => {
    try {
        // Extract user id from request
        const userId = req.user.id;

        // Find user and populate enrolled courses with subsection details
        let userDetails = await User.findOne({
            _id: userId,
        })
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    },
                },
            })
            .exec();

        // Convert to plain object to modify data
        userDetails = userDetails.toObject();

        // Calculate total duration and progress percentage for each course
        for (var i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0;
            let SubsectionLength = 0;
            for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0);
                userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);
                SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length;
            }
            let courseProgressCount = userDetails.courses[i].courseProgressCount?.completedVideos.length;
            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100;
            } else {
                const multiplier = Math.pow(10, 2);
                userDetails.courses[i].progressPercentage = Math.round((courseProgressCount / SubsectionLength) * 100 * multiplier) / multiplier;
            }
        }

        // Return enrolled courses data
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Controller function for instructor dashboard
exports.instructorDashboard = async (req, res) => {
    try {
        // Find courses by instructor id
        const courseDetails = await Course.find({ instructor: req.user.id });

        // Map course data to include statistics
        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            };

            return courseDataWithStats;
        });

        // Return course data with statistics
        res.status(200).json({ courseData });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
};