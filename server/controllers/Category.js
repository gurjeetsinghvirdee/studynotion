const { Mongoose } = require("mongoose"); // Mongoose library for MongoDB interactions
const Category = require("../models/Category"); // Category model

// Function to generate random integer
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

// Controller to create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        // Check if name is provided
        if (!name) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "All fields are required"
                });
        }

        // Create new category
        const CategoryDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log(CategoryDetails);
        return res.status(200).json({
            success: true,
            message: "Categorys Created Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: true,
            message: error.message,
        });
    }
};

// Controller to fetch all categories
exports.showAllCategories = async (req, res) => {
    try {
        console.log("Show All Categories");
        const allCategorys = await Category.find({});
        res.status(200).json({
            success: true,
            data: allCategorys,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Controller to fetch details for a specific category page
exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body
        console.log("Printing Category Id", categoryId);

        // Find selected category and populate related courses
        const selectedCategory = await Category.findById(categoryId)
         .populate({
            path: "courses",
            match: { status: "Published" },
            populate: "ratingAndReviews",
         })
         .exec()

        if (!selectedCategory) {
         console.log("Category not found");
         return res
            .status(404)
            .json({
                success: false,
                message: "No courses found for the selected category",
            })
        }
        
        // Find a different category to display
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
             ._id
        )
            .populate({
                path: "courses",
                match: { status: "Published" },
            })
            .exec()

        // Fetch all categories, their courses, and instructor details
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: {
                    path: "instructor",
                },
            })
            .exec()

        // Extract all courses from categories
        const allCourses = allCategories.flatMap((category) => category.courses)
        // Find top selling courses
        const mostSellingCourses = allCategories
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)

        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}