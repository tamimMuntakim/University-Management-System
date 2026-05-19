import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router';
import { useAuth } from '../Providers/AuthProvider';
import { 
    HiOutlineViewGrid, 
    HiOutlineUsers, 
    HiOutlineOfficeBuilding, 
    HiOutlineBookOpen, 
    HiOutlineAcademicCap, 
    HiOutlineClipboardList, 
    HiOutlineUserCircle, 
    HiOutlineHome, 
    HiOutlinePencilAlt, 
    HiOutlineStar, 
    HiOutlineLogout 
} from 'react-icons/hi';

const BaseLayout = ({ roleTitle, menuItems }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-base-300">
            {/* Sidebar */}
            <aside className="w-72 bg-base-100 flex flex-col shadow-2xl z-20">
                <div className="p-8 border-b border-base-200">
                    <h2 className="text-2xl font-black text-primary tracking-tighter italic">UniMS</h2>
                    <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest mt-1">{roleTitle} Portal</p>
                </div>
                
                <nav className="flex-1 p-4 overflow-y-auto space-y-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                ${isActive 
                                    ? 'bg-primary text-primary-content shadow-lg shadow-primary/20 font-bold' 
                                    : 'text-base-content/70 hover:bg-base-200 hover:text-primary'}
                            `}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-base-200">
                    <button 
                        onClick={handleLogout} 
                        className="btn btn-error btn-outline w-full flex items-center gap-2 hover:text-white font-bold"
                    >
                        <HiOutlineLogout className="text-xl" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-base-100 flex items-center justify-between px-8 border-b border-base-200">
                    <h1 className="text-xl font-bold text-base-content">{roleTitle} Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-bold">{user?.email}</span>
                            <span className="text-xs text-base-content/50 uppercase">{roleTitle}</span>
                        </div>
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                                <span>{user?.email?.[0].toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export const AdminLayout = () => {
    const menus = [
        { path: "/admin", label: "Dashboard", icon: <HiOutlineViewGrid /> },
        { path: "/admin/users", label: "Users", icon: <HiOutlineUsers /> },
        { path: "/admin/departments", label: "Departments", icon: <HiOutlineOfficeBuilding /> },
        { path: "/admin/courses", label: "Courses", icon: <HiOutlineBookOpen /> },
    ];
    return <BaseLayout roleTitle="Admin" menuItems={menus} />;
};

export const FacultyLayout = () => {
    const menus = [
        { path: "/faculty", label: "Portal", icon: <HiOutlineAcademicCap /> },
        { path: "/faculty/courses", label: "My Courses", icon: <HiOutlineClipboardList /> },
        { path: "/faculty/profile", label: "Profile", icon: <HiOutlineUserCircle /> },
    ];
    return <BaseLayout roleTitle="Faculty" menuItems={menus} />;
};

export const StudentLayout = () => {
    const menus = [
        { path: "/student", label: "Student Home", icon: <HiOutlineHome /> },
        { path: "/student/enrollment", label: "Enrollment", icon: <HiOutlinePencilAlt /> },
        { path: "/student/grades", label: "My Grades", icon: <HiOutlineStar /> },
    ];
    return <BaseLayout roleTitle="Student" menuItems={menus} />;
};
