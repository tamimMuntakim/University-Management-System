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
    HiOutlineLogout,
    HiOutlineCalendar,
    HiOutlineCheckCircle,
    HiOutlineChartBar
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
                    <div className="bg-success/5 border border-success/10 rounded-xl p-2 mb-4 flex items-center justify-between">
                        <div className="flex items-center justify-center gap-2">
                            <div className="relative flex items-center">
                                <HiOutlineCheckCircle className="text-success text-xl" />
                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                                </span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-success leading-none">Portal Status</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-success px-2 py-1 bg-success/20 rounded-full leading-none flex items-center">Active</span>
                    </div>
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
                        <div className="dropdown dropdown-end dropdown-hover">
                            <div tabIndex={0} role="button" className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-10 flex items-center justify-center font-black ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-110 transition-transform">
                                    <span>{(user?.email || 'U')[0].toUpperCase()}</span>
                                </div>
                            </div>
                            <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-64 p-0 shadow-2xl bg-base-100 border border-base-200 mt-2">
                                <div className="card-body p-3">
                                    <h3 className="font-bold text-sm truncate">{user?.email || 'Guest User'}</h3>
                                    <div className="flex gap-2 items-center">
                                        <span className="badge badge-primary badge-sm font-bold uppercase tracking-tighter scale-90 origin-left">{roleTitle}</span>
                                        <span className="badge badge-success badge-sm badge-outline scale-90 origin-left font-semibold">Online</span>
                                    </div>
                                </div>
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
        { path: "/admin/offerings", label: "Offerings", icon: <HiOutlineCalendar /> },
        { path: "/admin/analytics", label: "Analytics", icon: <HiOutlineChartBar /> },
    ];
    return <BaseLayout roleTitle="Admin" menuItems={menus} />;
};

export const FacultyLayout = () => {
    const menus = [
        { path: "/faculty", label: "Dashboard", icon: <HiOutlineViewGrid /> },
        { path: "/faculty/courses", label: "My Courses", icon: <HiOutlineClipboardList /> },
        { path: "/faculty/profile", label: "My Profile", icon: <HiOutlineUserCircle /> },
    ];
    return <BaseLayout roleTitle="Faculty" menuItems={menus} />;
};

export const StudentLayout = () => {
    const menus = [
        { path: "/student", label: "Dashboard", icon: <HiOutlineViewGrid /> },
        { path: "/student/profile", label: "My Profile", icon: <HiOutlineUserCircle /> },
        { path: "/student/enrollment", label: "Enrollment", icon: <HiOutlinePencilAlt /> },
        { path: "/student/grades", label: "My Grades", icon: <HiOutlineStar /> },
    ];
    return <BaseLayout roleTitle="Student" menuItems={menus} />;
};
