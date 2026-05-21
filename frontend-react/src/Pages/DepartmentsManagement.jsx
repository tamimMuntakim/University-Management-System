import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineOfficeBuilding } from 'react-icons/hi';
import Swal from 'sweetalert2';

const DepartmentsManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [newDept, setNewDept] = useState({
        departmentName: '',
        deptCode: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching departments:', error);
            setLoading(false);
        }
    };

    const handleCreateDept = async (e) => {
        e.preventDefault();
        try {
            await api.post('/departments', newDept);
            setIsModalOpen(false);
            setNewDept({ departmentName: '', deptCode: '' });
            fetchDepartments();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Department created successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to create department', 'error');
        }
    };

    const handleEditClick = (dept) => {
        setEditingDept({ ...dept });
        setIsEditModalOpen(true);
    };

    const handleUpdateDept = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/departments/${editingDept.id}`, editingDept);
            setIsEditModalOpen(false);
            setEditingDept(null);
            fetchDepartments();
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Department details have been updated.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to update department', 'error');
        }
    };

    const handleDeleteDept = async (dept) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Deleting "${dept.departmentName}" will affect all associated faculty and students!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/departments/${dept.id}`);
                fetchDepartments();
                Swal.fire('Deleted!', 'Department has been removed.', 'success');
            } catch (error) {
                Swal.fire('Error', 'Failed to delete department. It might be referenced by other records.', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    Department Management
                </h3>
                <button
                    className="btn btn-primary btn-sm flex items-center gap-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    <HiOutlinePlus size={18} />
                    Add New Department
                </button>
            </div>

            <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                    <table className="table table-pin-rows table-zebra">
                        <thead>
                            <tr>
                                <th>Department Name</th>
                                <th className="text-center">Code</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-8 text-base-content/40">No departments found</td>
                                </tr>
                            ) : (
                                departments.map((dept) => (
                                    <tr key={dept.id}>
                                        <td className="font-bold">{dept.departmentName}</td>
                                        <td className="text-center">
                                            <span className="badge badge-neutral badge-sm font-bold">{dept.deptCode}</span>
                                        </td>
                                        <td className="text-center">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    className="btn btn-soft btn-sm btn-success hover:text-white px-2"
                                                    onClick={() => handleEditClick(dept)}
                                                >
                                                    <HiOutlinePencil size={16} />
                                                </button>
                                                <button 
                                                    className="btn btn-soft btn-sm btn-error hover:text-white px-2"
                                                    onClick={() => handleDeleteDept(dept)}
                                                >
                                                    <HiOutlineTrash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {isModalOpen && (
                <div className="modal modal-open backdrop-blur-sm">
                    <div className="modal-box max-w-xl bg-base-100 p-0 overflow-hidden rounded-2xl border border-base-200 shadow-2xl">
                        <div className="bg-primary p-6 text-primary-content">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <HiOutlineOfficeBuilding /> Create New Department
                            </h3>
                            <p className="text-sm opacity-80 mt-1">Register a new academic department into the system catalog.</p>
                        </div>

                        <form onSubmit={handleCreateDept} className="p-6 space-y-4">
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-semibold">Department Name</span></label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="e.g. Computer Science & Engineering"
                                    required
                                    value={newDept.departmentName}
                                    onChange={(e) => setNewDept({ ...newDept, departmentName: e.target.value })}
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-semibold">Department Code</span></label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="e.g. CSE"
                                    required
                                    value={newDept.deptCode}
                                    onChange={(e) => setNewDept({ ...newDept, deptCode: e.target.value })}
                                />
                            </div>
                            <div className="modal-action gap-2 pt-4">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-8">Create Department</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="modal modal-open backdrop-blur-sm">
                    <div className="modal-box max-w-xl bg-base-100 p-0 overflow-hidden rounded-2xl border border-base-200 shadow-2xl">
                        <div className="bg-success p-6 text-success-content">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <HiOutlinePencil /> Edit Department
                            </h3>
                            <p className="text-sm opacity-80 mt-1">Modify the details of an existing academic department.</p>
                        </div>

                        <form onSubmit={handleUpdateDept} className="p-6 space-y-4">
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-semibold">Department Name</span></label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="e.g. Computer Science & Engineering"
                                    required
                                    value={editingDept.departmentName}
                                    onChange={(e) => setEditingDept({ ...editingDept, departmentName: e.target.value })}
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-semibold">Department Code</span></label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="e.g. CSE"
                                    required
                                    value={editingDept.deptCode}
                                    onChange={(e) => setEditingDept({ ...editingDept, deptCode: e.target.value })}
                                />
                            </div>
                            <div className="modal-action gap-2 pt-4">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-success text-white px-8">Update Department</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentsManagement;
