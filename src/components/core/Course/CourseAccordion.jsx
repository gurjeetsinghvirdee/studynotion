import { useEffect, useRef, useState } from "react"; // Importing necessary hooks from React
import { AiOutlineDown } from "react-icons/ai"; // Importing the AiOutlineDown icon from react-icons
import CourseSubSectionAccordion from "./CourseSubSectionAccordion"; // Importing the CourseSubSectionAccordion component

export default function CourseAccordionBar({ course, isActive, handleActive }) {
    // useRef hook to access DOM element
    const contentEl = useRef(null);

    // useState hook to manage the active state of the accordion
    const [active, setActive] = useState(false);

    // useEffect hook to update active state when isActive prop changes
    useEffect(() => {
        setActive(isActive?.includes(course._id));
    }, [isActive]);

    // useState hook to manage the height of the section
    const [sectionHeight, setSectionHeight] = useState(0);

    // useEffect hook to update section height when active state changes
    useEffect(() => {
        setSectionHeight(active ? contentEl.current.scrollHeight : 0);
    }, [active]);

    return (
        <div className="overflow-hidden border border-solid border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0">
            <div>
                <div
                    // Click event handler to toggle active state
                    className={`flex cursor-pointer items-start justify-between bg-opacity-20 px-7 py-6 transition-[0.3s]`}
                    onClick={() => {
                        handleActive(course._id);
                    }}
                >
                    <div className="flex items-center gap-2">
                        <i
                            // Conditional class based on active state
                            className={
                                isActive.includes(course._id) ? "rotate-180" : "rotate-0"
                            }
                        >
                            <AiOutlineDown />
                        </i>
                        <p>{course?.sectionName}</p>
                    </div>
                    <div className="space-x-4">
                        <span className="text-yellow-25">
                            {`${course.subSection.length || 0} lecture(s)`}
                        </span>
                    </div>
                </div>
            </div>
            <div
                // Ref to access the content element
                ref={contentEl}
                // Dynamic classes and styles based on active state
                className={`relative h-0 overflow-hidden bg-richblack-900 transition-[height] duration-[0.35s] ease-[ease]`}
                style={{
                    height: sectionHeight,
                }}
            >
                <div className="text-textHead flex flex-col gap-2 px-7 py-6 font-semibold">
                    {/* Mapping through subSection and rendering CourseSubSectionAccordion */}
                    {course?.subSection?.map((subSec, i) => {
                        return <CourseSubSectionAccordion subSec={subSec} key={i} />;
                    })}
                </div>
            </div>
        </div>
    );
}