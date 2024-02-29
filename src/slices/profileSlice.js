// Importing necessary functions
import { createSlice } from "@reduxjs/toolkit";

// Initial state for the profile slice, fetched from localStorage if available
const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null, // User data
    loading: false, // Loading state
};

// Creating a profile slice with reducers for managing the profile state
const profileSlice = createSlice({
    name: "profile", // Name of the slice
    initialState: initialState, // Initial state
    reducers: {
        // Reducer for setting user data
        setUser(state, value) {
            state.user = value.payload;
        },
        // Reducer for setting loading state
        setLoading(state, value) {
            state.loading = value.payload;
        },
    },
});

// Exporting actions for setting user data and loading state
export const { setUser, setLoading } = profileSlice.actions;

// Exporting the reducer function
export default profileSlice.reducer;