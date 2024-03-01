import React from "react";
import { HiOutlineVideoCamera } from "react-icons/hi";

/**
 * Component for rendering a subsection of a course as an accordion item.
 * @param {Object} subSec - Subsection object containing title and content.
 * @returns {JSX.Element} - JSX element representing the subsection accordion item.
 */
function CourseSubSectionAccordion({ subSec }) {
    return (
        <div>
            <div className="flex justify-between py-2">
                <div className={`flex items-center gap-2`}>
                    <span>
                        <HiOutlineVideoCamera />
                    </span>
                    <p>{subSec?.title}</p>
                </div>
            </div>
        </div>
    );
}

export default CourseSubSectionAccordion;