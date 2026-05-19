import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import { 
    HiOutlineUsers, 
    HiOutlineAcademicCap, 
    HiOutlineUserGroup, 
    HiOutlineOfficeBuilding, 
    HiOutlineBookOpen,
    HiOutlineCheckCircle,
    HiOutlineSparkles
} from 'react-icons/hi';

export const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalFaculty: 0,
        totalDepartments: 0,
        totalCourses: 0
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <div className="stat-figure text-primary opacity-30">
                        <HiOutlineUsers size={40} />
                    </div>
                    <div className="stat-title text-base-content/60 font-medium whitespace-nowrap">Total Users</div>
                    <div className="stat-value text-primary leading-tight">
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.totalUsers.toLocaleString()}
                    </div>
                    <div className="stat-desc mt-1">System accounts</div>
                </div>

                <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <div className="stat-figure text-secondary opacity-30">
                        <HiOutlineUserGroup size={40} />
                    </div>
                    <div className="stat-title text-base-content/60 font-medium whitespace-nowrap">Total Students</div>
                    <div className="stat-value text-secondary leading-tight">
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.totalStudents.toLocaleString()}
                    </div>
                    <div className="stat-desc mt-1">Registered profiles</div>
                </div>
                
                <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <div className="stat-figure text-accent opacity-30">
                        <HiOutlineAcademicCap size={40} />
                    </div>
                    <div className="stat-title text-base-content/60 font-medium whitespace-nowrap">Total Faculty</div>
                    <div className="stat-value text-accent leading-tight">
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.totalFaculty.toLocaleString()}
                    </div>
                    <div className="stat-desc mt-1">Verified educators</div>
                </div>

                <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <div className="stat-figure text-purple-600 opacity-30">
                        <HiOutlineOfficeBuilding size={40} />
                    </div>
                    <div className="stat-title text-base-content/60 font-medium whitespace-nowrap">Departments</div>
                    <div className="stat-value text-purple-600 leading-tight">
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.totalDepartments.toLocaleString()}
                    </div>
                    <div className="stat-desc mt-1">Active faculties</div>
                </div>

                <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                    <div className="stat-figure text-info opacity-30">
                        <HiOutlineBookOpen size={40} />
                    </div>
                    <div className="stat-title text-base-content/60 font-medium whitespace-nowrap">Courses Offered</div>
                    <div className="stat-value text-info leading-tight">
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.totalCourses.toLocaleString()}
                    </div>
                    <div className="stat-desc mt-1">Total catalog</div>
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

export const StudentDashboard = () => (
    <div>
        <h3 className="text-xl font-semibold mb-4 text-primary">Student Portal</h3>
        <p className="text-base-content/70">Welcome back! Check your current enrollments and academic progress.</p>
    </div>
);
