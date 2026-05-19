import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

const DepartmentsManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        } catch (error) {
            alert('Failed to create department');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary">Department Management</h3>
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
                                                <button className="btn btn-soft btn-sm btn-success hover:text-white px-2">
                                                    <HiOutlinePencil size={16} />
                                                </button>
                                                <button className="btn btn-soft btn-sm btn-error hover:text-white px-2">
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

            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Create New Department</h3>
                        <form onSubmit={handleCreateDept} className="space-y-4 mt-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Department Name</span></label>
                                <input 
                                    type="text" 
                                    className="input input-bordered w-full" 
                                    required
                                    value={newDept.departmentName}
                                    onChange={(e) => setNewDept({...newDept, departmentName: e.target.value})}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Department Code</span></label>
                                <input 
                                    type="text" 
                                    className="input input-bordered w-full" 
                                    required
                                    value={newDept.deptCode}
                                    onChange={(e) => setNewDept({...newDept, deptCode: e.target.value})}
                                />
                            </div>
                            <div className="modal-action">
                                <button type="button" className="btn btn-soft btn-sm" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary btn-sm">Create Department</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentsManagement;
