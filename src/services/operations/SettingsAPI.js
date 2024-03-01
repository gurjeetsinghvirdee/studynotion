import { toast } from "react-hot-toast";

import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { settingsEndpoints } from "../apis";
import { logout } from "./authAPI";

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
} = settingsEndpoints

// Function to update the display picture
export function updateDisplayPicture(token, formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector(
                "PUT",
                UPDATE_DISPLAY_PICTURE_API,
                formData,
                {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            )
            // Log response for debugging
            console.log("UPDATE_DISPLAY_PICTURE_API API RESPONSE.........", response);
            if (!response?.data?.success) {
                throw new Error(response.data.data)
            }
            // Notify user on success
            toast.success("Display picture updated successfully")
            dispatch(setUser(response.data.data))
        } catch (error) {
            // Log error for debugging
            console.log("UPDATE_DISPLAY_PICTURE_API API ERROR........", error);
            // Notify user of error
            toast.error("Could not update display picture")
        }
        // Dismiss loading toast
        toast.dismiss(toastId)
    }
}

// Function to update the user's profile
export function updateProfile(token, formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
                Authorization: `Bearer ${token}`,
            })
            // Log response for debugging
            console.log("UPDATE_PROFILE_API API RESPONSE.........", response);

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            const userImage = response.data.updatedUserDetails.image
                ? response.data.updatedUserDetails.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
            dispatch(
                setUser({ ...response.data.updatedUserDetails, image: userImage })
            )
            // Notify user on success
            toast.success("Profile updated successfully")
        } catch (error) {
            // Log error for debugging
            console.log("UPDATE_PROFILE_API API ERROR..........", error);
            // Notify user of error
            toast.error("Could not update profile")
        }
        // Dismiss loading toast
        toast.dismiss(toastId)
    }
}

// Function to change the user's password
export async function changePassword(token, formData) {
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
            Authorization: `Bearer ${token}`,
        })
        // Log response for debugging
        console.log("CHANGE_PASSWORD_API API RESPONSE......", response);
        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        // Notify user on success
        toast.success("Password changed successfully")
    } catch (error) {
        // Log error for debugging
        console.log("CHANGE_PASSWORD_API API ERROR......", error);
        // Notify user of error
        toast.error(error.response.data.message)
    }
    // Dismiss loading toast
    toast.dismiss(toastId)
}

// Function to delete the user's profile
export function deleteProfile(token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
                Authorization: `Bearer ${token}`,
            })
            // Log response for debugging
            console.log("DELETE_PROFILE_API API RESPONSE......", response);
            if (!response.data.message) {
                throw new Error(response.data.message)
            }
            // Notify user on success
            toast.success("Profile deleted successfully")
            dispatch(logout(navigate))
        } catch (error) {
            // Log error for debugging
            console.log("DELETE_PROFILE_API API ERROR........", error);
            // Notify user of error
            toast.error("Could not delete profile")
        }
        // Dismiss loading toast
        toast.dismiss(toastId)
    }
}