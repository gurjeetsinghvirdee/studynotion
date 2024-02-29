// Importing necessary functions and components
import { toast } from "react-hot-toast";
import { updateCompletedLectures } from "../../slices/viewCourseSlice";
import { apiConnector } from "../apiconnector";
import { courseEndpoints } from "../apis";

// Destructuring API endpoints
const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSES_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSE_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints;

// Function to fetch all courses
export const getAllCourses = async () => {
  const toastId = toast.loading("Loading..."); // Display loading toast
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_COURSES_API);
    if (!response?.data?.success) {
      throw new Error("Could not fetch course categories");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("GET_ALL_COURSE_API API ERROR........", error);
    toast.error(error.message); // Display error toast
  }
  toast.dismiss(toastId); // Dismiss loading toast
  return result;
}

// Function to fetch course details
export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading..."); // Display loading toast
  let result = null;
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    });
    console.log("COURSE_DETAILS-API API RESPONSE...........", response);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data;
  } catch (error) {
    console.log("COURSE_DETAILS_API API ERROR.............", error);
    result = error.response.data;
  }
  toast.dismiss(toastId); // Dismiss loading toast
  return result;
}

// Function to fetch course categories
export const fetchCourseCategories = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);
    console.log("COURSE_CATEGORIES_API API RESPONSE...........", response);
    if (!response?.data?.success) {
      throw new Error("Could not fetch course categories");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("COURSE_CATEGORY_API API ERROR...........", error);
    toast.error(error.message); // Display error toast
  }
  return result;
}
