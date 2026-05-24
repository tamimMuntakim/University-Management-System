import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import { 
    HiOutlineUserAdd, 
    HiOutlinePencil, 
    HiOutlineTrash, 
    HiOutlineUsers, 
    HiOutlineSearch,
    HiOutlineUserGroup,
    HiOutlineAcademicCap,
    HiOutlineBriefcase
} from 'react-icons/hi';
import Swal from 'sweetalert2';
import PageLoader from '../Components/PageLoader';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        role: 'ROLE_STUDENT',
        departmentId: ''
    });

    useEffect(() => {
        document.title = "User Management | UniMS";
        fetchUsers();
        fetchDepartments();
    }, []);

    useEffect(() => {
        let result = users;
        
        // Apply role filter
        if (roleFilter !== 'ALL') {
            result = result.filter(u => u.role?.roleName === roleFilter);
        }
        
        // Apply search query (email based)
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(u => u.email?.toLowerCase().includes(query));
        }
        
        setFilteredUsers(result);
    }, [roleFilter, searchQuery, users]);

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

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/signup', newUser);
            setIsModalOpen(false);
            setNewUser({ email: '', password: '', role: 'ROLE_STUDENT', departmentId: '' });
            fetchUsers(); // Refresh the list
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'User created successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to create user', 'error');
        }
    };

    const handleEditClick = (user) => {
        // Find if user has a department from profiles
        let existingDeptId = '';
        if (user.role?.roleName === 'ROLE_STUDENT' && user.studentProfile?.department) {
            existingDeptId = user.studentProfile.department.id;
        } else if (user.role?.roleName === 'ROLE_FACULTY' && user.facultyProfile?.department) {
            existingDeptId = user.facultyProfile.department.id;
        }

        setEditingUser({
            id: user.id,
            email: user.email,
            role: user.role?.roleName || 'ROLE_STUDENT',
            status: user.status || 'ACTIVE',
            departmentId: existingDeptId
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${editingUser.id}`, {
                email: editingUser.email,
                role: { roleName: editingUser.role },
                status: editingUser.status,
                departmentId: editingUser.departmentId
            });
            setIsEditModalOpen(false);
            setEditingUser(null);
            fetchUsers();
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'User information has been updated.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to update user', 'error');
        }
    };

    const handleDeleteUser = async (user) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete user: ${user.email}. This action cannot be reverted!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                await api.delete(`/users/${user.id}`);
                await fetchUsers();
                Swal.fire(
                    'Deleted!',
                    'User has been removed from the system.',
                    'success'
                );
            } catch (error) {
                setLoading(false);
                Swal.fire('Error', 'Failed to delete user', 'error');
            }
        }
    };

    const getRoleLabel = (roleName) => {
        if (!roleName) return 'N/A';
        return roleName.replace('ROLE_', '').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) {
        return <PageLoader message="Fetching users and departments..." />;
    }

    return (
        <div className="space-y-6">
            {/* User Statistics Counter */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-base-100 p-3 rounded-xl border border-base-200 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <HiOutlineUsers size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider">Total</p>
                        <h4 className="text-lg font-black leading-none text-primary">{users.length}</h4>
                    </div>
                </div>
                <div className="bg-base-100 p-3 rounded-xl border border-base-200 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-info/10 text-info rounded-lg">
                        <HiOutlineUsers size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider">Admins</p>
                        <h4 className="text-lg font-black leading-none text-info">{users.filter(u => u.role?.roleName === 'ROLE_ADMIN').length}</h4>
                    </div>
                </div>
                <div className="bg-base-100 p-3 rounded-xl border border-base-200 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-accent/10 text-accent rounded-lg">
                        <HiOutlineAcademicCap size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider">Faculty</p>
                        <h4 className="text-lg font-black leading-none text-accent">{users.filter(u => u.role?.roleName === 'ROLE_FACULTY').length}</h4>
                    </div>
                </div>
                <div className="bg-base-100 p-3 rounded-xl border border-base-200 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                        <HiOutlineUserGroup size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider">Students</p>
                        <h4 className="text-lg font-black leading-none text-secondary">{users.filter(u => u.role?.roleName === 'ROLE_STUDENT').length}</h4>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1 w-full">
                    <h3 className="text-xl font-bold text-primary flex items-center gap-2 whitespace-nowrap">
                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                        User Management
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 flex-1">
                        {/* Search Bar */}
                        <div className="relative flex-1 min-w-[200px]">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40">
                                <HiOutlineSearch size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Search by email..."
                                className="input input-bordered input-sm w-full pl-10 h-10 rounded-xl focus:outline-none focus:border-primary"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Role Filter */}
                        <div className="join bg-base-100 border border-base-200 shadow-sm rounded-xl h-10">
                            <div className="join-item px-4 flex items-center bg-base-200/50 border-r border-base-200">
                                <span className="text-xs font-bold uppercase tracking-widest opacity-50">Filter</span>
                            </div>
                            <select 
                                className="select select-ghost select-sm join-item font-semibold focus:outline-none h-full"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="ALL">All Roles</option>
                                <option value="ROLE_ADMIN">Admins</option>
                                <option value="ROLE_FACULTY">Faculty</option>
                                <option value="ROLE_STUDENT">Students</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    className="btn btn-primary btn-sm flex items-center gap-2 h-10 px-4 rounded-xl"
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
                                <th className="w-16 text-center">#</th>
                                <th>User</th>
                                <th className="text-center">Access Level</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-base-content/40">
                                        No users found matching this criteria
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <tr key={user.id}>
                                        <td className="text-center font-mono text-xs opacity-50">{index + 1}</td>
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
                                                <button 
                                                    className="btn btn-soft btn-sm btn-success hover:text-white px-2"
                                                    onClick={() => handleEditClick(user)}
                                                >
                                                    <HiOutlinePencil size={16} />
                                                </button>
                                                <button 
                                                    className="btn btn-soft btn-sm btn-error hover:text-white px-2"
                                                    onClick={() => handleDeleteUser(user)}
                                                >
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
                                    <option value="ROLE_FACULTY">Faculty</option>
                                    <option value="ROLE_ADMIN">Administrator</option>
                                </select>
                            </div>

                            {(newUser.role === 'ROLE_STUDENT' || newUser.role === 'ROLE_FACULTY') && (
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Department</span></label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={newUser.departmentId}
                                        onChange={(e) => setNewUser({ ...newUser, departmentId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="modal-action mt-8 flex gap-3">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-8">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="modal modal-open backdrop-blur-sm">
                    <div className="modal-box max-w-xl bg-base-100 p-0 overflow-hidden rounded-2xl border border-base-200 shadow-2xl">
                        <div className="bg-success p-6 text-success-content">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <HiOutlinePencil /> Edit User Account
                            </h3>
                            <p className="text-sm opacity-80 mt-1">Update account details and access permissions for this user.</p>
                        </div>
                        
                        <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-semibold">Email Address</span></label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full"
                                    placeholder="email@university.edu"
                                    required
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Access Level</span></label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={editingUser.role}
                                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                    >
                                        <option value="ROLE_STUDENT">Student</option>
                                        <option value="ROLE_FACULTY">Faculty</option>
                                        <option value="ROLE_ADMIN">Administrator</option>
                                    </select>
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Account Status</span></label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={editingUser.status}
                                        onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="SUSPENDED">Suspended</option>
                                        <option value="DEACTIVATED">Deactivated</option>
                                    </select>
                                </div>
                            </div>

                            {(editingUser.role === 'ROLE_STUDENT' || editingUser.role === 'ROLE_FACULTY') && (
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Department</span></label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={editingUser.departmentId}
                                        onChange={(e) => setEditingUser({ ...editingUser, departmentId: e.target.value })}
                                    >
                                        <option value="">No Department / Unchanged</option>
                                        {departments.map(dept => (
                                            <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                                        ))}
                                    </select>
                                    <label className="label">
                                        <span className="label-text-alt text-base-content/50">Changing this will update the user's academic profile</span>
                                    </label>
                                </div>
                            )}

                            <div className="modal-action mt-8 flex gap-3">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-success text-white px-8">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
