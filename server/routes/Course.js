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

// Importing controller functions for section management
const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section");


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

// -------------------------------> Course Routes <------------------------------------

router.post("/createCourse", auth, isInstructor, createCourse)
router.post("/addSection", auth, isInstructor, createSection)
router.post("/updateSection", auth, isInstructor, updateSection)
router.post("/deleteSection", auth, isInstructor, deleteSection)
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
router.post("/addSubSection", auth, isInstructor, createSubSection)
router.get("/getCourseDetails", getAllCourses)
router.post("/getCourseDetails", getCourseDetails)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
router.post("/editCourse", auth, isInstructor, editCourse)
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
router.delete("/deleteCourse", deleteCourse)
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)

// ---------------------------------> Category Routes Accessed by Admin Only <--------------------------------

router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ---------------------------------> Rating and Review <------------------------------------------

router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router;