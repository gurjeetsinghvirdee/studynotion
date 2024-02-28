const mongoose = require("mongoose");
require("dotenv").config();

// Function to connect to MongoDB
exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,         // Use new URL parser
        useUnifiedTopology: true,      // Use new Server Discover and Monitoring engine
    })
    .then(() => console.log("DB Connected Successfully"))   // Log successful connection
    .catch((error) => {
        console.log("DB Connection Failed");    // Log failed connection
        console.error(error);   // Log the error message
        process.exit(1);        // Exit process with error code 1
    });
};