import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import {
    addCourseDetails,
    editCourseDetails,
    fetchCourseDetails
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constant";
import IconBtn from "../../../../common/IconBtn";
import Upload from "../Upload";
import ChipInput from "./ChipInput";
import RequirementsField from "./RequirementFiled";
import { categories } from "../../../../../services/apis";

export default function CourseInformationForm() {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()

    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth)
    const { course, editCourse } = useSelector((state) => state.course)
    const [loading, setLoading] = useState(false)
    const [courseCategories, setCourseCategories] = useState([])

    useEffect(() => {
        const getCategories = async () => {
            if (categories.length > 0) {
                setCourseCategories(categories)
            }
            setLoading(false)
        }

        if (editCourse) {
            setValue("courseTitle", course.courseName)
            setValue("courseShortDesc", course.courseDescription)
            setValue("coursePrice", course.price)
            setValue("courseTag", course.tag)
            setValue("courseBenefits", course.whatYouWillLearn)
            setValue("courseCategory", course.category)
            setValue("courseRequirements", course.instructions)
            setValue("courseImage", course.thumbnail)
        }
        getCategories()
    }, [])

    const isFormUpdated = () => {
        const currentValues = getValues()
        if (
            currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseRequirements.toString() !== course.instructions.toString() ||
            currentValues.courseImage !== course.thumbnail
        ) {
            return true
        }
        return false
    }

    const onSubmit = async (data) => {
        if (editCourse) {
            if (isFormUpdated()) {
                const currentValues = getValues()
                const formData = new FormData()

                formData.append("courseId", course.id)
                if (currentValues.courseTitle !== course.courseName) {
                    formData.append("courseName", data.courseTitle)
                }
                if (currentValues.courseShortDesc !== course.courseDescription) {
                    formData.append("courseDescription", data.courseShortDesc)
                }
                if (currentValues.coursePrice !== course.price) {
                    formData.append("price", data.coursePrice)
                }
                if (currentValues.courseTags.toString() !== course.tag.toString()) {
                    formData.append("tag", JSON.stringify(data.courseTags))
                }
                if (currentValues.courseBenefits !== course.whatYouWillLearn) {
                    formData.append("whatYouWillLearn", data.courseBenefits)
                }
                if (currentValues.courseCategory._id !== course.category._id) {
                    formData.append("category", data.courseCategory)
                }
                if (
                    currentValues.courseRequirements.toString() !== course.instructions.toString()
                ) {
                    formData.append(
                        "instructions",
                        JSON.stringify(data.courseRequirements)
                    )
                }
                if (currentValues.courseImage !== course.thumbnail) {
                    formData.append("thumbnailImage", data.courseImage)
                }

                setLoading(true)

                const result = await editCourseDetails(formData, token)
                setLoading(false)
                if (result) {
                    dispatch(setStep(2))
                    dispatch(setCourse(result))
                }
            } else {
                toast.error("No changes made to the form")
            }
            return
        }
        const formData = new FormData()
        formData.append("courseName", data.courseTitle)
        formData.append("courseDescription", data.courseShortDesc)
        formData.append("price", data.coursePrice)
        formData.append("tag", JSON.stringify(dta.courseTags))
        formData.append("whatYouWillLearn", data.courseBenefits)
        formData.append("category", data.courseCategory)
        formData.append("status", COURSE_STATUS.DRAFT)
        formData.append("instructions", JSON.stringify(data.courseRequirements))
        formData.append("thumbnailImage", data.courseImage)
        setLoading(true)
        
        const result = await addCourseDetails(formData, token)
        if (result) {
            dispatch(setStep(2))
            dispatch(setCourse(result))
        }
        setLoading(false)
    }

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
        >
            <div className="flex flex-col space-y-2">
                <label 
                    htmlFor="courseTitle" 
                    className="text-sm text-richblack-5"
                >
                    Course Title <sup className="text-pink-200">*</sup>
                </label>
                <input 
                    className="form-style w-full" 
                    id="courseTitle"
                    placeholder="Enter Course Title"
                    {...register("courseTitle", { required: true })}
                />
                {errors.courseTitle && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course Title is required
                    </span>
                )}
            </div>
            <div className="flex flex-col space-y-2">
                <label 
                    htmlFor="courseShortDesc" 
                    className="text-sm text-rich-black-5"
                >
                    Course Short Description <sup className="text-pink-200">*</sup>
                </label>
                <textarea 
                    id="courseShortDesc"
                    placeholder="Enter Description"
                    {...register("courseShortDesc", { required: true })} 
                    className="form-style resize-x-none min-h-[130px] w-full"
                />
                {errors.courseShortDesc && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course Description is required
                    </span>
                )}
            </div>
            <div className="flex flex-col space-y-2">
                <label htmlFor="coursePrice" className="text-sm text-richblack-5">
                    Course Price <sup className="text-pink-200">*</sup>
                </label>
                <div className="relative">
                    <input 
                        id="coursePrice" 
                        className="form-style w-full !pl-12"
                        placeholder="Enter Course Price"
                        {...register("coursePrice", { 
                            required: true,
                            valueAsNumber: true,
                            pattern: {
                                value: /^(0|[1-9]\d*)(\.\d+)?$/,
                            } 
                        })} 
                    />
                    <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
                </div>
                {errors.coursePrice && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course Category <sup className="text-pink-200">*</sup>
                    </span>
                )}
            </div>
        </form>
    )
}