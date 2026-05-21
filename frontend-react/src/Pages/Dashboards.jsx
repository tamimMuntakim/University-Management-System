import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import { 
    HiOutlineUsers, 
    HiOutlineAcademicCap, 
    HiOutlineUserGroup, 
    HiOutlineOfficeBuilding, 
    HiOutlineBookOpen,
    HiOutlineCheckCircle,
    HiOutlineSparkles,
    HiOutlineHashtag,
    HiOutlineChartBar,
    HiOutlineDocumentText,
    HiOutlineClipboardList
} from 'react-icons/hi';

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
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                Admin Overview
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <div className="stat-figure text-primary opacity-30">
                        <HiOutlineUsers size={40} />
                    </div>
                    <div className="stat-title text-base-content/60 font-medium whitespace-nowrap">Total Users</div>
                    <div className="stat-value text-primary leading-tight text-3xl">
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.totalUsers.toLocaleString()}
                    </div>
                    <div className="stat-desc mt-1">System accounts</div>
                </div>

                <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <div className="stat-figure text-secondary opacity-30">
                        <HiOutlineUserGroup size={40} />
                    </div>
                    <div className="stat-title text-base-content/60 font-medium whitespace-nowrap">Total Students</div>
                    <div className="stat-value text-secondary leading-tight text-3xl">
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.totalStudents.toLocaleString()}
                    </div>
                    <div className="stat-desc mt-1">Registered profiles</div>
                </div>
                
                <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <div className="stat-figure text-accent opacity-30">
                        <HiOutlineAcademicCap size={40} />
                    </div>
                    <div className="stat-title text-base-content/60 font-medium whitespace-nowrap">Total Faculty</div>
                    <div className="stat-value text-accent leading-tight text-3xl">
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.totalFaculty.toLocaleString()}
                    </div>
                    <div className="stat-desc mt-1">Verified educators</div>
                </div>

                <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <div className="stat-figure text-purple-600 opacity-30">
                        <HiOutlineOfficeBuilding size={40} />
                    </div>
                    <div className="stat-title text-base-content/60 font-medium whitespace-nowrap">Departments</div>
                    <div className="stat-value text-purple-600 leading-tight text-3xl">
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.totalDepartments.toLocaleString()}
                    </div>
                    <div className="stat-desc mt-1">Academic units</div>
                </div>

                <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <div className="stat-figure text-info opacity-30">
                        <HiOutlineBookOpen size={40} />
                    </div>
                    <div className="stat-title text-base-content/60 font-medium whitespace-nowrap">Course Catalog</div>
                    <div className="stat-value text-info leading-tight text-3xl">
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.totalCourses.toLocaleString()}
                    </div>
                    <div className="stat-desc mt-1">Courses in system</div>
                </div>

                <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <div className="stat-figure text-orange-500 opacity-30">
                        <HiOutlineSparkles size={40} />
                    </div>
                    <div className="stat-title text-base-content/60 font-medium whitespace-nowrap">Active Offerings</div>
                    <div className="stat-value text-orange-500 leading-tight text-3xl">
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : (stats.totalOfferings || 0).toLocaleString()}
                    </div>
                    <div className="stat-desc mt-1">Currently offered</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-100 border border-base-200 shadow-sm p-6">
                    <h4 className="card-title text-base-content/80 mb-4">Recent System Activity</h4>
                    <div className="divider my-0"></div>
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                                <HiOutlineCheckCircle size={24} />
                            </div>
                            <div>
                                <p className="font-semibold">System Online</p>
                                <p className="text-sm text-base-content/60">Real-time statistics are now active.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const FacultyDashboard = () => (
    <div>
        <h3 className="text-xl font-semibold mb-4 text-primary">Faculty Portal</h3>
        <p className="text-base-content/70">Welcome to your academic dashboard. Manage your courses and grades here.</p>
    </div>
);

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
        const fetchStats = async () => {
            try {
                const response = await api.get('/student/stats');
                setStats(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching student stats:", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                Student Dashboard
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* CGPA Stat */}
                <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md text-center lg:text-left">
                    <div className="stat-figure text-primary opacity-30">
                        <HiOutlineChartBar size={40} />
                    </div>
                    <div className="stat-title text-base-content/60 font-medium whitespace-nowrap text-center">Current CGPA</div>
                    <div className="stat-value text-primary leading-tight text-3xl text-center">
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.cgpa.toFixed(2)}
                    </div>
                    <div className="stat-desc mt-1 text-center">Academic Standing</div>
                </div>

                {/* Credits Completed */}
                <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md text-center lg:text-left">
                    <div className="stat-figure text-secondary opacity-30">
                        <HiOutlineClipboardList size={40} />
                    </div>
                    <div className="stat-title text-base-content/60 font-medium whitespace-nowrap text-center">Credits Completed</div>
                    <div className="stat-value text-secondary leading-tight text-3xl text-center">
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.creditsCompleted}
                    </div>
                    <div className="stat-desc mt-1 text-center">Towards Graduation</div>
                </div>

                {/* Total Enrollments */}
                <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md text-center lg:text-left">
                    <div className="stat-figure text-accent opacity-30">
                        <HiOutlineBookOpen size={40} />
                    </div>
                    <div className="stat-title text-base-content/60 font-medium whitespace-nowrap text-center">Total Enrollments</div>
                    <div className="stat-value text-accent leading-tight text-3xl text-center">
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.totalEnrollments}
                    </div>
                    <div className="stat-desc mt-1 text-center">Courses registered</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Student Info Card */}
                <div className="card bg-base-100 border border-base-200 shadow-sm p-6">
                    <h4 className="card-title text-base-content/80 mb-4 flex items-center gap-2">
                        <HiOutlineHashtag className="text-primary" /> Student Information
                    </h4>
                    <div className="divider my-0"></div>
                    <div className="space-y-4 pt-4">
                        <div className="flex justify-between items-center py-2 border-b border-base-100">
                            <span className="text-base-content/60">Registration ID</span>
                            <span className="font-semibold text-primary">{loading ? "..." : stats.regId}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-base-100">
                            <span className="text-base-content/60">Department</span>
                            <span className="font-semibold text-primary">{loading ? "..." : stats.department}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-base-100">
                            <span className="text-base-content/60">Current Status</span>
                            <span className={`badge badge-ghost font-bold ${stats.status === 'ACTIVE' ? 'text-success' : 'text-warning'}`}>
                                {loading ? "..." : stats.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Links / Announcement Placeholder */}
                <div className="card bg-base-100 border border-base-200 shadow-sm p-6 overflow-hidden relative">
                    <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
                    <h4 className="card-title text-base-content/80 mb-4">Academic Notice Board</h4>
                    <div className="divider my-0"></div>
                    <div className="space-y-4 pt-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center text-info">
                                <HiOutlineDocumentText size={24} />
                            </div>
                            <div>
                                <p className="font-semibold">Semester Schedule</p>
                                <p className="text-sm text-base-content/60">Check the latest exam and class schedule.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                                <HiOutlineSparkles size={24} />
                            </div>
                            <div>
                                <p className="font-semibold">Events & Clubs</p>
                                <p className="text-sm text-base-content/60">Join upcoming university events.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
