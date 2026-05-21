import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import PageLoader from '../Components/PageLoader';
import { 
    HiOutlineBookOpen, 
    HiOutlineUserGroup, 
    HiOutlineLocationMarker,
    HiOutlineCalendar,
    HiOutlineCheckCircle,
    HiOutlineExternalLink
} from 'react-icons/hi';

const FacultyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "My Courses | UniMS";
        const fetchCourses = async () => {
            try {
                const response = await api.get('/faculty/courses');
                setCourses(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching faculty courses:", error);
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) {
        return <PageLoader message="Fetching your assigned courses..." />;
    }

    return (
        <div className="w-full space-y-8">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                My Assigned Courses
            </h3>

            {courses.length === 0 ? (
                <div className="card bg-base-100 p-12 text-center border-2 border-dashed border-base-300">
                    <HiOutlineBookOpen className="mx-auto text-5xl opacity-20 mb-4" />
                    <p className="text-lg font-bold opacity-40">No courses assigned yet.</p>
                    <p className="text-sm opacity-30">Please contact the registrar for course allocation.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map((offering) => (
                        <div key={offering.id} className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
                            <div className="card-body p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="badge badge-primary badge-outline font-black py-3">Section {offering.section}</span>
                                    <div className={`badge font-bold ${
                                        offering.status === 'ONGOING' ? 'badge-success' : 
                                        offering.status === 'UPCOMING' ? 'badge-info' : 'badge-ghost'
                                    }`}>
                                        {offering.status}
                                    </div>
                                </div>

                                <h2 className="card-title text-xl font-black group-hover:text-primary transition-colors">
                                    {offering.course.courseName}
                                </h2>
                                <p className="text-sm font-bold text-base-content/40 tracking-wider mb-4 uppercase">
                                    {offering.course.courseCode} • {offering.course.credits} Credits
                                </p>

                                <div className="space-y-3 bg-base-200/50 p-4 rounded-xl">
                                    <div className="flex items-center gap-3 text-sm">
                                        <HiOutlineLocationMarker className="text-primary text-lg" />
                                        <span className="font-semibold">Room: {offering.roomNumber || 'TBA'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <HiOutlineCalendar className="text-primary text-lg" />
                                        <span className="font-semibold">{offering.semester}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <HiOutlineUserGroup className="text-primary text-lg" />
                                        <span className="font-semibold">
                                            Students: {offering.enrolledCount} / {offering.maxCapacity}
                                        </span>
                                    </div>
                                </div>

                                <div className="card-actions mt-6">
                                    <button className="btn btn-primary btn-block gap-2 shadow-lg shadow-primary/20">
                                        <HiOutlineExternalLink className="text-lg" /> View Class List
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacultyCourses;
