import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// Importing API functions and Redux actions
import {
    fetchCourseDetails,
    getFullDetailsOfCourse,
} from "../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";

// Component for editing a course
export default function EditCourse() {
    const dispatch = useDispatch(); // Redux dispatch hook
    const { courseId } = useParams(); // Getting course ID from URL params
    const { course } = useSelector((state) => state.course); // Selecting course details from Redux store
    const [loading, setLoading] = useState(false); // State for loading status
    const { token } = useSelector((state) => state.auth); // Selecting authentication token from Redux store

    // Effect hook to fetch course details on component mount
    useEffect(() => {
        ;(async () => {
            setLoading(true); // Setting loading state to true
            const result = await getFullDetailsOfCourse(courseId, token); // Fetching full course details
            if (result?.courseDetails) {
                dispatch(setEditCourse(true)); // Setting edit mode to true
                dispatch(setCourse(result?.courseDetails)); // Setting course details in Redux store
            }
            setLoading(false); // Setting loading state to false
        })();
    }, []);

    // Rendering loading spinner while fetching course details
    if (loading) {
        return (
            <div className="grid flex-1 place-items-center">
                <div className="spinner"></div>
            </div>
        );
    }

    // JSX return
    return (
        <div>
            <h1 className="mb-14 text-3xl font-medium text-richblack-5">
                Edit Course
            </h1>
            <div className="mx-auto max-w-[600px]">
                {course ? (
                    // Rendering steps for editing course
                    <RenderSteps />
                ) : (
                    // Displaying message when course not found
                    <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
                        Course Not Found
                    </p>  
                )}
            </div>
        </div>
    );
}