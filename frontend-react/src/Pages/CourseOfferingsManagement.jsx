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

const CourseOfferingsManagement = () => {
    const [offerings, setOfferings] = useState([]);
    const [courses, setCourses] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
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
            console.log('Fetching initial data...');
            const [offeringsRes, coursesRes, facultyRes] = await Promise.all([
                api.get('/courseofferings'),
                api.get('/courses'),
                api.get('/courseofferings/faculty-list').catch(err => {
                    console.error('Faculty API failed:', err);
                    return { data: [] }; // Fallback
                })
            ]);
            
            console.log('Offerings:', offeringsRes.data);
            console.log('Courses:', coursesRes.data);
            console.log('Faculty:', facultyRes.data);

            setOfferings(offeringsRes.data);
            setCourses(coursesRes.data);
            setFaculty(facultyRes.data);
            
            // Set defaults if data exists
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

    const handleCreateOffering = async (e) => {
        e.preventDefault();
        try {
            // Ensure numeric maxCapacity
            const payload = { ...newOffering, maxCapacity: parseInt(newOffering.maxCapacity) };
            await api.post('/courseofferings', payload);
            setIsModalOpen(false);
            // Refresh list
            const res = await api.get('/courseofferings');
            setOfferings(res.data);
            // Reset some fields but keep course/teacher for batch entry convenience
            setNewOffering(prev => ({ ...prev, roomNumber: '', section: 'A' }));
        } catch (error) {
            alert('Failed to create course offering');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this offering?')) return;
        try {
            await api.delete(`/courseofferings/${id}`);
            setOfferings(offerings.filter(o => o.id !== id));
        } catch (error) {
            alert('Failed to delete offering');
        }
    };

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
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-10"><span className="loading loading-spinner text-primary"></span></td></tr>
                            ) : offerings.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-10 text-base-content/40">No offerings scheduled yet.</td></tr>
                            ) : (
                                offerings.map((offering) => (
                                    <tr key={offering.id} className="hover:bg-base-200/30 transition-colors">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-primary/10 text-primary rounded-lg w-10">
                                                        <HiOutlineBookOpen size={20} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm uppercase">{offering.course?.courseCode}</div>
                                                    <div className="text-xs opacity-60 flex items-center gap-1">
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
                                                <button className="btn btn-ghost btn-xs text-info hover:bg-info/10">
                                                    <HiOutlinePencil size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(offering.id)}
                                                    className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                                                >
                                                    <HiOutlineTrash size={14} />
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
                    <div className="modal-box max-w-2xl bg-base-100 p-0 overflow-hidden rounded-2xl border border-base-200">
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
                                        className="select select-bordered w-full bg-base-100 text-base-content"
                                        value={newOffering.course.id}
                                        onChange={(e) => setNewOffering({...newOffering, course: { id: e.target.value }})}
                                        required
                                    >
                                        <option value="" disabled className="text-base-content/50">Select a course</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id} className="text-base-content">
                                                {c.courseCode} - {c.courseName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text font-semibold">Assign Faculty</span></label>
                                    <select 
                                        className="select select-bordered w-full bg-base-100 text-base-content"
                                        value={newOffering.teacher.id}
                                        onChange={(e) => setNewOffering({...newOffering, teacher: { id: e.target.value }})}
                                        required
                                    >
                                        <option value="" disabled className="text-base-content/50">Select a faculty member</option>
                                        {faculty.map(f => (
                                            <option key={f.id} value={f.id} className="text-base-content">
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
                                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-8 btn-sm">Schedule Offering</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseOfferingsManagement;
