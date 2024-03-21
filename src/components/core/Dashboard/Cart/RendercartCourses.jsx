import { FaStar } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactStars from "react-rating-stars-component";
import { useDispatch, useSelector } from "react-redux";

// Importing Redux action to remove course from cart
import { removeFromCart } from "../../../../slices/cartSlice";

// Component to render individual cart courses
export default function RenderCartCourses() {
    // Selecting cart items from Redux store
    const { cart } = useSelector((state) => state.cart);
    // Redux dispatch hook
    const dispatch = useDispatch();

    // JSX return
    return (
        <div className="flex flex-1 flex-col">
            {/* Mapping through cart items */}
            {cart.map((course, indx) => (
                <div
                    key={course._id} 
                    className={`flex w-full flex-wrap items-start justify-between gap-6 ${
                        indx !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"
                    } ${indx !== 0 && "mt-6"}`}
                >
                    {/* Course details */}
                    <div className="flex flex-1 flex-col gap-4 xl:flex-row">
                        {/* Course thumbnail */}
                        <img 
                            src={course?.thumbnail} 
                            alt={course?.courseName}
                            className="h-148px w-220px rounded-lg object-cover"
                        />
                        <div className="flex flex-col space-y-1">
                            {/* Course name */}
                            <p className="text-lg font-medium text-richblack-5">
                                {course?.courseName}
                            </p>
                            {/* Course category */}
                            <p className="text-sm text-richblack-300">
                                {course?.category?.name}
                            </p>
                            {/* Course ratings */}
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-5">4.5</span>
                                <ReactStars 
                                    count={5}
                                    value={course?.ratingAndReviews?.length}
                                    size={20}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<FaStar />}
                                    fullIcon={<FaStar />}
                                />
                                <span className="text-richblack-400">
                                    {course?.ratingAndReviews?.length} Ratings
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Remove button and course price */}
                    <div className="flex flex-col items-end space-y-2">
                        {/* Remove button */}
                        <button 
                            className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
                            onClick={() => dispatch(removeFromCart(course._id))}
                        >
                            <RiDeleteBin6Line />
                            <span>Remove</span>
                        </button>
                        {/* Course price */}
                        <p className="mb-6 text-3xl font-medium text-yellow-100">
                            ₹ {course?.price}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}