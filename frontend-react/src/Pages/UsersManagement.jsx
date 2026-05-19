import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import { HiOutlineUserAdd, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
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
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary">User Management</h3>
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
                            {users.map((user) => (
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
                                        <span className={`badge ${
                                            user.role?.roleName === 'ROLE_ADMIN' ? 'badge-info' : 
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Create New User</h3>
                        <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Email Address</span></label>
                                <input 
                                    type="email" 
                                    className="input input-bordered w-full" 
                                    required
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Password</span></label>
                                <input 
                                    type="password" 
                                    className="input input-bordered w-full" 
                                    required
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Access Level</span></label>
                                <select 
                                    className="select select-bordered w-full"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                >
                                    <option value="ROLE_STUDENT">Student</option>
                                    <option value="ROLE_FACULTY">Faculty</option>
                                    <option value="ROLE_ADMIN">Admin</option>
                                </select>
                            </div>
                            <div className="modal-action">
                                <button type="button" className="btn btn-soft btn-sm" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary btn-sm">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
