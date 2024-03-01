import React, { useEffect, useState } from 'react';
import RatingStars from "../../common/RatingStars";
import GetAvgRating from "../../../utils/avgRating";
import { Link } from 'react-router-dom';

// Component for rendering a course card
const Course_Card = ({ course, Height }) => {
    const [avgReviewCount, setAvgReviewCount] = useState(0);

    // Calculate average rating count when the course or its rating changes
    useEffect(() => {
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    }, [course]);

    return (
        <>
            {/* Link to the course details page */}
            <Link to={`/courses/${course._id}`}>
                <div className="">
                    <div className="rounded-lg">
                        {/* Course thumbnail */}
                        <img 
                            src={course?.thumbnail} 
                            alt="course thumbnail" 
                            className={`${Height} w-full rounded-xl object-cover`}
                        />
                    </div>
                    <div className="flex flex-col gap-2 px-1 py-3">
                        {/* Course title */}
                        <p className="text-xl text-richblack-5">{course?.courseName}</p>
                        {/* Instructor name */}
                        <p className="text-sm text-richblack-50">
                            {course?.instructor?.firstName} {course?.instructor?.lastName}
                        </p>
                        {/* Course ratings */}
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-5">{avgReviewCount || 0}</span>
                            <RatingStars Review_Count={avgReviewCount} />
                            <span className="text-richblack-400">
                                {course?.ratingAndReviews?.length} Ratings
                            </span>
                        </div>
                        {/* Course price */}
                        <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default Course_Card;