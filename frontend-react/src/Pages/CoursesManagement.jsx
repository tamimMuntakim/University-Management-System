import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineBookOpen } from 'react-icons/hi';
import Swal from 'sweetalert2';

const CoursesManagement = () => {
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [newCourse, setNewCourse] = useState({
        courseCode: '',
        courseName: '',
        credits: 3,
        department: { id: '' }
    });

    useEffect(() => {
        document.title = "Course Management | UniMS";
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [coursesRes, deptsRes] = await Promise.all([
                api.get('/courses'),
                api.get('/departments')
            ]);
            setCourses(coursesRes.data);
            setDepartments(deptsRes.data);
            if (deptsRes.data.length > 0) {
                setNewCourse(prev => ({ ...prev, department: { id: deptsRes.data[0].id } }));
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            setCourses(res.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            await api.post('/courses', newCourse);
            setIsModalOpen(false);
            setNewCourse({
                courseCode: '',
                courseName: '',
                credits: 3,
                department: { id: departments[0]?.id || '' }
            });
            fetchCourses();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Course added to curriculum.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to create course', 'error');
        }
    };

    const handleEditClick = (course) => {
        setEditingCourse({
            ...course,
            departmentId: course.department?.id || ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/courses/${editingCourse.id}`, {
                ...editingCourse,
                department: { id: editingCourse.departmentId }
            });
            setIsEditModalOpen(false);
            setEditingCourse(null);
            fetchCourses();
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Course details updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to update course', 'error');
        }
    };

    const handleDeleteCourse = async (course) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Deleting "${course.courseName}" will remove all associated course offerings and student enrollments!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/courses/${course.id}`);
                fetchCourses();
                Swal.fire('Deleted!', 'Course has been removed.', 'success');
            } catch (error) {
                Swal.fire('Error', 'Failed to delete course. It may be referenced by offerings.', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    Course Management
                </h3>
                <button
                    className="btn btn-primary btn-sm flex items-center gap-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    <HiOutlinePlus size={18} />
                    Add New Course
                </button>
            </div>

            <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                    <table className="table table-pin-rows table-zebra">
                        <thead>
                            <tr>
                                <th>Course Details</th>
                                <th className="text-center">Credits</th>
                                <th>Department</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-base-content/40">No courses found</td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.id}>
                                        <td>
                                            <div className="font-bold">{course.courseName}</div>
                                            <div className="text-xs text-base-content/50 uppercase font-mono">{course.courseCode}</div>
                                        </td>
                                        <td className="text-center">
                                            <div className="badge badge-neutral badge-sm font-bold">{course.credits} Credits</div>
                                        </td>
                                        <td>
                                            <span className="text-sm font-medium">{course.department?.departmentName || 'N/A'}</span>
                                        </td>
                                        <td className="text-center">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    className="btn btn-soft btn-sm btn-success hover:text-white px-2"
                                                    onClick={() => handleEditClick(course)}
                                                >
                                                    <HiOutlinePencil size={16} />
                                                </button>
                                                <button 
                                                    className="btn btn-soft btn-sm btn-error hover:text-white px-2"
                                                    onClick={() => handleDeleteCourse(course)}
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
                                <HiOutlineBookOpen /> Create New Course
                            </h3>
                            <p className="text-sm opacity-80 mt-1">Add a new academic course to the system curriculum.</p>
                        </div>

                        <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-semibold">Course Name</span></label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="e.g. Advanced Data Structures"
                                    required
                                    value={newCourse.courseName}
                                    onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Course Code</span></label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        placeholder="e.g. CSE2101"
                                        required
                                        value={newCourse.courseCode}
                                        onChange={(e) => setNewCourse({ ...newCourse, courseCode: e.target.value })}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Credits</span></label>
                                    <input
                                        type="number"
                                        className="input input-bordered w-full"
                                        min="1" max="10"
                                        required
                                        value={newCourse.credits}
                                        onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-semibold">Department</span></label>
                                <select
                                    className="select select-bordered w-full"
                                    required
                                    value={newCourse.department.id}
                                    onChange={(e) => setNewCourse({ ...newCourse, department: { id: e.target.value } })}
                                >
                                    <option value="" disabled>Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-action gap-2 pt-4">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-8">Create Course</button>
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
                                <HiOutlinePencil /> Edit Course Details
                            </h3>
                            <p className="text-sm opacity-80 mt-1">Modify course specifications and department affiliation.</p>
                        </div>

                        <form onSubmit={handleUpdateCourse} className="p-6 space-y-4">
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-semibold">Course Name</span></label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="e.g. Advanced Data Structures"
                                    required
                                    value={editingCourse.courseName}
                                    onChange={(e) => setEditingCourse({ ...editingCourse, courseName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Course Code</span></label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        placeholder="e.g. CSE2101"
                                        required
                                        value={editingCourse.courseCode}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, courseCode: e.target.value })}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Credits</span></label>
                                    <input
                                        type="number"
                                        className="input input-bordered w-full"
                                        min="1" max="10"
                                        required
                                        value={editingCourse.credits}
                                        onChange={(e) => setEditingCourse({ ...editingCourse, credits: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-semibold">Department</span></label>
                                <select
                                    className="select select-bordered w-full"
                                    required
                                    value={editingCourse.departmentId}
                                    onChange={(e) => setEditingCourse({ ...editingCourse, departmentId: e.target.value })}
                                >
                                    <option value="" disabled>Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-action gap-2 pt-4">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-success text-white px-8">Update Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesManagement;
