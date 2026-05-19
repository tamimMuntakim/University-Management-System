import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import { HiOutlineUserAdd, HiOutlinePencil, HiOutlineTrash, HiOutlineUsers } from 'react-icons/hi';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        role: 'ROLE_STUDENT'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (roleFilter === 'ALL') {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(users.filter(u => u.role?.roleName === roleFilter));
        }
    }, [roleFilter, users]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/signup', newUser);
            setIsModalOpen(false);
            setNewUser({ email: '', password: '', role: 'ROLE_STUDENT' });
            fetchUsers(); // Refresh the list
        } catch (error) {
            alert('Failed to create user');
        }
    };

    const getRoleLabel = (roleName) => {
        if (!roleName) return 'N/A';
        return roleName.replace('ROLE_', '').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                    <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                        User Management
                    </h3>
                    
                    <div className="join bg-base-100 border border-base-200 shadow-sm rounded-xl">
                        <div className="join-item px-4 flex items-center bg-base-200/50 border-r border-base-200">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-50">Filter</span>
                        </div>
                        <select 
                            className="select select-ghost select-sm join-item font-semibold focus:outline-none"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="ALL">All Users</option>
                            <option value="ROLE_ADMIN">Admins</option>
                            <option value="ROLE_FACULTY">Faculty</option>
                            <option value="ROLE_STUDENT">Students</option>
                        </select>
                    </div>
                </div>

                <button
                    className="btn btn-primary btn-sm flex items-center gap-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    <HiOutlineUserAdd size={18} />
                    Add New User
                </button>
            </div>

            {/* User Table Container */}
            <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                    <table className="table table-pin-rows table-zebra">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th className="text-center">Access Level</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8">
                                        <span className="loading loading-spinner text-primary"></span>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-base-content/40">
                                        No users found matching this criteria
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content rounded-full w-10 flex items-center justify-center font-black">
                                                        <span>{user.email?.[0]?.toUpperCase() || 'U'}</span>
                                                    </div>
                                                </div>
                                                <div className="font-bold">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge ${user.role?.roleName === 'ROLE_ADMIN' ? 'badge-info' :
                                                user.role?.roleName === 'ROLE_FACULTY' ? 'badge-success' : 'badge-neutral'
                                                } badge-sm font-bold text-xs uppercase tracking-wider`}>
                                                {getRoleLabel(user.role?.roleName)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={`badge ${user.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'} badge-outline badge-xs`}>
                                                {user.status || 'ACTIVE'}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <button className="btn btn-soft btn-sm btn-success hover:text-white px-2">
                                                <HiOutlinePencil size={16} />
                                            </button>
                                            <button className="btn btn-soft btn-sm btn-error hover:text-white px-2">
                                                <HiOutlineTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="modal modal-open backdrop-blur-sm">
                    <div className="modal-box max-w-xl bg-base-100 p-0 overflow-hidden rounded-2xl border border-base-200 shadow-2xl">
                        <div className="bg-primary p-6 text-primary-content">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <HiOutlineUsers /> Create New User
                            </h3>
                            <p className="text-sm opacity-80 mt-1">Register a new system account with specific access privileges.</p>
                        </div>
                        
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-semibold">Email Address</span></label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full"
                                    placeholder="email@university.edu"
                                    required
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-semibold">Password</span></label>
                                <input
                                    type="password"
                                    className="input input-bordered w-full"
                                    placeholder="••••••••"
                                    required
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-semibold">Access Level</span></label>
                                <select
                                    className="select select-bordered w-full"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="ROLE_STUDENT">Student</option>
                                    <option value="ROLE_FACULTY">Faculty Member</option>
                                    <option value="ROLE_ADMIN">System Administrator</option>
                                </select>
                            </div>
                            <div className="modal-action gap-2 pt-4">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-8">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
