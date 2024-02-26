const express = require("express");
const router = express.Router();

// Importing the controller function for handling contact form submissions
const { contactUsController } = require("../controllers/ContactUs")

// Endpoint for handling POST requests to the contact form
router.post("/contact", contactUsController)

module.exports = router