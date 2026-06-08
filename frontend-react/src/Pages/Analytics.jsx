import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import PageLoader from '../Components/PageLoader';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
    HiOutlineUsers, 
    HiOutlineAcademicCap, 
    HiOutlineOfficeBuilding, 
    HiOutlineBookOpen,
    HiOutlineChartBar,
    HiOutlineTrendingUp
} from 'react-icons/hi';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "System Analytics | UniMS";
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/admin/analytics');
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching analytics:", error);
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return <PageLoader message="Gathering University Insights..." />;
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in">
                <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center text-error border border-error/20">
                    <HiOutlineChartBar size={40} />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-black text-base-content tracking-tighter">Analytics Unavailable</h2>
                    <p className="text-base-content/60 text-sm mt-1">We couldn't retrieve the system data at this moment.</p>
                </div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="btn btn-primary btn-wide rounded-2xl font-black tracking-widest uppercase shadow-lg shadow-primary/30"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    const chartColors = [
        'rgba(59, 130, 246, 0.8)',   // Primary Blue
        'rgba(236, 72, 153, 0.8)',   // Secondary Pink
        'rgba(16, 185, 129, 0.8)',   // Success Green
        'rgba(245, 158, 11, 0.8)',   // Warning Orange
        'rgba(139, 92, 246, 0.8)',   // Purple
        'rgba(107, 114, 128, 0.8)',  // Gray
    ];

    // Students vs Faculties by Dept
    const depts = Object.keys(data?.studentsByDepartment || {});
    const deptComparisonData = {
        labels: depts,
        datasets: [
            {
                label: 'Students',
                data: depts.map(d => data?.studentsByDepartment?.[d] || 0),
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
            },
            {
                label: 'Faculties',
                data: depts.map(d => data?.facultiesByDepartment?.[d] || 0),
                backgroundColor: 'rgba(236, 72, 153, 0.6)',
                borderColor: 'rgb(236, 72, 153)',
                borderWidth: 1,
            }
        ]
    };

    // Course Offerings by Dept
    const offeringsByDeptData = {
        labels: Object.keys(data?.offeringsByDepartment || {}),
        datasets: [{
            label: 'Course Offerings',
            data: Object.values(data?.offeringsByDepartment || {}),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
        }]
    };

    // Top Popular Courses
    const sortedPopularCourses = Object.entries(data?.enrollmentByCourse || {})
        .sort(([, a], [, b]) => b - a);
    const popularCoursesData = {
        labels: sortedPopularCourses.map(([name]) => name),
        datasets: [{
            label: 'Enrolled Students',
            data: sortedPopularCourses.map(([, count]) => count),
            backgroundColor: chartColors,
            borderRadius: 8,
        }]
    };

    // Top Rated Faculty
    const sortedFaculty = Object.entries(data?.facultyRatings || {})
        .sort(([, a], [, b]) => b - a);
    const facultyRatingData = {
        labels: sortedFaculty.map(([name]) => name),
        datasets: [{
            label: 'Faculty Rating',
            data: sortedFaculty.map(([, rating]) => rating),
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1,
            borderRadius: 4,
        }]
    };

    // Gender distributions
    const genderData = (map) => ({
        labels: Object.keys(map || {}),
        datasets: [{
            data: Object.values(map || {}),
            backgroundColor: chartColors,
            borderWidth: 0,
        }]
    });

    // Courses by Dept
    const coursesByDeptData = {
        labels: Object.keys(data?.coursesByDepartment || {}),
        datasets: [{
            label: 'Total Courses',
            data: Object.values(data?.coursesByDepartment || {}),
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1,
        }]
    };

    // Avg CGPA by Dept
    const avgCgpaData = {
        labels: Object.keys(data?.averageCgpaByDepartment || {}),
        datasets: [{
            label: 'Average CGPA',
            data: Object.values(data?.averageCgpaByDepartment || {}),
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.5)',
            fill: true,
            tension: 0.4,
        }]
    };

    // Login Activity by Hour
    const loginActivityData = {
        labels: Object.keys(data?.loginsByHour || {}).sort(),
        datasets: [{
            label: 'Login Count',
            data: Object.keys(data?.loginsByHour || {}).sort().map(h => data?.loginsByHour?.[h] || 0),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
        }]
    };

    // Registration Trend
    const registrationTrendData = {
        labels: Object.keys(data?.registrationsByDate || {}).sort(),
        datasets: [{
            label: 'New Users',
            data: Object.keys(data?.registrationsByDate || {}).sort().map(d => data?.registrationsByDate?.[d] || 0),
            borderColor: 'rgb(236, 72, 153)',
            backgroundColor: 'rgba(236, 72, 153, 0.2)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgb(236, 72, 153)',
        }]
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center bg-base-100 p-8 rounded-[2.5rem] border border-base-300 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                <div>
                    <h3 className="text-4xl font-black text-base-content tracking-tighter flex items-center gap-3">
                        University <span className="text-primary italic">Analytics</span>
                    </h3>
                    <p className="text-[10px] font-black text-base-content/70 uppercase tracking-[0.2em] mt-1">Data-Driven Educational Insights</p>
                </div>
                {/* <div className="flex items-center gap-3 px-6 py-3 bg-success/10 rounded-2xl border border-success/20">
                    <div className="w-3 h-3 rounded-full bg-success animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    <span className="text-xs font-black uppercase tracking-widest text-success">Live Engine Active</span>
                </div> */}
            </div>

            {/* Top Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Students', value: data?.totalStudents || 0, icon: <HiOutlineUsers />, color: 'text-primary', figure: 'text-primary' },
                    { label: 'Total Faculty', value: data?.totalFaculties || 0, icon: <HiOutlineAcademicCap />, color: 'text-secondary', figure: 'text-secondary' },
                    { label: 'Departments', value: data?.totalDepartments || 0, icon: <HiOutlineOfficeBuilding />, color: 'text-accent', figure: 'text-accent' },
                    { label: 'Total Courses', value: data?.totalCourses || 0, icon: <HiOutlineBookOpen />, color: 'text-info', figure: 'text-info' }
                ].map((stat, idx) => (
                    <div key={idx} className="stat bg-base-100 border border-base-300 rounded-2xl shadow-sm transition-all hover:shadow-md">
                        <div className={`stat-figure ${stat.figure} opacity-30`}>
                            {React.cloneElement(stat.icon, { size: 40 })}
                        </div>
                        <div className="stat-title text-base-content/60 font-medium whitespace-nowrap">{stat.label}</div>
                        <div className={`stat-value ${stat.color} leading-tight text-3xl font-black`}>
                            {stat.value}
                        </div>
                        <div className="stat-desc mt-1 font-medium">System Records</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* --- Time Based Analysis --- */}
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6 overflow-hidden">
                    <h4 className="font-bold mb-6 flex items-center gap-2 text-base-content/80">
                        <HiOutlineTrendingUp className="text-primary" />
                        Peak Login Hours (Activity)
                    </h4>
                    <div className="flex-1 min-h-[300px]">
                        <Line 
                            data={loginActivityData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { y: { beginAtZero: true } }
                            }} 
                        />
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6 overflow-hidden">
                    <h4 className="font-bold mb-6 flex items-center gap-2 text-base-content/80">
                        <HiOutlineUsers className="text-secondary" />
                        User Registration Trend
                    </h4>
                    <div className="flex-1 min-h-[300px]">
                        <Line 
                            data={registrationTrendData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { y: { beginAtZero: true } }
                            }} 
                        />
                    </div>
                </div>

                {/* --- Demographics & Population --- */}
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6 overflow-hidden">
                    <h4 className="font-bold mb-6 flex items-center gap-2 text-base-content/80">
                        <HiOutlineChartBar className="text-primary" />
                        Population by Department
                    </h4>
                    <div className="flex-1 min-h-[300px]">
                        <Bar 
                            data={deptComparisonData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom' } },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        min: 0
                                    }
                                }
                            }} 
                        />
                    </div>
                </div>

                {/* Courses Count */}
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6 overflow-hidden">
                    <h4 className="font-bold mb-6 flex items-center gap-2 text-base-content/80">
                        <HiOutlineBookOpen className="text-accent" />
                        Courses per Department
                    </h4>
                    <div className="flex-1 min-h-[300px]">
                        <Bar 
                            data={coursesByDeptData} 
                            options={{ 
                                indexAxis: 'y', 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: {
                                        beginAtZero: true,
                                        min: 0
                                    }
                                }
                            }} 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:col-span-2">
                    <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6 overflow-hidden">
                        <h4 className="font-bold mb-6 text-center text-xs uppercase tracking-widest text-base-content/50">Student Gender Distribution</h4>
                        <div className="flex justify-center items-center flex-1">
                            <div className="w-full max-w-[150px]">
                                <Pie data={genderData(data?.studentsByGender)} options={{ plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} />
                            </div>
                        </div>
                    </div>
                    <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6 overflow-hidden">
                        <h4 className="font-bold mb-6 text-center text-xs uppercase tracking-widest text-base-content/50">Faculty Gender Distribution</h4>
                        <div className="flex justify-center items-center flex-1">
                            <div className="w-full max-w-[150px]">
                                <Pie data={genderData(data?.facultiesByGender)} options={{ plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 9 } } } } }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Academic Performance & Excellence --- */}
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6 overflow-hidden">
                    <h4 className="font-bold mb-6 flex items-center gap-2 text-base-content/80">
                        <HiOutlineTrendingUp className="text-secondary" />
                        Average CGPA by Department
                    </h4>
                    <div className="flex-1 min-h-[300px]">
                        <Line 
                            data={avgCgpaData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        min: 0,
                                        max: 4.0
                                    }
                                }
                            }} 
                        />
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6 overflow-hidden">
                    <h4 className="font-bold mb-6 flex items-center gap-2 text-base-content/80">
                        <HiOutlineAcademicCap className="text-success" />
                        Top Rated Faculty
                    </h4>
                    <div className="flex-1 min-h-[300px]">
                        <Bar 
                            data={facultyRatingData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { y: { beginAtZero: true, max: 5 } }
                            }} 
                        />
                    </div>
                </div>

                {/* --- Offerings & Popularity --- */}
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6 overflow-hidden">
                    <h4 className="font-bold mb-6 flex items-center gap-2 text-base-content/80">
                        <HiOutlineBookOpen className="text-primary" />
                        Offerings per Department
                    </h4>
                    <div className="flex-1 min-h-[300px]">
                        <Bar 
                            data={offeringsByDeptData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { y: { beginAtZero: true } }
                            }} 
                        />
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6 overflow-hidden">
                    <h4 className="font-bold mb-6 flex items-center gap-2 text-base-content/80">
                        <HiOutlineTrendingUp className="text-accent" />
                        Most Popular Courses
                    </h4>
                    <div className="flex-1 min-h-[300px]">
                        <Bar 
                            data={popularCoursesData} 
                            options={{ 
                                indexAxis: 'y',
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } }
                            }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
