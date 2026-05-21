import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import PageLoader from '../Components/PageLoader';
import { 
    HiOutlineBookOpen, 
    HiOutlinePlusCircle, 
    HiOutlineMinusCircle,
    HiOutlineCheckCircle,
    HiOutlineInformationCircle
} from 'react-icons/hi';
import Swal from 'sweetalert2';

const Enrollment = () => {
    const [offerings, setOfferings] = useState([]);
    const [myEnrollments, setMyEnrollments] = useState([]);
    const [studentProfile, setStudentProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Course Enrollment | UniMS";
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [offeringsRes, myEnrollmentsRes, profileRes] = await Promise.all([
                api.get('/courseofferings'),
                api.get('/student/enrollments'),
                api.get('/student/profile')
            ]);
            setOfferings(offeringsRes.data);
            setMyEnrollments(myEnrollmentsRes.data);
            setStudentProfile(profileRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching enrollment data:', error);
            Swal.fire('Error', 'Failed to load enrollment data', 'error');
            setLoading(false);
        }
    };

    const isEnrolled = (offeringId) => {
        return myEnrollments.some(e => e.offeredCourse.id === offeringId && e.status !== 'DROPPED');
    };

    const handleEnroll = async (offering) => {
        if (!studentProfile?.userId) {
            Swal.fire('Error', 'Student ID not found. Please contact admin.', 'error');
            return;
        }

        try {
            const result = await Swal.fire({
                title: 'Confirm Enrollment',
                text: `Are you sure you want to enroll in ${offering.course.courseName} (${offering.section})?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, enroll!'
            });

            if (result.isConfirmed) {
                await api.post('/enrollments', {
                    student: { id: studentProfile.userId },
                    offeredCourse: { id: offering.id },
                    enrollmentDate: new Date().toISOString().split('T')[0],
                    status: 'ENROLLED'
                });
                
                Swal.fire({
                    icon: 'success',
                    title: 'Enrolled!',
                    text: 'Successfully enrolled in the course.',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchData();
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to enroll in course', 'error');
        }
    };

    const handleDrop = async (enrollmentId) => {
        try {
            const result = await Swal.fire({
                title: 'Drop Course',
                text: "Are you sure you want to drop this course?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Yes, drop it!'
            });

            if (result.isConfirmed) {
                await api.delete(`/enrollments/${enrollmentId}`);
                Swal.fire({
                    icon: 'success',
                    title: 'Dropped!',
                    text: 'Course dropped successfully.',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchData();
            }
        } catch (error) {
            console.error('Drop error:', error);
            Swal.fire('Error', 'Failed to drop course', 'error');
        }
    };

    if (loading) {
        return <PageLoader message="Loading available course offerings..." />;
    }

    return (
        <div className="w-full space-y-8">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                Course Enrollment
            </h3>

            {/* My Enrollments Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-base-content">
                    <HiOutlineCheckCircle className="text-success w-6 h-6" />
                    My Current Enrollments
                </div>
                {myEnrollments.filter(e => e.status !== 'DROPPED').length === 0 ? (
                    <div className="alert alert-info border-none bg-info/10 text-info shadow-sm capitalize">
                        <HiOutlineInformationCircle className="w-6 h-6" />
                        <span>You are not enrolled in any courses yet.</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myEnrollments.filter(e => e.status !== 'DROPPED').map((enrollment) => (
                            <div key={enrollment.id} className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="card-body p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-sm font-bold text-primary tracking-wider uppercase">
                                            {enrollment.offeredCourse.course.courseCode}
                                        </h4>
                                        <span className={`badge badge-sm ${enrollment.status === 'ENROLLED' ? 'badge-success' : 'badge-ghost'}`}>
                                            {enrollment.status}
                                        </span>
                                    </div>
                                    <p className="font-bold text-lg mb-1">{enrollment.offeredCourse.course.courseName}</p>
                                    <div className="text-sm space-y-2 mt-3 p-3 bg-base-200/30 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="opacity-70">Section:</span>
                                            <span className="font-semibold">{enrollment.offeredCourse.section}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="opacity-70">Semester:</span>
                                            <span className="font-semibold">{enrollment.offeredCourse.semester}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="opacity-70">Instructor:</span>
                                            <span className="font-semibold">{enrollment.offeredCourse.teacher?.email.split('@')[0] || 'TBA'}</span>
                                        </div>
                                    </div>
                                    <div className="card-actions mt-5">
                                        <button 
                                            onClick={() => handleDrop(enrollment.id)}
                                            className="btn btn-outline btn-error btn-sm w-full gap-2 hover:bg-error hover:text-white"
                                        >
                                            <HiOutlineMinusCircle className="w-4 h-4" /> Drop Course
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Available Courses Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-base-content">
                    <HiOutlineBookOpen className="text-primary w-6 h-6" />
                    Available Course Offerings
                </div>
                <div className="overflow-x-auto bg-base-100 rounded-xl border border-base-200 shadow-sm">
                    <table className="table table-zebra w-full text-base-content">
                        <thead className="bg-base-200/50">
                            <tr>
                                <th className="text-sm">Course</th>
                                <th className="text-sm">Details</th>
                                <th className="text-sm">Instructor</th>
                                <th className="text-sm">Semester</th>
                                <th className="text-sm text-center">Enrolled</th>
                                <th className="text-sm text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offerings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 opacity-50">No offerings available at the moment.</td>
                                </tr>
                            ) : offerings.map((offering) => {
                                const isFull = (offering.enrolledCount || 0) >= offering.maxCapacity;
                                
                                return (
                                    <tr key={offering.id} className="hover:bg-base-200/30 transition-colors">
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-primary text-base">{offering.course.courseCode}</span>
                                                <span className="text-xs opacity-70 font-medium">{offering.course.courseName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col gap-1">
                                                <div className="badge badge-outline badge-sm font-semibold">Section {offering.section}</div>
                                                <span className="text-xs opacity-70">Room: {offering.roomNumber}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content rounded-full w-6 h-6">
                                                        <span className="text-[10px]">{offering.teacher?.email.charAt(0).toUpperCase() || '?'}</span>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium">{offering.teacher?.email || 'TBA'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-sm font-medium">{offering.semester}</span>
                                        </td>
                                        <td className="text-center font-mono">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`text-sm ${isFull ? 'text-error font-bold' : 'font-semibold'}`}>
                                                    {offering.enrolledCount || 0} / {offering.maxCapacity}
                                                </span>
                                                <progress 
                                                    className={`progress w-16 ${isFull ? 'progress-error' : 'progress-primary'}`} 
                                                    value={offering.enrolledCount || 0} 
                                                    max={offering.maxCapacity}
                                                ></progress>
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            {isEnrolled(offering.id) ? (
                                                <button className="btn btn-disabled btn-sm gap-2">
                                                    <HiOutlineCheckCircle className="w-4 h-4" /> Enrolled
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleEnroll(offering)}
                                                    disabled={isFull}
                                                    className={`btn btn-sm gap-2 ${isFull ? 'btn-ghost' : 'btn-primary'}`}
                                                >
                                                    <HiOutlinePlusCircle className="w-4 h-4" /> {isFull ? 'Full' : 'Enroll'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Enrollment;
