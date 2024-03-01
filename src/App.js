import { Route, Routes, useNavigate } from "react-router-dom"; // Importing necessary components from react-router-dom for routing
import { useDispatch, useSelector } from "react-redux"; // Importing useDispatch and useSelector hooks from react-redux for managing state
import { ACCOUNT_TYPE } from "./utils/constant"; // Importing constant values from the constant file

import "./App.css"; // Importing CSS file for styling
import Home from "./pages/Home"; // Importing Home component
import Navbar from "./components/common/Navbar"; // Importing Navbar component
import OpenRoute from "./components/core/Auth/OpenRoute"; // Importing OpenRoute component for public routes
import Login from "./pages/Login"; // Importing Login component
import Signup from "./pages/Signup"; // Importing Signup component
import ForgotPassword from "./pages/ForgotPassword"; // Importing ForgotPassword component
import UpdatePassword from "./pages/UpdatePassword"; // Importing UpdatePassword component
import VerifyEmail from "./pages/VerifyEmail"; // Importing VerifyEmail component
import About from "./pages/About"; // Importing About component
import Contact from "./pages/Contact"; // Importing Contact component
import MyProfile from "./components/core/Dashboard/MyProfile"; // Importing MyProfile component
import Dashboard from "./pages/Dashboard"; // Importing Dashboard component
import PrivateRoute from "./components/core/Auth/OpenRoute"; // Importing PrivateRoute component for protected routes
import Error from "./pages/Error"; // Importing Error component
import Settings from "./components/core/Dashboard/Settings"; // Importing Settings component
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses"; // Importing EnrolledCourses component
import Cart from "./components/core/Dashboard/Cart"; // Importing Cart component
import AddCourse from "./components/core/Dashboard/AddCourse"; // Importing AddCourse component
import MyCourses from "./components/core/Dashboard/MyCourses"; // Importing MyCourses component
import EditCourse from "./components/core/Dashboard/EditCourse"; // Importing EditCourse component
import Catalog from "./pages/Catalog"; // Importing Catalog component
import CourseDetails from "./pages/CourseDetails"; // Importing CourseDetails component
import ViewCourse from "./pages/ViewCourse"; // Importing ViewCourse component
import VideoDetails from "./components/core/ViewCourse/VideoDetails"; // Importing VideoDetails component
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor"; // Importing Instructor component

function App() {
    const dispatch = useDispatch(); // Initializing useDispatch hook
    const navigate = useNavigate(); // Initializing useNavigate hook for programmatic navigation

    const { user } = useSelector((state) => state.profile); // Fetching user data from Redux store

    return (
        <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter"> {/* Main container with flex layout */}
            <Navbar /> {/* Navbar component for navigation */}
            <Routes> {/* Router setup */}
                <Route path="/" element={<Home />} /> {/* Route for home page */}
                <Route path="catalog/:catalogName" element={<Catalog />} /> {/* Route for catalog page */}
                <Route path="courses/:courseId" element={<CourseDetails />} /> {/* Route for individual course details */}

                {/* Routes for authentication */}
                <Route
                    path="signup"
                    element={
                        <OpenRoute>
                            <Signup />
                        </OpenRoute>
                    }
                />
                <Route 
                    path="login"
                    element={
                        <OpenRoute>
                            <Login />
                        </OpenRoute>
                    }
                />
                <Route 
                    path="forgot-password"
                    element={
                        <OpenRoute>
                            <ForgotPassword />
                        </OpenRoute>
                    }
                />
                <Route 
                    path="verify-email"
                    element={
                        <OpenRoute>
                            <VerifyEmail />
                        </OpenRoute>
                    }
                />
                <Route
                    path="update-password/:id"
                    element={
                        <OpenRoute>
                            <UpdatePassword />
                        </OpenRoute>
                    }
                />

                {/* Routes for static pages */}
                <Route 
                    path="/about"
                    element={
                        <About />
                    }
                />
                <Route path="/contact" element={<Contact />} />

                {/* Routes for dashboard */}
                <Route 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                >
                    <Route path="dashboard/my-profile" element={<MyProfile />} />
                    <Route path="dashboard/Settings" element={<Settings />} />
                    {user?.accountType === ACCOUNT_TYPE.STUDENT && (
                        <>
                            <Route path="dashboard/cart" element={<Cart />} />
                            <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
                        </>
                    )}
                    {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                        <>
                            <Route path="dashboard/instructor" element={<Instructor />} />
                            <Route path="dashboard/add-course" element={<AddCourse />} />
                            <Route path="dashboard/my-courses" element={<MyCourses />} />
                            <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
                        </>
                    )}
                </Route>

                {/* Routes for viewing courses */}
                <Route element={
                    <PrivateRoute>
                        <ViewCourse />
                    </PrivateRoute>
                }>
                    {user?.accountType === ACCOUNT_TYPE.STUDENT && (
                        <>
                            <Route 
                                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                                element={<VideoDetails />} 
                            />
                        </>
                    )}
                </Route>

                <Route path="*" element={<Error />} />  {/* Fallback route for 404 error */}
            </Routes>
        </div>
    );
}

export default App; // Exporting the App component as default