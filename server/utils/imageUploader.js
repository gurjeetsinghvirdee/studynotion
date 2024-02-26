const cloudinary = require('cloudinary').v2;

// Function for uploading an image to Cloudinary
exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    // Define options for uploading
    const options = { folder };
    
    // Add height option if provided
    if (height) {
        options.height = height;
    }

    // Add quality option if provided
    if (quality) {
        options.quality = quality;
    }
    
    // Set resource type to auto
    options.resource_type = "auto";

    // Upload image to Cloudinary
    return await cloudinary.upload(file.tempFilePath, options);
};
