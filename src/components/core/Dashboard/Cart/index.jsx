import { useSelector } from "react-redux";

// Importing components for rendering cart courses and total amount
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";

// Component for displaying the cart
export default function Cart() {
    // Selecting total and totalItems from cart state using useSelector
    const { total, totalItems } = useSelector((state) => state.cart);

    return (
        <>
            {/* Cart heading */}
            <h1 className="mb-14 text-3xl font-medium text-richblack-5">Cart</h1>
            {/* Displaying the number of courses in cart */}
            <p className="border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400">
                {totalItems} Courses in Cart
            </p>
            {/* Rendering cart courses and total amount */}
            {total > 0 ? (
                <div className="mt-8 flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
                    <RenderCartCourses />
                    <RenderTotalAmount />
                </div>
            ) : (
                // Displaying message when cart is empty
                <p className="mt-14 text-center text-3xl text-richblack-100">
                    Your Cart is empty
                </p>
            )}
        </>
    );
}