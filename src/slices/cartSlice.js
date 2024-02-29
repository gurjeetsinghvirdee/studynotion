// Importing necessary functions and components
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

// Initial state for the cart slice, fetched from localStorage if available
const initialState = {
    cart: localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [],
    total: localStorage.getItem("total")
        ? JSON.parse(localStorage.getItem("total"))
        : 0,
    totalItems: localStorage.getItem("totalItems")
        ? JSON.parse(localStorage.getItem("totalItems"))
        : 0,
}

// Creating a cart slice with reducers for managing the cart state
const cartSlice = createSlice({
    name: "cart", // Name of the slice
    initialState, // Initial state
    reducers: {
        // Reducer for adding a course to the cart
        addToCart: (state, action) => {
            const course = action.payload;
            const index = state.cart.findIndex((item) => item._id === course._id);

            if (index >= 0) {
                toast.error("Course is already in the cart");
                return;
            }

            state.cart.push(course);

            state.totalItems++;
            state.total += course.price;

            localStorage.setItem("cart", JSON.stringify(state.cart));
            localStorage.setItem("total", JSON.stringify(state.total));
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

            toast.success("Course added to the cart");
        },

        // Reducer for removing a course from the cart
        removeFromCart: (state, action) => {
            const courseId = action.payload;
            const index = state.cart.findIndex((item) => item._id === courseId);

            if (index >= 0) {
                state.totalItems--;
                state.total -= state.cart[index].price;
                state.cart.splice(index, 1);

                localStorage.setItem("cart", JSON.stringify(state.cart));
                localStorage.setItem("total", JSON.stringify(state.total));
                localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

                toast.success("Course removed from the cart");
            }
        },

        // Reducer for resetting the cart state
        resetCart: (state) => {
            state.cart = [];
            state.total = 0;
            state.totalItems = 0;

            localStorage.removeItem("cart");
            localStorage.removeItem("total");
            localStorage.removeItem("totalItems");
        },
    },
});

// Exporting actions for adding, removing, and resetting the cart
export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;

// Exporting the reducer function
export default cartSlice.reducer;