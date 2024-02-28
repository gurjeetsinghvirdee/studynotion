const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDB = () => {
    const dbUrl = process.env.MONGODB_URL;
    console.log("Attempting to connect to MongoDB:", dbUrl);

    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.log("Database connection failed");
        console.error(err);
        process.exit(1);
    });
};