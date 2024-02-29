// Importing necessary functions
import { createSlice } from "@reduxjs/toolkit";

// Initial state for the course slice
const initialState = {
    step: 1, // Current step in course creation/editing process
    course: null, // Course data
    editCourse: false, // Flag indicating whether editing an existing course
    paymentLoading: false, // Loading state for payment process
}

// Creating a course slice with reducers for managing the course state
const courseSlice = createSlice({
    name: "course", // Name of the slice
    initialState, // Initial state
    reducers: {
        // Reducer for setting current step in course creation/editing process
        setStep: (state, action) => {
            state.step = action.payload;
        },
        // Reducer for setting course data
        setCourse: (state, action) => {
            state.course = action.payload;
        },
        // Reducer for setting editCourse flag
        setEditCourse: (state, action) => {
            state.editCourse = action.payload;
        },
        // Reducer for setting paymentLoading state
        setPaymentLoading: (state, action) => {
            state.paymentLoading = action.payload;
        },
        // Reducer for resetting course state
        resetCourseState: (state) => {
            state.step = 1;
            state.course = null;
            state.editCourse = false;
        },
    },
});

// Exporting actions for setting step, course data, editCourse flag,
// paymentLoading state, and resetting course state
export const {
    setStep,
    setCourse,
    setEditCourse,
    setPaymentLoading,
    resetCourseState,
} = courseSlice.actions;

// Exporting the reducer function
export default courseSlice.reducer;