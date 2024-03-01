import { toast } from "react-hot-toast";

import { setLoading, setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../apis";
import { logout } from "./authAPI";

const {
    GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
    GET_INSTRUCTOR_DATA_API,
} = profileEndpoints

// Function to get user details
export function getUserDetails(token, navigate) {
    return async (dispatch) => {
        // Show loading toast
        const toastId = toast.loading("Loading...")
        // Set loading state
        dispatch(setLoading(true))
        try {
            // Make API call to get user details
            const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
                Authorization: `Bearer ${token}`
            })
            // Log response for debugging
            console.log("GET_USER_DETAILS API RESPONSE........", response);
            // Check if response is successful
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            // Determine user image URL
            const userImage = response.data.data.userImage
                ? response.data.data.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
            // Update user details in state
            dispatch(setUser({ ...response.data.data, image: userImage }))
        } catch (error) {
            // Log error for debugging
            console.log("GET_USER_DETAILS API ERROR...........", error);
            // Logout user and navigate to specified location
            dispatch(logout(navigate))
            // Notify user of error
            toast.error("Could not get user details")
        }
        // Dismiss loading toast
        toast.dismiss(toastId)
        // Set loading state
        dispatch(setLoading(false))
    }
}

// Function to get user's enrolled courses
export async function getUserEnrolledCourses(token) {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        // Log before calling backend API
        console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES");
        // Make API call to get enrolled courses
        const response = await apiConnector(
            "GET",
            GET_USER_ENROLLED_COURSES_API,
            null,
            {
                Authorization: `Bearer ${token}`, 
            }
        )
        // Log after calling backend API
        console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES");
        // Check if response is successful
        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        // Set result to enrolled courses
        result = response.data.data
    } catch (error) {
        // Log error for debugging
        console.log("GET_USER_ENROLLED_COURSE_API API ERROR......", error);
        // Notify user of error
        toast.error("Could not get enrolled courses")
    }
    // Dismiss loading toast
    toast.dismiss(toastId)
    return result
}

// Function to get instructor data
export async function getInstructorData(token) {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        // Make API call to get instructor data
        const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
            Authorization: `Bearer ${token}`,
        })
        // Log response for debugging
        console.log("GET_INSTRUCTOR_DATA_API_ API RESPONSE....", response);
        // Set result to instructor's courses
        result = response?.data?.courses
    } catch (error) {
        // Log error for debugging
        console.log("GE_INSTRUCTOR_DATA_API API ERROR.....", error);
        // Notify user of error
        toast.error("Could not get instructor data")
    }
    // Dismiss loading toast
    toast.dismiss(toastId)
    return result
}