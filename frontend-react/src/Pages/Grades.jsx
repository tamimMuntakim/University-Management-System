import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import PageLoader from '../Components/PageLoader';
import { 
    HiOutlineAcademicCap, 
    HiOutlineChartBar, 
    HiOutlineCollection,
    HiOutlineClipboardCheck,
    HiOutlineStar
} from 'react-icons/hi';

const Grades = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [stats, setStats] = useState({
        cgpa: 0.0,
        creditsCompleted: 0,
        totalEnrollments: 0,
        department: 'N/A'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Grades & Transcript | UniMS";
        fetchGradeData();
    }, []);

    const fetchGradeData = async () => {
        setLoading(true);
        try {
            const [enrollmentsRes, statsRes] = await Promise.all([
                api.get('/student/enrollments'),
                api.get('/student/stats')
            ]);
            
            // Sort by semester (descending) then course code
            const sortedEnrollments = enrollmentsRes.data.sort((a, b) => {
                const semA = a.offeredCourse.semester;
                const semB = b.offeredCourse.semester;
                if (semA !== semB) return semB.localeCompare(semA);
                return a.offeredCourse.course.courseCode.localeCompare(b.offeredCourse.course.courseCode);
            });

            setEnrollments(sortedEnrollments);
            setStats(statsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching grade data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <PageLoader message="Calculating academic records..." />;
    }

    // Group enrollments by semester
    const groupedGrades = enrollments.reduce((acc, enrollment) => {
        const semester = enrollment.offeredCourse.semester;
        if (!acc[semester]) acc[semester] = [];
        acc[semester].push(enrollment);
        return acc;
    }, {});

    const getGradeBadgeClass = (grade) => {
        if (!grade) return 'badge-ghost';
        if (['A+', 'A', 'A-'].includes(grade)) return 'badge-success';
        if (['B+', 'B', 'B-'].includes(grade)) return 'badge-info';
        if (['C+', 'C'].includes(grade)) return 'badge-warning';
        return 'badge-error';
    };

    return (
        <div className="w-full space-y-8">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                Academic Grades
            </h3>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card bg-base-100 border border-base-300 shadow-sm p-4 flex flex-row items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl text-2xl">
                        <HiOutlineStar />
                    </div>
                    <div>
                        <p className="text-xs font-bold opacity-50 uppercase">Current CGPA</p>
                        <p className="text-2xl font-black text-primary">{stats.cgpa?.toFixed(2) || '0.00'}</p>
                    </div>
                </div>
                <div className="card bg-base-100 border border-base-300 shadow-sm p-4 flex flex-row items-center gap-4">
                    <div className="p-3 bg-success/10 text-success rounded-xl text-2xl">
                        <HiOutlineClipboardCheck />
                    </div>
                    <div>
                        <p className="text-xs font-bold opacity-50 uppercase">Credits Done</p>
                        <p className="text-2xl font-black text-success">{stats.creditsCompleted || 0}</p>
                    </div>
                </div>
                <div className="card bg-base-100 border border-base-300 shadow-sm p-4 flex flex-row items-center gap-4">
                    <div className="p-3 bg-info/10 text-info rounded-xl text-2xl">
                        <HiOutlineCollection />
                    </div>
                    <div>
                        <p className="text-xs font-bold opacity-50 uppercase">Total Courses</p>
                        <p className="text-2xl font-black text-info">{stats.totalEnrollments || 0}</p>
                    </div>
                </div>
                <div className="card bg-base-100 border border-base-300 shadow-sm p-4 flex flex-row items-center gap-4">
                    <div className="p-3 bg-warning/10 text-warning rounded-xl text-2xl">
                        <HiOutlineAcademicCap />
                    </div>
                    <div>
                        <p className="text-xs font-bold opacity-50 uppercase">Status</p>
                        <p className="text-xl font-black text-warning">{stats.status || 'Active'}</p>
                    </div>
                </div>
            </div>

            {/* Grades by Semester */}
            <div className="space-y-6">
                {Object.keys(groupedGrades).length === 0 ? (
                    <div className="card bg-base-100 p-12 text-center border-2 border-dashed border-base-300">
                        <HiOutlineChartBar className="mx-auto text-5xl opacity-20 mb-4" />
                        <p className="text-lg font-bold opacity-40">No grades recorded yet.</p>
                        <p className="text-sm opacity-30">Once courses are completed, your grades will appear here.</p>
                    </div>
                ) : (
                    Object.entries(groupedGrades).map(([semester, items]) => (
                        <div key={semester} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h4 className="text-lg font-black text-base-content/80">{semester}</h4>
                                <div className="h-[1px] flex-1 bg-base-300"></div>
                            </div>
                            
                            <div className="overflow-x-auto bg-base-100 rounded-xl border border-base-300 shadow-sm">
                                <table className="table table-zebra w-full">
                                    <thead className="bg-base-200/50">
                                        <tr>
                                            <th className="text-xs uppercase tracking-wider">Course Code</th>
                                            <th className="text-xs uppercase tracking-wider">Course Name</th>
                                            <th className="text-xs uppercase tracking-wider text-center">Credits</th>
                                            <th className="text-xs uppercase tracking-wider text-center">Status</th>
                                            <th className="text-xs uppercase tracking-wider text-right">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((grade) => (
                                            <tr key={grade.id} className="hover:bg-base-200/30 transition-colors">
                                                <td className="font-bold text-primary">{grade.offeredCourse.course.courseCode}</td>
                                                <td className="font-medium text-sm text-base-content/70">{grade.offeredCourse.course.courseName}</td>
                                                <td className="text-center font-mono">{grade.offeredCourse.course.credits}</td>
                                                <td className="text-center">
                                                    <span className={`badge badge-sm font-bold ${
                                                        grade.status === 'COMPLETED' ? 'badge-success' : 
                                                        grade.status === 'ENROLLED' ? 'badge-info' : 'badge-ghost'
                                                    }`}>
                                                        {grade.status}
                                                    </span>
                                                </td>
                                                <td className="text-right">
                                                    <span className={`badge badge-md px-3 font-black ${getGradeBadgeClass(grade.grade)}`}>
                                                        {grade.grade || 'N/A'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Grades;
