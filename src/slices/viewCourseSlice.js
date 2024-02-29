// Importing necessary functions
import { createSlice } from "@reduxjs/toolkit";

// Initial state for the view course slice
const initialState = {
    courseSectionData: [], // Data for course sections
    courseEntireData: [], // Data for entire course
    completedLectures: [], // Array to store completed lectures
    totalNoOfLectures: 0, // Total number of lectures in the course
}

// Creating a view course slice with reducers for managing the view course state
const viewCourseSlice = createSlice({
    name: "viewCourse", // Name of the slice
    initialState, // Initial state
    reducers: {
        // Reducer for setting course section data
        setCourseSectionData: (state, action) => {
            state.courseSectionData = action.payload;
        },
        // Reducer for setting entire course data
        setEntireCourseData: (state, action) => {
            state.courseEntireData = action.payload;
        },
        // Reducer for setting total number of lectures
        setTotalNoOfLectures: (state, action) => {
            state.totalNoOfLectures = action.payload;
        },
        // Reducer for setting completed lectures
        setCompletedLectures: (state, action) => {
            state.completedLectures = action.payload;
        },
        // Reducer for updating completed lectures
        updateCompletedLectures: (state, action) => {
            state.completedLectures = [...state.completedLectures, action.payload];
        },
    },
});

// Exporting actions for setting course section data, entire course data,
// total number of lectures, completed lectures, and updating completed lectures
export const {
    setCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures,
    setCompletedLectures,
    updateCompletedLectures,
} = viewCourseSlice.actions;

// Exporting the reducer function
export default viewCourseSlice.reducer;