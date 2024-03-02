import React from "react";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast"
import { BsFillCareRightFill } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addToCart } from "../../../slices/cartSlice";
import { ACCOUNT_TYPE } from "../../../utils/constant";

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
    // Redux state selectors
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Destructuring course object
    const {
        thumbnail: ThumbnailImage,
        price: CurrentPrice,
        _id: courseId,
    } = course;

    // Function to copy the current URL to clipboard
    const handleShare = () => {
        copy(window.location.href);
        toast.success("Link copied to clipboard");
    };

    // Function to handle adding course to cart
    const handleAddToCart = () => {
        // Check if user is an instructor
        if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
            toast.error("You are an Instructor. You can't buy a course.");
            return;
        }
        // Check if user is logged in
        if (token) {
            dispatch(addToCart(course));
            return;
        }
        // If user is not logged in, show confirmation modal
        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to add to Cart",
            bt1Text: "Login",
            btnText2: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
        });
    };

    return (
        <>
            <div 
                // Container for course details card
                className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
            >
                {/* Thumbnail Image */}
                <img 
                    src={ThumbnailImage}
                    alt={course?.courseName}
                    className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
                />
                <div className="px-4">
                    {/* Current price */}
                    <div className="space-x-3 pb-4 text-3xl font-semibold">
                        Rs. {CurrentPrice}
                    </div>
                    <div className="flex flex-col gap-4">
                        {/* Button to go to course or buy */}
                        <button
                            className="yellowButton"
                            onClick={
                                user && course?.studentsEnrolled.includes(user?._id)
                                    ? () => navigate("/dashboard/enrolled-courses")
                                    : handleBuyCourse
                            }
                        >
                            {user && course?.studentsEnrolled.includes(user?._id)
                                ? "Go to Course" : "Buy now"                         
                            }
                        </button>
                        {/* Button to add to cart */}
                        {(!user || !course?.studentsEnrolled.includes(user?._id)) && (
                            <button onClick={handleAddToCart} className="blackButton">
                                Add to Cart
                            </button>
                        )}
                    </div>
                    {/* Money-back guarantee */}
                    <div>
                        <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
                            30-Day Money-Back Guarantee
                        </p>
                    </div>

                    <div className={``}>
                        <p className={`my-2 text-x1 font-semibold`}>
                            This Course Includes:
                        </p>
                        {/* List of course instructions */}
                        <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
                            {course?.instruction?.map((item, i) => {
                                return (
                                    <p className={`flex gap-2`} key={i}>
                                        <BsFillCareRightFill />
                                        <span>{item}</span>
                                    </p>
                                )
                            })}
                        </div>
                    </div>
                    {/* Share button */}
                    <div className="text-center">
                        <button 
                            className="mx-auto flex items-center gap-2 py-6 text-yellow-100"
                            onClick={handleShare}
                        >
                            <FaShareSquare size={15} /> Share
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseDetailsCard;