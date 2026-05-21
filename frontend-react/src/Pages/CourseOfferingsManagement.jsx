import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import { 
    HiOutlinePlus, 
    HiOutlinePencil, 
    HiOutlineTrash, 
    HiOutlineCalendar, 
    HiOutlineLocationMarker, 
    HiOutlineUserCircle, 
    HiOutlineBookOpen,
    HiOutlineStatusOnline
} from 'react-icons/hi';
import Swal from 'sweetalert2';
import PageLoader from '../Components/PageLoader';

const CourseOfferingsManagement = () => {
    const [offerings, setOfferings] = useState([]);
    const [courses, setCourses] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingOffering, setEditingOffering] = useState(null);
    
    const [newOffering, setNewOffering] = useState({
        course: { id: '' },
        teacher: { id: '' },
        semester: 'Fall 2026',
        section: 'A',
        roomNumber: '',
        maxCapacity: 30,
        status: 'UPCOMING'
    });

    const statusBadges = {
        'UPCOMING': 'badge-info',
        'ONGOING': 'badge-success',
        'COMPLETED': 'badge-neutral',
        'CANCELLED': 'badge-error'
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [offeringsRes, coursesRes, facultyRes] = await Promise.all([
                api.get('/courseofferings'),
                api.get('/courses'),
                api.get('/courseofferings/faculty-list').catch(err => {
                    console.error('Faculty API failed:', err);
                    return { data: [] }; 
                })
            ]);
            
            setOfferings(offeringsRes.data);
            setCourses(coursesRes.data);
            setFaculty(facultyRes.data);
            
            if (coursesRes.data.length > 0) {
                setNewOffering(prev => ({
                    ...prev,
                    course: { id: coursesRes.data[0].id }
                }));
            }
            if (facultyRes.data.length > 0) {
                setNewOffering(prev => ({
                    ...prev,
                    teacher: { id: facultyRes.data[0].id }
                }));
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const fetchOfferings = async () => {
        try {
            const res = await api.get('/courseofferings');
            setOfferings(res.data);
        } catch (error) {
            console.error('Error fetching offerings:', error);
        }
    };

    const handleCreateOffering = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...newOffering, maxCapacity: parseInt(newOffering.maxCapacity) };
            await api.post('/courseofferings', payload);
            setIsModalOpen(false);
            fetchOfferings();
            setNewOffering(prev => ({ ...prev, roomNumber: '', section: 'A' }));
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Course offering created successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to create course offering', 'error');
        }
    };

    const handleEditClick = (offering) => {
        setEditingOffering({
            ...offering,
            courseId: offering.course?.id || '',
            teacherId: offering.teacher?.id || ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateOffering = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...editingOffering,
                course: { id: editingOffering.courseId },
                teacher: { id: editingOffering.teacherId },
                maxCapacity: parseInt(editingOffering.maxCapacity)
            };
            await api.put(`/courseofferings/${editingOffering.id}`, payload);
            setIsEditModalOpen(false);
            setEditingOffering(null);
            fetchOfferings();
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Course offering updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to update course offering', 'error');
        }
    };

    const handleDelete = async (offering) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Deleting the offering for "${offering.course?.courseCode}" will remove all student enrollments for this section!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/courseofferings/${offering.id}`);
                fetchOfferings();
                Swal.fire('Deleted!', 'Offering has been removed.', 'success');
            } catch (error) {
                Swal.fire('Error', 'Failed to delete offering.', 'error');
            }
        }
    };

    if (loading) {
        return <PageLoader message="Initializing course offerings schedule..." />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    Course Offerings (Enrollment Setup)
                </h3>
                <button
                    className="btn btn-primary btn-sm flex items-center gap-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    <HiOutlinePlus size={18} />
                    Offer New Course
                </button>
            </div>

            <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden">
                <div className="max-h-[600px] overflow-y-auto">
                    <table className="table table-pin-rows table-zebra">
                        <thead>
                            <tr className="bg-base-200/50">
                                <th>Course & Semester</th>
                                <th>Faculty / Section</th>
                                <th>Capacity / Room</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offerings.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-10 text-base-content/40">No offerings scheduled yet.</td></tr>
                            ) : (
                                offerings.map((offering) => (
                                    <tr key={offering.id} className="hover:bg-base-200/30 transition-colors">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-primary/10 text-primary rounded-lg w-10 flex items-center justify-center">
                                                        <HiOutlineBookOpen size={20} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm uppercase">{offering.course?.courseCode}</div>
                                                    <div className="text-[10px] text-base-content/50 leading-tight mb-1">{offering.course?.courseName}</div>
                                                    <div className="text-xs opacity-60 flex items-center gap-1 mt-0.5">
                                                        <HiOutlineCalendar /> {offering.semester}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm flex items-center gap-1 text-base-content/80">
                                                    <HiOutlineUserCircle /> {offering.teacher?.email}
                                                </span>
                                                <span className="text-xs badge badge-ghost badge-xs rounded mt-1">Section {offering.section}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-semibold">Cap: {offering.maxCapacity}</span>
                                                <span className="text-xs text-base-content/50 flex items-center gap-1">
                                                    <HiOutlineLocationMarker /> {offering.roomNumber || 'TBA'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge ${statusBadges[offering.status] || 'badge-ghost'} badge-sm font-bold`}>
                                                {offering.status}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    className="btn btn-soft btn-sm btn-success hover:text-white px-2"
                                                    onClick={() => handleEditClick(offering)}
                                                >
                                                    <HiOutlinePencil size={16} />
                                                </button>
                                                <button 
                                                    className="btn btn-soft btn-sm btn-error hover:text-white px-2"
                                                    onClick={() => handleDelete(offering)}
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

            {/* Create Offering Modal */}
            {isModalOpen && (
                <div className="modal modal-open backdrop-blur-sm">
                    <div className="modal-box max-w-2xl bg-base-100 p-0 overflow-hidden rounded-2xl border border-base-200 shadow-2xl">
                        <div className="bg-primary p-6 text-primary-content">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <HiOutlineStatusOnline /> Offer a New Course
                            </h3>
                            <p className="text-sm opacity-80 mt-1">Link a course to a teacher and schedule it for a semester.</p>
                        </div>
                        
                        <form onSubmit={handleCreateOffering} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Select Course</span></label>
                                    <select 
                                        className="select select-bordered w-full"
                                        value={newOffering.course.id}
                                        onChange={(e) => setNewOffering({...newOffering, course: { id: e.target.value }})}
                                        required
                                    >
                                        <option value="" disabled>Select a course</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.courseCode} - {c.courseName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Assign Faculty</span></label>
                                    <select 
                                        className="select select-bordered w-full"
                                        value={newOffering.teacher.id}
                                        onChange={(e) => setNewOffering({...newOffering, teacher: { id: e.target.value }})}
                                        required
                                    >
                                        <option value="" disabled>Select a faculty member</option>
                                        {faculty.map(f => (
                                            <option key={f.id} value={f.id}>
                                                {f.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Semester</span></label>
                                    <input 
                                        type="text" 
                                        className="input input-bordered w-full"
                                        value={newOffering.semester}
                                        onChange={(e) => setNewOffering({...newOffering, semester: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Section</span></label>
                                    <input 
                                        type="text" 
                                        className="input input-bordered w-full"
                                        placeholder="e.g. A, B, L1"
                                        value={newOffering.section}
                                        onChange={(e) => setNewOffering({...newOffering, section: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Room Number</span></label>
                                    <input 
                                        type="text" 
                                        className="input input-bordered w-full"
                                        placeholder="e.g. LAB-402"
                                        value={newOffering.roomNumber}
                                        onChange={(e) => setNewOffering({...newOffering, roomNumber: e.target.value})}
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Max Capacity</span></label>
                                    <input 
                                        type="number" 
                                        className="input input-bordered w-full"
                                        value={newOffering.maxCapacity}
                                        onChange={(e) => setNewOffering({...newOffering, maxCapacity: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-action gap-2 pt-4">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-8">Schedule Offering</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Offering Modal */}
            {isEditModalOpen && (
                <div className="modal modal-open backdrop-blur-sm">
                    <div className="modal-box max-w-2xl bg-base-100 p-0 overflow-hidden rounded-2xl border border-base-200 shadow-2xl">
                        <div className="bg-success p-6 text-success-content">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <HiOutlinePencil /> Edit Course Offering
                            </h3>
                            <p className="text-sm opacity-80 mt-1">Modify scheduling, assignment or capacity for this section.</p>
                        </div>
                        
                        <form onSubmit={handleUpdateOffering} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Select Course</span></label>
                                    <select 
                                        className="select select-bordered w-full"
                                        value={editingOffering.courseId}
                                        onChange={(e) => setEditingOffering({...editingOffering, courseId: e.target.value})}
                                        required
                                    >
                                        <option value="" disabled>Select a course</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.courseCode} - {c.courseName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Assign Faculty</span></label>
                                    <select 
                                        className="select select-bordered w-full"
                                        value={editingOffering.teacherId}
                                        onChange={(e) => setEditingOffering({...editingOffering, teacherId: e.target.value})}
                                        required
                                    >
                                        <option value="" disabled>Select a faculty member</option>
                                        {faculty.map(f => (
                                            <option key={f.id} value={f.id}>
                                                {f.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Semester</span></label>
                                    <input 
                                        type="text" 
                                        className="input input-bordered w-full"
                                        value={editingOffering.semester}
                                        onChange={(e) => setEditingOffering({...editingOffering, semester: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Section</span></label>
                                    <input 
                                        type="text" 
                                        className="input input-bordered w-full"
                                        placeholder="e.g. A, B, L1"
                                        value={editingOffering.section}
                                        onChange={(e) => setEditingOffering({...editingOffering, section: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Room Number</span></label>
                                    <input 
                                        type="text" 
                                        className="input input-bordered w-full"
                                        placeholder="e.g. LAB-402"
                                        value={editingOffering.roomNumber}
                                        onChange={(e) => setEditingOffering({...editingOffering, roomNumber: e.target.value})}
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Max Capacity</span></label>
                                    <input 
                                        type="number" 
                                        className="input input-bordered w-full"
                                        value={editingOffering.maxCapacity}
                                        onChange={(e) => setEditingOffering({...editingOffering, maxCapacity: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-control w-full md:col-span-2">
                                    <label className="label"><span className="label-text font-semibold">Status</span></label>
                                    <select 
                                        className="select select-bordered w-full"
                                        value={editingOffering.status}
                                        onChange={(e) => setEditingOffering({...editingOffering, status: e.target.value})}
                                        required
                                    >
                                        <option value="UPCOMING">Upcoming</option>
                                        <option value="ONGOING">Ongoing</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-action gap-2 pt-4">
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

export default CourseOfferingsManagement;
