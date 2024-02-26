const nodemailer = require("nodemailer");

// Function for sending emails using Nodemailer
const mailSender = async (email, title, body) => {
    try {
        // Create a transporter with email configuration
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,    // SMTP host
            auth: {
                user: process.env.MAIL_USER,    // Email address for authentication
                pass: process.env.MAIL_PASS,    // Password or application-specific password
            }
        });

        // Send email
        let info = await transporter.sendMail({
            from: 'StudyNotion',    // Sender name
            to: `${email}`,         // Recipient email address
            subject: `${title}`,    // Email subject
            html: `${body}`,        // Email body (HTML content)
        });

        console.log(info);   // Log email info
        return info;        // Return email info
    } catch (error) {
        console.log(error.message);    // Log any errors that occur during email sending
    }
};

module.exports = mailSender;    