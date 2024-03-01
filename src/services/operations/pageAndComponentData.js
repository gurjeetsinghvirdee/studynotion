import React from 'react'
import { toast } from "react-hot-toast"
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';

// Function to fetch catalog page data for a specific category
export const getCatalogPageData = async (categoryId) => {
    const toastId = toast.loading("Loading...");
    let result = [];
    try {
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API,
        {categoryId: categoryId,});

        if (!response?.data?.success)
            throw new Error("Could not Fetch Category page data");

         result = response?.data;

    } catch (error) {
        // Log error for debugging
        console.log("CATALOG PAGE DATA API ERROR....", error);
        // Notify user of error
        toast.error(error.message);
        // Set result to error response
        result = error.response?.data;
    }
    // Dismiss loading toast
    toast.dismiss(toastId);
    return result;
}