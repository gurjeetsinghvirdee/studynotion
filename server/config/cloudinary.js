const cloudinary = require("cloudinary").v2;

// Function to connect to Cloudinary
exports.cloudinaryConnect = () => {
    try {
        // Configure Cloudinary with credentials from environment variables
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,    // Cloudinary cloud name
            api_key: process.env.API_KEY,          // Cloudinary API key
            api_secrets: process.env.API_SECRET,   // Cloudinary API secret
        });
    } catch (error) {
        console.log(error);    // Log any errors that occur during configuration
    }
};
