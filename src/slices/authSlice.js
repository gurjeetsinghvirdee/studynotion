// Importing necessary functions
import { createSlice } from "@reduxjs/toolkit";

// Initial state for the auth slice, including token fetched from localStorage if available
const initialState = {
    signupData: null, // Data from signup process
    loading: false, // Loading state
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null, // User authentication token
};

// Creating an auth slice with reducers for managing the authentication state
const authSlice = createSlice({
    name: "auth", // Name of the slice
    initialState: initialState, // Initial state
    reducers: {
        // Reducer for setting signup data
        setSignupData(state, value) {
            state.signupData = value.payload;
        },
        // Reducer for setting loading state
        setLoading(state, value) {
            state.loading = value.payload;
        },
        // Reducer for setting authentication token
        setToken(state, value) {
            state.token = value.payload;
        },
    },
});

// Exporting actions for setting signup data, loading state, and authentication token
export const { setSignupData, setLoading, setToken } = authSlice.actions;

// Exporting the reducer function
export default authSlice.reducer;