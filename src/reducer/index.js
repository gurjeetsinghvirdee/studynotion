// Importing combineReducers function from Redux Toolkit
import { combineReducers } from "@reduxjs/toolkit";

// Importing reducers from respective slice files
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlice";
import courseReducer from "../slices/courseSlice";
import viewCourseReducer from "../slices/viewCourseSlice";

// Combining all reducers into a single rootReducer
const rootReducer = combineReducers({
    auth: authReducer, // Reducer for authentication state
    profile: profileReducer, // Reducer for user profile state
    cart: cartReducer, // Reducer for shopping cart state
    course: courseReducer, // Reducer for course-related state
    viewCourse: viewCourseReducer, // Reducer for viewing a specific course state
})

// Exporting the rootReducer
export default rootReducer;