import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Importing common component for button
import IconBtn from "../../../common/IconBtn";

// Importing API function for buying courses
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI";

// Component to render total amount and buy button
export default function RenderTotalAmount() {
    // Selecting total amount and cart from cart state
    const { total, cart } = useSelector((state) => state.cart);
    // Selecting authentication token from auth state
    const { token } = useSelector((state) => state.auth);
    // Selecting user information from profile state
    const { user } = useSelector((state) => state.profile);
    // Navigation hook
    const navigate = useNavigate();
    // Redux dispatch hook
    const dispatch = useDispatch();

    // Function to handle buying the course
    const handleBuyCourse = () => {
        // Extracting course IDs from cart
        const courses = cart.map((course) => course._id);
        // Calling API function to buy courses
        buyCourse(token, courses, user, navigate, dispatch);
    };

    // JSX return
    return (
        <div className="min-w-[280px] rounded-md border-[1px] border-rich-black-700 bg-richblack-800 p-6">
            {/* Total amount */}
            <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
            <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
            {/* Buy button */}
            <IconBtn 
                text="Buy Now" // Button text
                onClick={handleBuyCourse} // Click handler
                customClasses="w-full justify-center" // Custom CSS classes for button
            />
        </div>
    );
}