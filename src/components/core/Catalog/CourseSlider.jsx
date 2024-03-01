import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Autoplay, FreeMode, Naviagtion, Pagination } from "swiper";

import Course_Card from "./Course_Card";

// Component for rendering a slider of courses
const CourseSlider = ({ Courses }) => {
    return (
        <>
            {/* Check if there are courses */}
            {Courses?.length ? (
                <Swiper
                    slidesPerView={1}
                    spaceBetween={25}
                    loop={true}
                    modules={[FreeMode, Pagination]}
                    breakpoints={{
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    className="max-h-[30rem]"
                >
                    {/* Map through the courses to create slider items */}
                    {Courses?.map((course, i) => (
                        <SwiperSlide key={i}>
                            {/* Render each course card inside a swiper slide */}
                            <Course_Card course={course} Height={"h-[250px]"} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                // Render a message if no courses are found
                <p className="text-xl text-richblack-5">No Course Found</p>
            )}
        </>
    );
};

export default CourseSlider;