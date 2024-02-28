// Import necessary modules and functions
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Controller function to create a new subsection
exports.createSubSection = async (req, res) => {
    try {
        // Extracting necessary data from the request body
        const { sectionId, title, description } = req.body;
        const video = req.files.video;

        // Checking if all required fields are present
        if (!sectionId || !title || !description || !video) {
            return res.status(404).json({ success: false, message: "All Fields are Required" });
        }

        // Uploading the video to Cloudinary and getting upload details
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // Creating a new SubSection with upload details
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        });

        // Updating the corresponding section with the new subsection
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $push: { subSection: SubSectionDetails._id } },
            { new: true }
        ).populate("subSection");

        // Responding with success and updated section data
        return res.status(200).json({ success: true, data: updatedSection });
    } catch (error) {
        // Handling errors
        console.error("Error creating new sub-section:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Controller function to update an existing subsection
exports.updateSubSection = async (req, res) => {
    try {
        // Extracting necessary data from the request body
        const { sectionId, subSectionId, title, description } = req.body;
        const subSection = await SubSection.findById(subSectionId);

        // Handling if subsection not found
        if (!subSection) {
            return res.status(404).json({ success: false, message: "SubSection not found" });
        }

        // Updating title if provided
        if (title !== undefined) {
            subSection.title = title;
        }

        // Updating description if provided
        if (description !== undefined) {
            subSection.description = description;
        }

        // Uploading a new video if provided
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`;
        }

        // Saving the updated subsection
        await subSection.save();

        // Finding and populating the updated section
        const updatedSection = await Section.findById(sectionId).populate("subSection");

        // Responding with success and updated section data
        return res.json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
        });
    } catch (error) {
        // Handling errors
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
        });
    }
};

// Controller function to delete a subsection
exports.deleteSubSection = async (req, res) => {
    try {
        // Extracting subsection and section IDs from the request body
        const { subSectionId, sectionId } = req.body;

        // Removing the subsection from the corresponding section
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $pull: { subSection: subSectionId } }
        );

        // Deleting the subsection
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId });

        // Handling if subsection not found
        if (!subSection) {
            return res.status(404).json({ success: false, message: "SubSection not found" });
        }

        // Finding and populating the updated section
        const updatedSection = await Section.findById(sectionId).populate("subSection");

        // Responding with success and updated section data
        return res.json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedSection,
        });
    } catch (error) {
        // Handling errors
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the SubSection",
        });
    }
};