import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux";

import {
    createSection,
    updateSection,
} from "../../../../../services/operations/courseDetailsAPI";

import {
    setCourse,
    setEditCourse,
    setStep
} from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import NestedView from "./NestedView";

// Component for creating and editing sections within a course
export default function CourseBuilderForm() {
     // React hooks and Redux setup
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useDispatch()

    const { course } = useSelector((state) => state.course)
    const { token } = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false)
    const [editSectionName, setEditSectionName] = useState(null)

    // Function to handle form submission
    const onSubmit = async (data) => {
        setLoading(true)

        let result 

        // Check if editing or creating a section
        if (editSectionName) {
            result = await updateSection(
                {
                    sectionName: data.sectionName,
                    sectionId: editSectionName,
                    courseId: course._id,
                },
                token
            )
        } else {
            result = await createSection(
                {
                    sectionName: data.sectionName,
                    courseId: course._id
                },
                token
            )
        }
        // Update course data after submission
        if (result) {
            dispatchEvent(setCourse(result))
            setEditSectionName(null)
            setValue("sectionName", "")
        }
        setLoading(false)
    }

    // Function to cancel section editing
    const cancelEdit = () => {
        setEditSectionName(null)
        setValue("sectionName", "")
    }

    // Function to handle edit section name change
    const handleChangedEditSectionName = (sectionId, sectionName) => {
        if (editSectionName === sectionId) {
            cancelEdit()
            return
        }
        setEditSectionName(sectionId)
        setValue("sectionName", sectionName)
    }

    // Function to navigate to the next step
    const goToNext = () => {
        if (course.courseContent.length === 0) {
            toast.error("Please add atleast one lecture")
            return
        }
        if (
            course.courseContent.some((section) => section.subSection.length === 0)
        ) {
            toast.error("Please add atleast one lecture in each section")
            return
        }
        dispatch(setStep(3))
    }

    // Function to navigate back
    const goBack = () => {
        dispatch(setStep(1))
        dispatch(setEditCourse(true))
    }

    // JSX content and UI
    return (
        <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="sectionName" className="text-sm text-richblack-5">
                        Section Name <sup className="text-pink-200">*</sup>
                    </label>
                    <input
                        id="sectionName"
                        disabled={loading}
                        placeholder="Add a section to build your course"
                        {...register("sectionName", {required: true })}
                        className="form-style w-full"
                    />
                    {errors.sectionName && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">
                            Section name is required
                        </span>
                    )}
                </div>
                <div className="flex items-end gap-x-4">
                    <IconBtn
                        type="submit"
                        disabled={loading}
                        text={editSectionName ? "Edit Section Name" : "Create Section"}
                        outline={true}
                    >
                        <IoAddCircleOutline size={20} className="text-yellow-50" />
                    </IconBtn>
                    {editSectionName && (
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="text-sm text-richblack-300 underline"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>
            {course.courseContent.length > 0 && (
                <NestedView handleChangedEditSectionName={handleChangedEditSectionName} />
            )}
            <div className="flex justify-end gap-x-3">
                <button
                    onClick={goBack}
                    className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                >
                    Back
                </button>
                <IconBtn disabled={loading} text="Next" onClick={goText}>
                    <MdNavigateNext />
                </IconBtn>
            </div>
        </div>
    )
}