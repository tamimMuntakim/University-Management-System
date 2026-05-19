import React from 'react';

export const AdminDashboard = () => (
    <div>
        <h3 className="text-xl font-semibold mb-4 text-primary">Admin Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat bg-base-200 rounded-box shadow">
                <div className="stat-title">Total Students</div>
                <div className="stat-value text-secondary">2,500</div>
            </div>
            <div className="stat bg-base-200 rounded-box shadow">
                <div className="stat-title">Total Faculty</div>
                <div className="stat-value text-primary">120</div>
            </div>
            <div className="stat bg-base-200 rounded-box shadow">
                <div className="stat-title">Departments</div>
                <div className="stat-value text-accent">12</div>
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
