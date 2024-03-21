// Importing necessary dependencies
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Importing API services and Redux slices
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";
import { resetCourseState } from "../../../../../slices/courseSlice";
import { setStep } from "../../../../../slices/courseCreationSlice";
import { COURSE_STATUS } from "../../../../../utils/constant";
import { IconBtn } from "../../../../common/IconBtn";

// Component for publishing a course
export default function PublishCourse() {
    // Initializing form control using react-hook-form
    const { register, handleSubmit, setValue, getValues } = useForm();
    
    const dispatch = useDispatch(); // Redux dispatch hook
    const navigate = useNavigate(); // Navigation hook
    const { token } = useSelector((state) => state.auth); // Selecting authentication token from Redux store
    const { course } = useSelector((state) => state.courses); // Selecting course details from Redux store
    const [loading, setLoading] = useState(false); // State for loading status

    // Effect hook to set the value of the "public" field if course status is published
    useEffect(() => {
        if (course?.status === COURSE_STATUS.PUBLISHED) {
            setValue("public", true);
        }
    }, [course?.status, setValue]);

    // Function to navigate to previous step in course creation
    const goBack = () => {
        dispatch(setStep(2));
    };

    // Function to navigate to the list of courses after resetting course state
    const goToCourses = () => {
        dispatch(resetCourseState());
        navigate("/dashboard/my-courses");
    };

    // Function to handle course publishing
    const handleCoursePublish = async () => {
        if (
            (course?.status === COURSE_STATUS.PUBLISHED &&
                getValues("public") === true) ||
            (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
        ) {
            goToCourses();
            return;
        }
        const formData = new FormData();
        formData.append("courseId", course._id);
        const courseStatus = getValues("public")
            ? COURSE_STATUS.PUBLISHED
            : COURSE_STATUS.DRAFT;
        formData.append("status", courseStatus);
        setLoading(true);

        const result = await editCourseDetails(formData, token);
        if (result) {
            goToCourses();
        }
        setLoading(false);
    };

    // Function to handle form submission
    const onSubmit = (data) => {
        handleCoursePublish();
    };

    // JSX return
    return (
        <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            <p className="text-2xl font-semibold text-richblack-5">
                Publish Settings
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* CheckBox */}
                <div className="my-6 mb-8">
                    <label htmlFor="public" className="inline-flex items-center text-lg">
                        <input 
                            type="checkbox"
                            id="public"
                            {...register("public")}
                            className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5" 
                        />
                        <span className="ml-2 text-richblack-400">
                            Make this course as Public
                        </span>
                    </label>
                </div>

                {/* Next Prev Button */}
                <div className="ml-auto flex max-w-max items-center gap-x-4">
                    <button
                        disabled={loading}
                        type="button"
                        onClick={goBack} 
                        className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                    >
                        Back
                    </button>
                    <IconBtn disabled={loading} text="Save Changes" />
                </div>
            </form>
        </div>
    )
}