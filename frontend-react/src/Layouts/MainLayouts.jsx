import React from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useAuth } from '../Providers/AuthProvider';

const BaseLayout = ({ roleTitle }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-base-200">
            {/* Sidebar */}
            <div className="w-64 bg-primary text-primary-content p-4 shadow-xl">
                <h2 className="text-2xl font-bold mb-8">UniMS - {roleTitle}</h2>
                <nav className="space-y-2">
                    <button className="btn btn-ghost w-full justify-start text-lg">Dashboard</button>
                    <button className="btn btn-ghost w-full justify-start text-lg">Profile</button>
                </nav>
                <div className="absolute bottom-4 w-56">
                    <button onClick={handleLogout} className="btn btn-error w-full">Logout</button>
                </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-base-content">{roleTitle} Dashboard</h1>
                    <div className="badge badge-accent p-4 font-bold">User: {user?.email}</div>
                </header>
                <main className="card bg-base-100 shadow-sm p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export const AdminLayout = () => <BaseLayout roleTitle="Admin" />;
export const FacultyLayout = () => <BaseLayout roleTitle="Faculty" />;
export const StudentLayout = () => <BaseLayout roleTitle="Student" />;
