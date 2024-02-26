/**
 * Axios instance for making HTTP requests.
 */
import axios from "axios";
export const axiosInstance = axios.create({});

/**
 * Function to connect to an API endpoint using Axios.
 * @param {string} method - HTTP method (e.g., GET, POST, PUT, DELETE).
 * @param {string} url - API endpoint URL.
 * @param {object} bodyData - Data to be sent in the request body.
 * @param {object} headers - Headers to be included in the request.
 * @param {object} params - URL parameters for the request.
 * @returns {Promise} - A Promise containing the result of the API call.
 */
export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    });
}