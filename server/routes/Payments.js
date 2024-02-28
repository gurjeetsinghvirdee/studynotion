// Importing necessary modules
const express = require("express");
const router = express.Router();

// Importing payment controllers
const {
    capturePayment,
    verifyPayment,
    sendPaymentSuccessEmail
} = require("../controllers/Payments");;

// Importing authentication middleware
const {
    auth,
    isInstructor,
    isStudent,
    isAdmin
} = require("../middlewares/auth");

// Route for capturing payment
router.post("/capturePayment", auth, isStudent, capturePayment);

// Route for verifying payment
router.post("/verifyPayment", auth, isStudent, verifyPayment);

// Route for sending payment success mail
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

// Exporting the router
module.exports = router;