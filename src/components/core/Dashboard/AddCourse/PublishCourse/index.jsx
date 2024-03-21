import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";
import { resetCourseState } from "../../../../../slices/courseSlice";
import { setStep } from "../../../../../slices/courseCreationSlice"; // Assuming setStep is from courseCreationSlice
import { COURSE_STATUS } from "../../../../../utils/constant";
import { IconBtn } from "../../../../common/IconBtn";

// Component for publishing a course
export default function PublishCourse() {
    const { register, handleSubmit, setValue, getValues } = useForm();
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const { course } = useSelector((state) => state.courses);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Set the value of the "public" field if course status is published
        if (course?.status === COURSE_STATUS.PUBLISHED) {
            setValue("public", true);
        }
    }, [course?.status, setValue]);

    // Navigate to previous step in course creation
    const goBack = () => {
        dispatch(setStep(2));
    };

    // Navigate to the list of courses after resetting course state
    const goToCourses = () => {
        dispatch(resetCourseState());
        navigate("/dashboard/my-courses");
    };
}
