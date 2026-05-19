import React from 'react';

export const AdminDashboard = () => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full"></span>
            Admin Overview
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                <div className="stat-figure text-primary text-3xl">
                    👥
                </div>
                <div className="stat-title text-base-content/60 font-medium">Total Students</div>
                <div className="stat-value text-primary leading-tight">2,500</div>
                <div className="stat-desc mt-1">400 new this year</div>
            </div>
            
            <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                <div className="stat-figure text-secondary text-3xl">
                    🎓
                </div>
                <div className="stat-title text-base-content/60 font-medium">Total Faculty</div>
                <div className="stat-value text-secondary leading-tight">120</div>
                <div className="stat-desc mt-1">All departments</div>
            </div>

            <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                <div className="stat-figure text-accent text-3xl">
                    🏢
                </div>
                <div className="stat-title text-base-content/60 font-medium">Departments</div>
                <div className="stat-value text-accent leading-tight">12</div>
                <div className="stat-desc mt-1">Active faculties</div>
            </div>

            <div className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
                <div className="stat-figure text-info text-3xl">
                    📚
                </div>
                <div className="stat-title text-base-content/60 font-medium">Courses Offered</div>
                <div className="stat-value text-info leading-tight">45</div>
                <div className="stat-desc mt-1">Current semester</div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card bg-base-100 border border-base-200 shadow-sm p-6">
                <h4 className="card-title text-base-content/80 mb-4">Recent System Activity</h4>
                <div className="divider my-0"></div>
                <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">✓</div>
                        <div>
                            <p className="font-semibold">New Enrollment</p>
                            <p className="text-sm text-base-content/60">Student ID #S23049 enrolled in CSE101</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

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
