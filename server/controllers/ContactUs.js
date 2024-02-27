const { contactUsEmail } = require("../mail/templates/contactFormRes"); // Template for contact form response email
const mailSender = require("../utils/mailSender"); // Utility function for sending emails

// Controller for handling contact form submissions
exports.contactUsController = async (req, res) => {
    const { email, firstname, lastname, message, phoneNo, courntrycode } = req.body
    console.log(req.body);
    try {
        // Send email response to user
        const emailRes = await mailSender(
            email,
            "Your Data send successfully",
            contactUsEmail(email, firstname, lastname, message, phoneNo, courntrycode)
        )
        console.log("Email Res", emailRes);
        return res.json({
            success: true,
            message: "Email send successfully",
        })
    } catch (error) {
        console.log("Error", error);
        console.log("Error message :", error.message);
        return res.json({
            success: false,
            message: "Something went wrong...",
        })
    }
}