const express = require("express");
const router = express.Router();

// Importing controller functions for course management
const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
} = require("../controllers/Course");


// Importing controller functions for category management
const {
    showAllCategories,
    createCategory,
    categoryPageDetails,
} = require("../controllers/Category");


// Importing controller function for subsection management
const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/Subsection");


// Importing controller functions for rating and reviews management
const {
    createRating,
    getAverageRating,
    getAllRating,
} = require("../controllers/RatingAndReview");


// Importing controller function for updating course progress
const { updateCourseProgress } = require("../controllers/courseProgress");

// Importing middleware functions for authentication and authorization
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

