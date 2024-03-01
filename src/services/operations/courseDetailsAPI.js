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

// Function to add course details
export const addCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    // Log response for debugging
    console.log("CREATE COURSE API RESPONSE.........", response);
    if (!response?.data?.success) {
      throw new Error("Could not add course details")
    }
    // Notify user on success
    toast.success("Course details added successfully")
    result = response?.data?.data
  } catch (error) {
    // Log error for debugging
    console.log("CREATE COURSE API ERROR...........", error);
    // Notify user of error
    toast.error(error.message)
  }
  // Dismiss loading toast
  toast.dismiss(toastId)
  return result
}

// Function to edit course details
export const editCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    // Log response for debugging
    console.log("EDIT COURSE API RESPONSE.......", response);
    if (!response?.data?.success) {
      throw new Error("Could not update course details")
    }
    // Notify user on success
    toast.success("Course details updated successfully")
    result = response?.data?.data
  } catch (error) {
    // Log error for debugging
    console.log("EDIT COURSE API ERROR..........", error);
    // Notify user of error
    toast.error(error.message)
  }
  // Dismiss loading toast
  toast.dismiss(toastId)
  return result
}

// Function to create course section
export const createSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading......")
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`
    })
    // Log response for debugging
    console.log("CREATE SECTION API RESPONSE..........", response);
    if (!response?.data?.success) {
      throw new Error("Could not create section")
    }
    // Notify user on success
    toast.success("Course section created")
    result = response?.data?.updatedCourse
  } catch (error) {
    // Log error for debugging
    console.log("CREATE SECTION API ERROR.........", error);
    // Notify user of error
    toast.error(error.message)
  }
  // Dismiss loading toast
  toast.dismiss(toastId)
  return result
}

// Function to create a subsection
export const createSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // Log response for debugging
    console.log("CREATE SUB-SECTION API RESPONSE.........", response)
    if (!response?.data?.success) {
      throw new Error("Could not add lecture")
    }
    // Notify user on success
    toast.success("Lecture Added")
    result = response?.data?.data
  } catch (error) {
    // Log error for debugging
    console.log("CREATE SUB-SECTION API ERROR.......", error);
    // Notify user of error
    toast.error(error.message)
  }
  // Dismiss loading toast
  toast.dismiss(toastId)
  return result
}

// Function to update a section
export const updateSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // Log response for debugging
    console.log("UPDATE SECTION API RESPONSE.........", response);
    if (!response?.data?.success) {
      throw new Error("Could not update section")
    }
    // Notify user on success
    toast.success("Course section updated")
    result = response?.data?.data
  } catch (error) {
    // Log error for debugging
    console.log("UPDATE SECTION API ERROR........", error);
    // Notify user of error
    toast.error(error.message)
  }
  // Dismiss loading toast
  toast.dismiss(toastId)
  return result
}

// Function to update a subsection
export const updateSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // Log response for debugging
    console.log("UPDATE SUB-SECTION API RESPONSE........", response);
    if (!response?.data?.success) {
      throw new Error("Could not update lecture")
    }
    // Notify user on success
    toast.success("Lecture updated")
    result = response?.data?.data
  } catch (error) {
    // Log error for debugging
    console.log("UPDATE SUB-SECTION API ERROR..........", error);
    // Notify user of error
    toast.error(error.message)
  }
  // Dismiss loading toast
  toast.dismiss(toastId)
  return result
}

// Function to delete a section
export const deleteSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading....")
  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // Log response for debugging
    console.log("DELETE SECTION API RESPONSE........", response);
    if (!response?.data?.success) {
      throw new Error("Could not delete section")
    }
    // Notify user on success
    toast.success("Course section deleted")
    result = response?.data?.data
  } catch (error) {
    // Log error for debugging
    console.log("DELETE SECTION API ERROR..........", error);
    // Notify user of error
    toast.error(error.message)
  }
  // Dismiss loading toast
  toast.dismiss(toastId)
  return result
}

// Function to delete a subsection
export const deleteSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // Log response for debugging
    console.log("DELETE SUB-SECTION API RESPONSE...........", response);
    if (!response?.data?.success) {
      throw new Error("Could not delete lecture")
    }
    // Notify user on success
    toast.success("Lecture deleted")
    result = response?.data?.data
  } catch (error) {
    // Log error for debugging
    console.log("DELETE SUB-SECTION API ERROR..........", error);
    // Notify user of error
    toast.error(error.message)
  }
  // Dismiss loading toast
  toast.dismiss(toastId)
  return result
}

// Function to fetch instructor's courses
export const fetchInstructorCourses = async (token) => {
  let result = []
  const toastId = toast.loading("Loading....")
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSE_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    // Log response for debugging
    console.log("INSTRUCTOR COURSES API RESPONSE...............", response);
    if (!response?.data?.success) {
      throw new Error("Could not fetch instructor courses")
    }
    result = response?.data?.data
  } catch (error) {
    // Log error for debugging
    console.log("INSTRUCTOR COURSES API ERROR........", error);
    // Notify user of error
    toast.error(error.message)
  }
  // Dismiss loading toast
  toast.dismiss(toastId)
  return result
}

// Function to delete a course
export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`
    })
    // Log response for debugging
    console.log("DELETE COURSE API RESPONSE..........", response);
    if (!response?.data?.success) {
      throw new Error("Could not delete course")
    }
    // Notify user on success
    toast.success("Course Deleted")
  } catch (error) {
    // Log error for debugging
    console.log("DELETE COURSE API ERROR..........", error);
    // Notify user of error
    toast.error(error.message)
  }
  // Dismiss loading toast
  toast.dismiss(toastId)
}

// Function to get full details of a course
export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...")
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
    // Log response for debugging
    console.log("COURSE_FULL_DETAILS_API API RESPONSE........", response);
    if (!response?.data?.success) {
      throw new Error(response.data.message)
    }
    result = response?.data?.data
  } catch (error) {
    // Log error for debugging
    console.log("COURSE_FULL_DETAILS_API API ERROR.........", error);
    result = error.response.data
  }
  // Dismiss loading toast
  toast.dismiss(toastId)
  return result
}

// Function to mark a lecture as complete
export const markLectureAsComplete = async (data, token) => {
  let result = null
  console.log("mark complete data", data);
  const toastId = toast.loading("Loading....")
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // Log response for debugging
    console.log("MARK_LECTURE_AS_COMPLETE_API API RESPONSE.........", response);
    if (!response?.data?.success) {
      throw new Error(response.data.error)
    }
    // Notify user on success
    toast.success("Lecture completed")
    result = true
  } catch (error) {
    // Log error for debugging
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error);
    // Notify user of error
    toast.error(error.message)
    result = false
  }
  // Dismiss loading toast
  toast.dismiss(toastId)
  return result
}

// Function to create a rating
export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...")
  let success = false
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // Log response for debugging
    console.log("CREATE RATING API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could not create rating")
    }
    // Notify user on success
    toast.success("Rating Created")
    success = true
  } catch (error) {
    success = false
    // Log error for debugging
    console.log("CREATE RATING API ERROR................", error);
    // Notify user of error
    toast.error(error.message)
  }
  // Dismiss loading toast
  toast.dismiss(toastId)
  return success
}