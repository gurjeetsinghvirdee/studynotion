// Import required modules
const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Import route modules
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

// Connect to database
const database = require("./config/database");
database.connectDB();

// Set port for the server to listen on
const PORT = process.env.PORT || 4000;

// Middleware setup
app.use(express.json()); // Parse incoming request bodies as JSON
app.use(cookieParser()); // Parse cookies attached to the requests
app.use(
    cors({
        origin: "http://localhost:3000", // Allow requests from this origin
        credentials: true, // Enable CORS with credentials
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

// Connect to Cloudinary
const { cloudinaryConnect } = require("./config/cloudinary");
cloudinaryConnect();

// Routes setup
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// Default route to check server status
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running......"
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
