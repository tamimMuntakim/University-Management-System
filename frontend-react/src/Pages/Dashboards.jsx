import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import PageLoader from '../Components/PageLoader';
import { 
    HiOutlineUsers, 
    HiOutlineAcademicCap, 
    HiOutlineUserGroup, 
    HiOutlineOfficeBuilding, 
    HiOutlineBookOpen,
    HiOutlineSparkles,
    HiOutlineHashtag,
    HiOutlineChartBar,
    HiOutlineDocumentText,
    HiOutlineClipboardList,
    HiOutlineUserCircle,
    HiOutlineStar,
    HiOutlinePencilAlt
} from 'react-icons/hi';
import { NavLink } from 'react-router';

export const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalFaculty: 0,
        totalDepartments: 0,
        totalCourses: 0,
        totalOfferings: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Admin Dashboard | UniMS";
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <PageLoader message="Loading administrative infrastructure..." />;
    }

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-base-content tracking-tighter">
                        Admin <span className="text-primary italic">Control</span>
                    </h2>
                    <p className="text-base-content/80 font-medium mt-1 uppercase tracking-[0.2em] text-[10px]">Infrastructure & Resource Management</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-base-100 rounded-2xl border border-base-300 shadow-md">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-base-content/90">System Operational</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Users */}
                <div className="relative group overflow-hidden bg-base-100 border border-base-300 rounded-[2.5rem] p-8 shadow-lg transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110">
                        <HiOutlineUsers size={80} className="text-primary" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-base-content/90 mb-1">Authenticated Accounts</p>
                    <h3 className="text-5xl font-black text-primary tracking-tighter mb-2 group-hover:scale-105 transition-transform origin-left">
                        {stats.totalUsers.toLocaleString()}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="badge badge-primary badge-sm font-black italic">GLOBAL</span>
                        <span className="text-[10px] font-bold text-base-content/90 uppercase">User Database</span>
                    </div>
                </div>

                {/* Total Students */}
                <div className="relative group overflow-hidden bg-base-100 border border-base-300 rounded-[2.5rem] p-8 shadow-lg transition-all hover:border-secondary/50 hover:shadow-2xl hover:shadow-secondary/20 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110">
                        <HiOutlineUserGroup size={80} className="text-secondary" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-base-content/90 mb-1">Student Body</p>
                    <h3 className="text-5xl font-black text-secondary tracking-tighter mb-2 group-hover:scale-105 transition-transform origin-left">
                        {stats.totalStudents.toLocaleString()}
                    </h3>
                    <div className="text-[10px] font-bold text-base-content/80 uppercase tracking-widest">Enrolled Learners</div>
                </div>

                {/* Total Faculty */}
                <div className="relative group overflow-hidden bg-base-100 border border-base-300 rounded-[2.5rem] p-8 shadow-lg transition-all hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110">
                        <HiOutlineAcademicCap size={80} className="text-accent" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-base-content/90 mb-1">Academic Staff</p>
                    <h3 className="text-5xl font-black text-accent tracking-tighter mb-2 group-hover:scale-105 transition-transform origin-left">
                        {stats.totalFaculty.toLocaleString()}
                    </h3>
                    <div className="text-[10px] font-bold text-base-content/80 uppercase tracking-widest">Educators & Mentors</div>
                </div>

                {/* Departments */}
                <div className="relative group overflow-hidden bg-base-100 border border-base-300 rounded-[3rem] p-8 shadow-lg transition-all hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110">
                        <HiOutlineOfficeBuilding size={80} className="text-purple-600" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-base-content/90 mb-1">Organization</p>
                    <h3 className="text-5xl font-black text-purple-600 tracking-tighter mb-2 group-hover:scale-105 transition-transform origin-left">
                        {stats.totalDepartments}
                    </h3>
                    <div className="text-[10px] font-bold text-base-content/80 uppercase tracking-widest">Academic Units</div>
                </div>

                {/* Course Catalog */}
                <div className="relative group overflow-hidden bg-base-100 border border-base-300 rounded-[3rem] p-8 shadow-lg transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110">
                        <HiOutlineBookOpen size={80} className="text-blue-600" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-base-content/90 mb-1">Curriculum</p>
                    <h3 className="text-5xl font-black text-blue-600 tracking-tighter mb-2 group-hover:scale-105 transition-transform origin-left">
                        {stats.totalCourses}
                    </h3>
                    <div className="text-[10px] font-bold text-base-content/80 uppercase tracking-widest">Courses in Catalog</div>
                </div>

                {/* Active Offerings */}
                <div className="relative group overflow-hidden bg-base-100 border border-base-300 rounded-[3rem] p-8 shadow-lg transition-all hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110">
                        <HiOutlineSparkles size={80} className="text-amber-600" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-base-content/90 mb-1">Operations</p>
                    <h3 className="text-5xl font-black text-amber-600 tracking-tighter mb-2 group-hover:scale-105 transition-transform origin-left">
                        {stats.totalOfferings || 0}
                    </h3>
                    <div className="text-[10px] font-bold text-base-content/80 uppercase tracking-widest">Active Offerings</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main System Card */}
                <div className="lg:col-span-2 bg-base-100 border border-base-300 rounded-[3rem] p-10 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-2xl font-black text-base-content tracking-tighter">Administrative Resources</h4>
                            <p className="text-xs font-medium text-base-content/70 uppercase tracking-widest">Core System Modules</p>
                        </div>
                        <NavLink to="/admin/analytics" className="btn btn-sm btn-ghost bg-primary/5 hover:bg-primary/10 border-none text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                            Full Analytics
                        </NavLink>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <NavLink to="/admin/users" className="p-6 rounded-[2rem] bg-base-200/50 hover:bg-base-100 hover:shadow-2xl hover:shadow-primary/10 transition-all border border-base-300/50 flex items-center gap-6 group/item active:scale-95">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform">
                                <HiOutlineUsers size={28} />
                            </div>
                            <div>
                                <p className="font-black text-base-content tracking-tight group-hover/item:text-primary transition-colors">Manage Accounts</p>
                                <p className="text-xs text-base-content/70 font-bold uppercase tracking-widest">User Directory</p>
                            </div>
                        </NavLink>
                        <NavLink to="/admin/departments" className="p-6 rounded-[2rem] bg-base-200/50 hover:bg-base-100 hover:shadow-2xl hover:shadow-secondary/10 transition-all border border-base-300/50 flex items-center gap-6 group/item active:scale-95">
                            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover/item:scale-110 transition-transform">
                                <HiOutlineOfficeBuilding size={28} />
                            </div>
                            <div>
                                <p className="font-black text-base-content tracking-tight group-hover/item:text-secondary transition-colors">Campus Units</p>
                                <p className="text-xs text-base-content/70 font-bold uppercase tracking-widest">Departments</p>
                            </div>
                        </NavLink>
                    </div>
                </div>

                {/* Promo Card */}
                <div className="bg-primary rounded-[3rem] p-10 text-primary-content shadow-2xl shadow-primary/20 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-125"></div>
                    <div>
                        <HiOutlineSparkles size={40} className="mb-6 opacity-50" />
                        <h4 className="text-2xl font-black leading-tight italic">Empowering<br/>Academic Excellence</h4>
                        <p className="text-primary-content/70 text-sm mt-4 font-medium leading-relaxed">Manage institution infrastructure with real-time intelligence and precision.</p>
                    </div>
                    <button className="btn btn-ghost bg-white/10 hover:bg-white/20 border-none text-[10px] font-black uppercase tracking-widest mt-10 rounded-2xl w-full text-white">
                        System Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};

export const FacultyDashboard = () => {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        designation: 'N/A',
        department: 'N/A'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Faculty Dashboard | UniMS";
        const fetchStats = async () => {
            try {
                const response = await api.get('/faculty/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching faculty stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <PageLoader message="Organizing academic materials..." />;
    }

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-base-content tracking-tighter">
                        Faculty <span className="text-primary italic">Portal</span>
                    </h2>
                    <p className="text-base-content/50 font-medium mt-1 uppercase tracking-[0.2em] text-[10px]">Teaching & Research Insights</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-base-100 rounded-2xl border border-base-300 shadow-md">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-base-content/80">Faculty Session Live</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Courses */}
                <div className="relative group overflow-hidden bg-base-100 border border-base-300 rounded-[2.5rem] p-10 shadow-lg transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110">
                        <HiOutlineBookOpen size={100} className="text-primary" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/70 mb-2">Curriculum Load</p>
                    <h3 className="text-6xl font-black text-primary tracking-tighter mb-2 group-hover:scale-105 transition-transform origin-left">
                        {stats.totalCourses}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="badge badge-primary badge-sm font-black italic">ACTIVE</span>
                        <span className="text-[10px] font-bold text-base-content/80 uppercase">Courses Assigned</span>
                    </div>
                </div>

                {/* Total Students */}
                <div className="relative group overflow-hidden bg-base-100 border border-base-300 rounded-[2.5rem] p-10 shadow-lg transition-all hover:border-secondary/50 hover:shadow-2xl hover:shadow-secondary/20 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110">
                        <HiOutlineUserGroup size={100} className="text-secondary" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/70 mb-2">Student Reach</p>
                    <h3 className="text-6xl font-black text-secondary tracking-tighter mb-2 group-hover:scale-105 transition-transform origin-left">
                        {stats.totalStudents}
                    </h3>
                    <div className="text-[10px] font-bold text-base-content/70 uppercase tracking-widest">Across All Sections</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Faculty Profile Card */}
                <div className="lg:col-span-2 bg-base-100 border border-base-300 rounded-[3rem] p-10 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h4 className="text-2xl font-black text-base-content tracking-tighter">Academic Profile</h4>
                            <p className="text-xs font-medium text-base-content/70 uppercase tracking-widest">Professional Credentials</p>
                        </div>
                        <NavLink to="/faculty/profile" className="btn btn-sm btn-ghost bg-primary/5 hover:bg-primary/10 border-none text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                            View Profile
                        </NavLink>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="bg-base-200/50 p-6 rounded-[2rem] border border-base-300/50 transition-all hover:bg-base-200 shadow-sm">
                            <span className="text-[10px] font-black text-base-content/60 uppercase tracking-[0.3em] block mb-2">Designation</span>
                            <p className="text-xl font-black text-primary tracking-tight">{stats.designation}</p>
                        </div>
                        <div className="bg-base-200/50 p-6 rounded-[2rem] border border-base-300/50 transition-all hover:bg-base-200 shadow-sm">
                            <span className="text-[10px] font-black text-base-content/60 uppercase tracking-[0.3em] block mb-2">Department</span>
                            <p className="text-xl font-black text-base-content/90 tracking-tight">{stats.department}</p>
                        </div>
                        <div className="bg-base-200/50 p-6 rounded-[2rem] border border-base-300/50 transition-all hover:bg-base-200 shadow-sm">
                            <span className="text-[10px] font-black text-base-content/60 uppercase tracking-[0.3em] block mb-2">Office Hours</span>
                            <p className="text-lg font-bold text-secondary">Mon-Fri (2:00PM - 4:00PM)</p>
                        </div>
                        <div className="bg-base-200/50 p-6 rounded-[2rem] border border-base-300/50 flex items-center justify-between transition-all hover:bg-base-200 shadow-sm">
                            <div>
                                <span className="text-[10px] font-black text-base-content/60 uppercase tracking-[0.3em] block mb-1">Status</span>
                                <span className="badge badge-success badge-sm font-black px-3 py-2 rounded-full uppercase tracking-tighter">Verified</span>
                            </div>
                            <HiOutlineAcademicCap size={32} className="opacity-10" />
                        </div>
                    </div>
                </div>

                {/* Research Card */}
                <div className="bg-neutral rounded-[3rem] p-10 text-neutral-content shadow-2xl shadow-neutral/30 transition-all hover:-translate-y-1 hover:shadow-neutral/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <HiOutlineChartBar size={20} className="text-white/60" />
                        </div>
                        <h4 className="text-xl font-black italic">Upcoming<br/>Research</h4>
                    </div>
                    
                    <div>
                        <p className="text-white/60 text-[10px] font-black tracking-widest uppercase mb-4">SYMPOSIUM DEADLINE</p>
                        <p className="text-white/80 text-sm font-medium leading-relaxed">
                            Submit your research proposals for the Annual Academic Symposium by June 20th.
                        </p>
                    </div>

                    <button className="btn btn-outline border-white/20 hover:bg-white hover:text-neutral text-white mt-10 rounded-2xl w-full font-black tracking-widest text-[10px] uppercase transition-all active:scale-95">
                        View Details
                    </button>
                </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NavLink to="/faculty/courses" className="p-6 rounded-[2rem] bg-base-100 border border-base-300/50 shadow-md hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                        <HiOutlineClipboardList size={28} />
                    </div>
                    <div>
                        <p className="font-black text-base-content tracking-tight group-hover:text-primary transition-colors">Course Materials</p>
                        <p className="text-xs text-base-content/70 font-bold uppercase tracking-widest">Management</p>
                    </div>
                </NavLink>
                <NavLink to="/faculty/profile" className="p-6 rounded-[2rem] bg-base-100 border border-base-300/50 shadow-md hover:border-secondary/30 hover:shadow-2xl hover:shadow-secondary/10 transition-all flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:rotate-12 transition-transform">
                        <HiOutlineUserCircle size={28} />
                    </div>
                    <div>
                        <p className="font-black text-base-content tracking-tight group-hover:text-secondary transition-colors">Account Settings</p>
                        <p className="text-xs text-base-content/70 font-bold uppercase tracking-widest">Update Profile</p>
                    </div>
                </NavLink>
            </div>
        </div>
    );
};

export const StudentDashboard = () => {
    const [stats, setStats] = useState({
        cgpa: 0,
        creditsCompleted: 0,
        totalEnrollments: 0,
        status: 'N/A',
        regId: 'N/A',
        department: 'N/A'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Student Dashboard | UniMS";
        const fetchStats = async () => {
            try {
                const response = await api.get('/student/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching student stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <PageLoader message="Generating academic transcript summary..." />;
    }

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-base-content tracking-tighter">
                        Student <span className="text-primary italic">Portal</span>
                    </h2>
                    <p className="text-base-content/50 font-medium mt-1 uppercase tracking-[0.2em] text-[10px]">Academic Overview & Progress</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-base-100 rounded-2xl border border-base-300 shadow-md">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-base-content/80">Session Active</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* CGPA Stat */}
                <div className="relative group overflow-hidden bg-base-100 border border-base-300 rounded-[2.5rem] p-8 shadow-lg transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110">
                        <HiOutlineStar size={80} className="text-primary" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-base-content/70 mb-1">Cumulative Grade</p>
                    <h3 className="text-5xl font-black text-primary tracking-tighter mb-2 group-hover:scale-105 transition-transform origin-left">
                        {stats.cgpa.toFixed(2)}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="badge badge-primary badge-sm font-black italic">TOP 10%</span>
                        <span className="text-[10px] font-bold text-base-content/80 uppercase">CGPA Status</span>
                    </div>
                </div>

                {/* Credits Completed */}
                <div className="relative group overflow-hidden bg-base-100 border border-base-300 rounded-[2.5rem] p-8 shadow-lg transition-all hover:border-secondary/50 hover:shadow-2xl hover:shadow-secondary/20 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110">
                        <HiOutlineClipboardList size={80} className="text-secondary" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-base-content/70 mb-1">Credits Earned</p>
                    <h3 className="text-5xl font-black text-secondary tracking-tighter mb-2 group-hover:scale-105 transition-transform origin-left">
                        {stats.creditsCompleted}
                    </h3>
                    <div className="flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-wider">
                        <span className="w-4 h-[2px] bg-secondary/30"></span> 
                        Progression Path
                    </div>
                </div>

                {/* Total Enrollments */}
                <div className="relative group overflow-hidden bg-base-100 border border-base-300 rounded-[2.5rem] p-8 shadow-lg transition-all hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110">
                        <HiOutlineBookOpen size={80} className="text-accent" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-base-content/70 mb-1">Enrolled Items</p>
                    <h3 className="text-5xl font-black text-accent tracking-tighter mb-2 group-hover:scale-105 transition-transform origin-left">
                        {stats.totalEnrollments}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-[9px] font-black uppercase">Current Sem</span>
                    </div>
                </div>

                {/* Profile Link Card */}
                <div className="bg-primary rounded-[2.5rem] p-8 text-primary-content shadow-xl transition-all hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125"></div>
                    <div>
                        <HiOutlineUserCircle size={32} className="mb-4 opacity-50" />
                        <h4 className="text-xl font-black leading-tight italic">My Profile<br/>& Academic Info</h4>
                    </div>
                    <NavLink to="/student/profile" className="btn btn-sm btn-ghost bg-white/10 hover:bg-white/20 border-none text-[10px] font-black uppercase tracking-widest mt-6 rounded-xl transition-all">
                        Manage Profile
                    </NavLink>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Student Info Deep Card */}
                <div className="lg:col-span-2 bg-base-100 border border-base-300 rounded-[3rem] p-10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-2xl font-black text-base-content tracking-tighter">Academic Status</h4>
                            <p className="text-xs font-medium text-base-content/70 uppercase tracking-widest">Official Record Details</p>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${stats.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                            {stats.status}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-base-200/50 p-6 rounded-[2rem] border border-base-300/50 transition-all hover:bg-base-200 shadow-sm">
                                <span className="text-[10px] font-black text-base-content/50 uppercase tracking-[0.3em] block mb-2">University ID</span>
                                <p className="text-2xl font-black text-primary tracking-tighter">{stats.regId}</p>
                            </div>
                            <div className="bg-base-200/50 p-6 rounded-[2rem] border border-base-300/50 transition-all hover:bg-base-200 shadow-sm">
                                <span className="text-[10px] font-black text-base-content/50 uppercase tracking-[0.3em] block mb-2">Department</span>
                                <p className="text-xl font-black text-base-content/90 tracking-tight">{stats.department}</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:rotate-12 shadow-sm">
                                    <HiOutlinePencilAlt size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-wider text-base-content/80">Quick Action</p>
                                    <NavLink to="/student/enrollment" className="text-sm font-bold text-primary hover:underline">Register for Courses</NavLink>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary transition-transform group-hover:rotate-12 shadow-sm">
                                    <HiOutlineStar size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-wider text-base-content/80">My Progress</p>
                                    <NavLink to="/student/grades" className="text-sm font-bold text-secondary hover:underline">View All Grades</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Announcement Card */}
                <div className="bg-neutral rounded-[3rem] p-10 text-neutral-content shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <HiOutlineSparkles className="animate-pulse" />
                        </div>
                        <h4 className="text-xl font-black italic">Academic<br/>Notices</h4>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="border-l-2 border-white/20 pl-4 py-2 hover:border-primary transition-colors">
                            <h5 className="font-black text-sm text-white">Final Exam Schedule</h5>
                            <p className="text-xs text-white/50 mt-1 font-medium italic">Released yesterday</p>
                        </div>
                        <div className="border-l-2 border-white/20 pl-4 py-2 hover:border-secondary transition-colors">
                            <h5 className="font-black text-sm text-white">Club Recruitment</h5>
                            <p className="text-xs text-white/50 mt-1 font-medium italic">Deadline: June 15th</p>
                        </div>
                        <div className="border-l-2 border-white/20 pl-4 py-2 hover:border-accent transition-colors">
                            <h5 className="font-black text-sm text-white">Course Evaluation</h5>
                            <p className="text-xs text-white/50 mt-1 font-medium italic">Available now</p>
                        </div>
                    </div>

                    <button className="btn btn-outline border-white/10 hover:bg-white hover:text-neutral text-white mt-10 rounded-2xl w-full font-black tracking-widest text-[10px] uppercase">
                        View All Notices
                    </button>
                </div>
            </div>
        </div>
    );
};
