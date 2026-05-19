import { createBrowserRouter, Navigate } from "react-router";
import Login from "../Pages/Login";
import PrivateRoute from "../PrivateRoutes/PrivateRoute";
import { AdminLayout, FacultyLayout, StudentLayout } from "../Layouts/MainLayouts";
import { AdminDashboard, FacultyDashboard, StudentDashboard } from "../Pages/Dashboards";
import UsersManagement from "../Pages/UsersManagement";
import DepartmentsManagement from "../Pages/DepartmentsManagement";
import CoursesManagement from "../Pages/CoursesManagement";

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
        ],
    },
]);

export default router;
