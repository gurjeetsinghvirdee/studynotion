const Razorpay = require("razorpay");

// Create a Razorpay instance with API keys from environment variables
exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,       // Razorpay API key ID
    key_secret: process.env.RAZORPAY_SECRET // Razorpay API secret key
});
