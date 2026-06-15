import React from 'react';
import { Outlet, useNavigate, NavLink, Link } from 'react-router';
import { useAuth } from '../Providers/AuthProvider';
import Swal from 'sweetalert2';
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
import ThemeToggle from '../Components/ThemeToggle';

const BaseLayout = ({ roleTitle, menuItems }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will need to login again to access your portal!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                navigate('/login');
                Swal.fire({
                    title: 'Logged Out!',
                    text: 'You have been successfully logged out.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };

    return (
        <div className="flex h-screen bg-base-200">
            {/* Sidebar */}
            <aside className="w-72 bg-base-100 flex flex-col shadow-2xl z-20 border-r border-base-300">
                <div className="p-8 bg-gradient-to-br from-primary/5 to-transparent ">
                    <Link className="flex items-center gap-2" to={`/${roleTitle.toLowerCase()}`}>
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                            <HiOutlineAcademicCap className="text-primary-content text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-primary tracking-tighter leading-none">UniMS</h2>
                            <p className="text-[10px] font-black text-base-content/70 uppercase tracking-[0.2em] mt-1">{roleTitle}</p>
                        </div>
                    </Link>
                </div>
                
                <nav className="flex-1 p-4 overflow-y-auto space-y-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end
                            className={({ isActive }) => `
                                sidebar-link
                                ${isActive 
                                    ? 'bg-primary text-primary-content shadow-lg shadow-primary/25 font-bold scale-[1.02]' 
                                    : 'text-base-content/90 hover:bg-primary/5 hover:text-primary'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`text-xl transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary-content' : 'text-primary/70'}`}>
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-base-300 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-bold text-base-content/70 uppercase tracking-widest">Settings</span>
                        <ThemeToggle />
                    </div>

                    <div className="bg-base-200/50 border border-base-300 rounded-2xl p-3 flex items-center justify-between shadow-inner">
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
                <header className="h-20 bg-base-100 flex items-center justify-between px-8 border-b border-base-300">
                    <h1 className="text-xl font-bold text-base-content">{roleTitle} Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <div className="dropdown dropdown-end dropdown-hover">
                            <div tabIndex={0} role="button" className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-10 flex items-center justify-center font-black ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-110 transition-transform">
                                    <span>{(user?.email || 'U')[0].toUpperCase()}</span>
                                </div>
                            </div>
                            <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-64 p-0 shadow-2xl bg-base-100 border border-base-300 mt-2">
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
