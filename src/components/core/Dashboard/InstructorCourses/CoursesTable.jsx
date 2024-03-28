import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { useNavigate } from "react-router-dom"

import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";

import { formatDate } from "../../../../services/formatDate";
import { 
    deleteCourse,
    fetchInstructorCourses 
} from "../../../../services/operations/courseDetailsAPI";
import { COURSE_STATUS } from "../../../../utils/constant";
import ConfirmationModal from "../../../common/ConfirmationModal";

export default function CoursesTable({ courses, setCourses }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { token } = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false)
    const [confirmationModal, setConfirmationModal] = useState(null)
    const TRUNCATE_LENGTH = 30

    // Function to handle course deletion
    const handleCourseDelete = async (courseId) => {
        setLoading(true)
        await deleteCourse({ courseId: courseId }, token)
        const result = await fetchInstructorCourses(token)
        if (result) {
            setCourses(result)
        }
        setConfirmationModal(null)
        setLoading(false)
    }

    return (
        <>
            {/* Table component for rendering courses */}
            <Table className="rounded-xl border border-richblack-800">
                <Thead>
                    <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
                        <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
                            Courses
                        </Th>
                        <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                            Duration
                        </Th>
                        <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                            Price
                        </Th>
                        <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                            Actions
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {/* Conditional rendering when no courses found */}
                    {courses?.length === 0 ? (
                        <Tr>
                            <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                                No courses found
                            </Td>
                        </Tr>
                    ) : (
                        // Mapping through courses to render each course
                        courses?.map((course) => (
                            <Tr
                                key={course._id} // Corrected key
                                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
                            >
                                <Td className="flex flex-1 gap-x-4">
                                    {/* Display course thumbnail and details */}
                                    <img 
                                        src={course?.thumbnail} 
                                        alt={course?.courseName}
                                        className="h-[148px] w-[220px] rounded-lg object-cover" 
                                    />
                                    <div className="flex flex-col justify-between">
                                        <p className="text-lg font-semibold text-richblack-5">
                                            {course.courseName}
                                        </p>
                                        <p className="text-xs text-richblack-300">
                                            {/* Truncate long descriptions */}
                                            {course.courseDescription.split(" ").length > 
                                            TRUNCATE_LENGTH
                                                ? course.courseDescription
                                                    .split(" ")
                                                    .slice(0, TRUNCATE_LENGTH)
                                                    .join(" ") + "..."
                                                : course.courseDescription}
                                        </p>
                                        <p className="text-[12px] text-white">
                                            Created: {formatDate(course.createdAt)}
                                        </p>
                                        {/* Display course status */}
                                        {course.status === COURSE_STATUS.DRAFT ? (
                                            <p className="flex flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                                                <HiClock size={14} />
                                                Drafted
                                            </p>
                                            
                                        ) : (
                                            <p className="flex flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                                                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                                                    <FaCheck size={8} />
                                                </div>
                                                Published
                                            </p>
                                        )}
                                    </div>
                                </Td>
                                <Td className="text-sm font-medium-text-richblack-100">
                                    12hr 50min
                                </Td>
                                <Td className="text-sm font-medium-text-richblack-100">
                                    ₹{course.price}
                                </Td>
                                <Td className="text-sm font-medium-text-richblack-100">
                                    {/* Button to navigate to edit course page */}
                                    <button
                                        disabled={loading}
                                        onClick={() => {
                                            navigate(`/dashboard/edit-course/${course._id}`)
                                        }}
                                        title="Edit"
                                        className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                                    >
                                        <FiEdit2 size={20} />
                                    </button>
                                    {/* Button to delete course with confirmation */}
                                    <button
                                        disabled={loading}
                                        onClick={() => {
                                            setConfirmationModal({
                                                text1: "Do you want to delete this course!",
                                                text2: "All the data related to this course will be deleted",
                                                btn1Text: !loading ? "Delete" : "Loading... ",
                                                btn2Text: "Cancel",
                                                btn1Handler: !loading
                                                    ? () => handleCourseDelete(course._id)
                                                    : () => {},
                                                btn2Handler: !loading
                                                    ? () => setConfirmationModal(null)
                                                    : () => {},
                                            })
                                        }}
                                        title="Delete"
                                        className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                                    >
                                        <RiDeleteBin6Line size={20} />
                                    </button>
                                </Td>
                            </Tr>
                        ))
                    )}
                </Tbody>
            </Table>
            {/* Render confirmation modal if needed */}
            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </>
    )
}