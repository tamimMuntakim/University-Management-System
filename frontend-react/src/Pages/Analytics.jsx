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

    const chartColors = [
        'rgba(59, 130, 246, 0.8)',   // Primary Blue
        'rgba(236, 72, 153, 0.8)',   // Secondary Pink
        'rgba(16, 185, 129, 0.8)',   // Success Green
        'rgba(245, 158, 11, 0.8)',   // Warning Orange
        'rgba(139, 92, 246, 0.8)',   // Purple
        'rgba(107, 114, 128, 0.8)',  // Gray
    ];

    // Students vs Faculties by Dept
    const depts = Object.keys(data.studentsByDepartment || {});
    const deptComparisonData = {
        labels: depts,
        datasets: [
            {
                label: 'Students',
                data: depts.map(d => data.studentsByDepartment[d] || 0),
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
            },
            {
                label: 'Faculties',
                data: depts.map(d => data.facultiesByDepartment[d] || 0),
                backgroundColor: 'rgba(236, 72, 153, 0.6)',
                borderColor: 'rgb(236, 72, 153)',
                borderWidth: 1,
            }
        ]
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
        labels: Object.keys(data.coursesByDepartment || {}),
        datasets: [{
            label: 'Total Courses',
            data: Object.values(data.coursesByDepartment || {}),
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1,
        }]
    };

    // Avg CGPA by Dept
    const avgCgpaData = {
        labels: Object.keys(data.averageCgpaByDepartment || {}),
        datasets: [{
            label: 'Average CGPA',
            data: Object.values(data.averageCgpaByDepartment || {}),
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.5)',
            fill: true,
            tension: 0.4,
        }]
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    University Analytics
                </h3>
                <div className="badge badge-success badge-outline gap-2 px-4 py-3 font-bold">
                    <div className="w-2 h-2 rounded-full bg-success animate-ping"></div>
                    Live Analytics
                </div>
            </div>

            {/* Top Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Students', value: data.totalStudents, icon: <HiOutlineUsers />, color: 'text-primary', figure: 'text-primary' },
                    { label: 'Total Faculty', value: data.totalFaculties, icon: <HiOutlineAcademicCap />, color: 'text-secondary', figure: 'text-secondary' },
                    { label: 'Departments', value: data.totalDepartments, icon: <HiOutlineOfficeBuilding />, color: 'text-accent', figure: 'text-accent' },
                    { label: 'Total Courses', value: data.totalCourses, icon: <HiOutlineBookOpen />, color: 'text-info', figure: 'text-info' }
                ].map((stat, idx) => (
                    <div key={idx} className="stat bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-all hover:shadow-md">
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
                {/* Dept Comparison */}
                <div className="card bg-base-100 border border-base-200 rounded-2xl shadow-sm p-6 overflow-hidden">
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

                {/* Avg CGPA Trends */}
                <div className="card bg-base-100 border border-base-200 rounded-2xl shadow-sm p-6 overflow-hidden">
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

                {/* Gender Pies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-base-100 border border-base-200 rounded-2xl shadow-sm p-6 overflow-hidden">
                        <h4 className="font-bold mb-6 text-center text-xs uppercase tracking-widest text-base-content/50">Student Gender Distribution</h4>
                        <div className="flex justify-center items-center flex-1">
                            <div className="w-full max-w-[180px]">
                                <Pie data={genderData(data.studentsByGender)} options={{ plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } } }} />
                            </div>
                        </div>
                    </div>
                    <div className="card bg-base-100 border border-base-200 rounded-2xl shadow-sm p-6 overflow-hidden">
                        <h4 className="font-bold mb-6 text-center text-xs uppercase tracking-widest text-base-content/50">Faculty Gender Distribution</h4>
                        <div className="flex justify-center items-center flex-1">
                            <div className="w-full max-w-[180px]">
                                <Pie data={genderData(data.facultiesByGender)} options={{ plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } } }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses Count */}
                <div className="card bg-base-100 border border-base-200 rounded-2xl shadow-sm p-6 overflow-hidden">
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
            </div>
        </div>
    );
};

export default Analytics;
