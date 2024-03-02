import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import "video-react/dist/video-react.css"; // Importing CSS styles for Video-React library
import { useLocation } from 'react-router-dom';
import { BigPlayButton, Player } from 'video-react'; // Importing components from Video-React library

import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI'; // Importing API function
import { updateCompletedLectures } from '../../../slices/viewCourseSlice'; // Importing Redux slice action
import IconBtn from '../../common/IconBtn'; // Importing custom icon button component

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams(); // Getting parameters from URL
  const navigate = useNavigate(); // Navigation hook
  const location = useLocation(); // Location hook
  const playerRef = useRef(null); // Ref for video player
  const dispatch = useDispatch(); // Redux dispatch function
  const { token } = useSelector((state) => state.auth); // Getting token from Redux store
  const {
     courseSectionData, 
     courseEntireData, 
     completedLectures 
    } = useSelector((state) => state.viewCourse); // Getting data from Redux store
    
  const [videoData, setVideoData] = useState([]); // State for video data
  const [previewSource, setPreviewSource] = useState(""); // State for preview image source
  const [videoEnded, setVideoEnded] = useState(false); // State to track if video has ended
  const [loading, setLoading] = useState(false); // State for loading state

  // Effect to fetch video data on component mount or when URL changes
  useEffect(() => {
    ;(async () => {
      if (!courseSectionData.length) return; // Return if course section data is not available
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`); // Redirect if URL parameters are missing
      } else {
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        );
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        );
        setVideoData(filteredVideoData[0]); // Set video data
        setPreviewSource(courseEntireData.thumbnail); // Set preview image source
        setVideoEnded(false); // Reset video ended state
      }
    })();
  }, [courseSectionData, courseEntireData, location.pathname]); // Dependencies for effect

  // Function to check if current video is the first one
  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId);

    if (currentSectionIndx === 0 && currentSubSectionIndx === 0) {
      return true; // Return true if first video
    } else {
      return false; // Otherwise, return false
    }
  }

  // Function to navigate to the next video
  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const noOfSubSections = courseSectionData[
      currentSectionIndx].subSection.length;

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx].subSection.findIndex((data) => data._id === subSectionId);

    if (currentSubSectionIndx !== noOfSubSections - 1) {
      const nextSubSectionId = courseSectionData[currentSectionIndx].subSection[
        currentSubSectionIndx + 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      ); // Navigate to next video within the same section
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id;
      const nextSubSectionId = courseSectionData[currentSectionIndx + 1].subSection[0]._id;
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      ); // Navigate to next section's first video
    }
  }

  // Function to check if current video is the last one
  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const noOfSubSections = courseSectionData[currentSectionIndx].subSection.length;
    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx].subSection.findIndex((data) => data._id === subSectionId);
    
    if (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubSections - 1
    ) {
      return true; // Return true if last video
    } else {
      return false; // Otherwise, return false
    }
  }

  // Function to navigate to the previous video
  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx].subSection.findIndex((data) => data._id === subSectionId);

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId = courseSectionData[currentSectionIndx].subSection[
        currentSubSectionIndx - 1
      ]._id;
      navigate(
      `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      ); // Navigate to previous video within the same section
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx -1]._id;
      const prevSubSectionLength = courseSectionData[currentSectionIndx -1].subSection.length;
      const prevSubSectionId = courseSectionData[currentSectionIndx -1].subSection[
        prevSubSectionLength - 1
      ]._id;
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      ); // Navigate to previous section's last video
    }
  }
}