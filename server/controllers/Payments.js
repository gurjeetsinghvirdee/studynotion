const { instance } = require("../config/razorpay"); // Importing Razorpay instance
const Course = require("../models/Course"); // Importing Course model
const crypto = require("crypto"); // Importing crypto module for cryptographic operations
const User = require("../models/User"); // Importing User model
const mailSender = require("../utils/mailSender"); // Importing mail sender utility function
const mongoose = require("mongoose"); // Importing mongoose for MongoDB operations
const {
    courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail"); // Importing course enrollment email template
const {
    paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail"); // Importing payment success email template
const CourseProgress = require("../models/CourseProgress"); // Importing CourseProgress model

// Function to capture payment
exports.capturePayment = async (req, res) => {
    const { courses } = req.body; // Extracting courses from request body
    const userId = req.user.id; // Extracting user ID from request object
    if (courses.length === 0) { // Checking if courses array is empty
        return res.json({
            success: false,
            message: "Please Provide Course ID",
        });
    }

    let total_amount = 0; // Initializing total amount variable

    for (const course_id of courses) { // Iterating over courses
        let course;
        try {
            course = await Course.findById(course_id); // Finding course by ID

            if (!course) { // If course is not found
                return res.status(200).json({
                    success: false,
                    message: "Could not find the course",
                });
            }

            const uid = new mongoose.Types.ObjectId(userId); // Creating ObjectId for user ID
            if (course.studentsEnrolled.includes(uid)) { // Checking if user is already enrolled
                return res.status(200).json({
                    success: false,
                    message: "Student is already Enrolled",
                });
            }

            total_amount += course.price; // Adding course price to total amount
        } catch (error) { // Handling errors
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Creating options for Razorpay payment
    const options = {
        amount: total_amount * 100, // Converting amount to paise (Indian currency)
        currency: "INR", // Setting currency to Indian Rupee
        receipt: Math.random(Date.now()).toString(), // Generating a random receipt number
    }

    try {
        const paymentResponse = await instance.orders.create(options); // Creating Razorpay order
        console.log(paymentResponse);
        res.json({
            success: true,
            data: paymentResponse,
        })
    } catch (error) { // Handling errors
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Could not initiate order."
        });
    }
};

// Function to verify payment
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id; // Extracting order ID from request body
    const razorpay_payment_id = req.body?.razorpay_payment_id; // Extracting payment ID from request body
    const razorpay_signature = req.body?.razorpay_signature; // Extracting signature from request body
    const courses = req.body?.courses; // Extracting courses from request body
    const userId = req.user.id; // Extracting user ID from request object

    // Checking if all necessary parameters are provided
    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courses ||
        !userId
    ) {
        return res.status(200).json({
            success: false,
            message: "Payment Failed"
        })
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id; // Creating string to generate signature

    // Generating expected signature
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    // Verifying signature
    if (expectedSignature === razorpay_signature) {
        await enrollStudents(courses, userId, res); // Enrolling students if payment is verified
        return res.status(200).json({
            success: true,
            message: "Payment Verified"
        });
    }

    return res.status(200).json({
        success: false,
        message: "Payment Failed"
    });
}

// Function to send payment success email
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body; // Extracting order ID, payment ID, and amount from request body
    const userId = req.user.id; // Extracting user ID from request object

    // Checking if all necessary parameters are provided
    if (!orderId || !paymentId || !amount || !userId) {
        return res
            .status(400)
            .json({
                success: false,
                message: "Please provide all the details"
            });
    }

    try {
        const enrolledStudent = await User.findById(userId); // Finding user by ID

        // Sending payment success email
        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100, // Converting amount to rupees
                orderId,
                paymentId
            )
        )
    } catch (error) { // Handling errors
        console.log("error in sending mail");
        return res
            .status(400)
            .json({
                success: false,
                message: "Could not send email"
            });
    }
}

// Function to enroll students in courses
const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) { // Checking if courses or userId are not provided
        return res
            .status(400)
            .json({
                success: false,
                message: "Please provide Course Id and User Id"
            });
    }

    for (const courseId of courses) { // Iterating over courses
        try {
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true }
            )

            if (!enrolledCourse) { // If course is not found
                return res
                    .status(500)
                    .json({
                        success: false,
                        error: "Course not found"
                    })
            }
            console.log("Updated course: ", enrolledCourse);

            // Creating course progress for the enrolled user
            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            })

            // Updating user's enrolled courses and course progress
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: courseProgress._id,
                    },
                },
                { new: true }
            )

            console.log("Enrolled Student: ", enrolledStudent);

            // Sending course enrollment email to the user
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(
                    enrolledCourse.courseName,
                    `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                )
            )

            console.log("Email sent successfully: ", emailResponse.response)
        } catch (error) { // Handling errors
            console.log(error)
            return res.status(400).json({
                success: false,
                error: error.message
            })
        }
    }
}