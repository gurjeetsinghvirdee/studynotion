import { useState } from 'react'; // Importing useState hook from React for managing component state
import { AiFillCaretDown } from 'react-icons/ai'; // Importing caret down icon from react-icons
import { FaPlus } from 'react-icons/fa'; // Importing plus icon from react-icons
import { MdEdit } from 'react-icons/md'; // Importing edit icon from react-icons
import { RiDeleteBin6Line } from 'react-icons/ri'; // Importing delete bin icon from react-icons
import { RxDropdownMenu } from 'react-icons/rx'; // Importing dropdown menu icon from react-icons
import { useDispatch, useSelector } from 'react-redux'; // Importing useDispatch and useSelector hooks from react-redux for managing state

import { // Importing API functions for deleting sections and subsections
    deleteSection,
    deleteSubSection 
} from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice'; // Importing Redux action for updating course data
import ConfirmationModal from '../../../../common/ConfirmationModal'; // Importing ConfirmationModal component
import SubSectionModal from './SubSectionModal'; // Importing SubSectionModal component

export default function NestedView({ handleChangedEditSectionName }) {
    const { course } = useSelector((state) => state.course); // Extracting course data from Redux store
    const { token } = useSelector((state) => state.auth); // Extracting authentication token from Redux store
    const dispatch = useDispatch(); // Initializing useDispatch hook to dispatch actions

    const [addSubSection, setAddSubSection] = useState(null); // State variable for managing adding subsections
    const [viewSubSection, setViewSubSection] = useState(null); // State variable for managing viewing subsections
    const [editSubSection, setEditSubSection] = useState(null); // State variable for managing editing subsections

    const [confirmationModal, setConfirmationModal] = useState(null); // State variable for managing confirmation modal for deleting sections/subsections

    // Handler function for deleting a section
    const handleDeleteSection = async (sectionId) => {
        const result = await deleteSection({ // Calling API function to delete the section
            sectionId,
            courseId: course._id,
            token,
        });
        if (result) { // If deletion is successful, update the course data in Redux store
            dispatch(setCourse(result));
        }
        setConfirmationModal(null); // Close the confirmation modal
    };

    // Handler function for deleting a subsection
    const handleDeleteSubSection = async (subSectionId, sectionId) => {
        const result = await deleteSubSection({ // Calling API function to delete the subsection
            subSectionId,
            sectionId,
            token,
        });
        if (result) { // If deletion is successful, update the course data in Redux store
            const updatedCourseContent = course.courseContent.map((section) => 
                section._id === sectionId ? result : section
            );
            const updatedCourse = { ...course, courseContent: updatedCourseContent };
            dispatch(setCourse(updatedCourse));
        }
        setConfirmationModal(null); // Close the confirmation modal
    };
}