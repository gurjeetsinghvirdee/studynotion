const express = require("express");
const router = express.Router();

// Importing middleware function for authentication and authorization
const { auth, isInstructor } = require("../middlewares/auth");

// Importing controller functions for profile management
const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
    instructorDashboard,
} = require("../controllers/Profile");

// -------------------> Profile Routes <--------------------

// Endpoint for deleting user account
router.delete("/deleteProfile", auth, deleteAccount)

// Endpoint for updating user account
router.put("/updateProfile", auth, updateProfile)

// Endpoint for user details
router.get("/getUserDetails", auth, getAllUserDetails)

// Endpoint for getting enrolled courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)

// Endpoint for updating profile display picture 
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

// Endpoint for accessing instructor dashboard
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router;