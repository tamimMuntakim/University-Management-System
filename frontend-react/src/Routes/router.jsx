import { createBrowserRouter, Navigate } from "react-router";
import Login from "../Pages/Login";
import PrivateRoute from "../PrivateRoutes/PrivateRoute";
import { AdminLayout, FacultyLayout, StudentLayout } from "../Layouts/MainLayouts";
import { AdminDashboard, FacultyDashboard, StudentDashboard } from "../Pages/Dashboards";
import UsersManagement from "../Pages/UsersManagement";
import DepartmentsManagement from "../Pages/DepartmentsManagement";
import CoursesManagement from "../Pages/CoursesManagement";
import CourseOfferingsManagement from "../Pages/CourseOfferingsManagement";
import StudentProfile from "../Pages/StudentProfile";
import Enrollment from "../Pages/Enrollment";
import Grades from "../Pages/Grades";
import FacultyCourses from "../Pages/FacultyCourses";
import FacultyProfile from "../Pages/FacultyProfile";
import Analytics from "../Pages/Analytics";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/admin",
        element: (
            <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                <AdminLayout />
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                element: <AdminDashboard />,
            },
            {
                path: "users",
                element: <UsersManagement />,
            },
            {
                path: "departments",
                element: <DepartmentsManagement />,
            },
            {
                path: "courses",
                element: <CoursesManagement />,
            },
            {
                path: "offerings",
                element: <CourseOfferingsManagement />,
            },
            {
                path: "analytics",
                element: <Analytics />,
            },
        ],
    },
    {
        path: "/faculty",
        element: (
            <PrivateRoute allowedRoles={["ROLE_FACULTY"]}>
                <FacultyLayout />
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                element: <FacultyDashboard />,
            },
            {
                path: "courses",
                element: <FacultyCourses />,
            },
            {
                path: "profile",
                element: <FacultyProfile />,
            },
        ],
    },
    {
        path: "/student",
        element: (
            <PrivateRoute allowedRoles={["ROLE_STUDENT"]}>
                <StudentLayout />
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                element: <StudentDashboard />,
            },
            {
                path: "profile",
                element: <StudentProfile />,
            },
            {
                path: "enrollment",
                element: <Enrollment />,
            },
            {
                path: "grades",
                element: <Grades />,
            },
        ],
    },
]);

export default router;
