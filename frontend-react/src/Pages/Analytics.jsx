import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import PageLoader from '../Components/PageLoader';
import AreaChart from '../Components/charts/AreaChart';
import BarChart from '../Components/charts/BarChart';
import HorizontalBarChart from '../Components/charts/HorizontalBarChart';
import GroupedBarChart from '../Components/charts/GroupedBarChart';
import LineChart from '../Components/charts/LineChart';
import DonutChart from '../Components/charts/DonutChart';
import BubbleChart from '../Components/charts/BubbleChart';
import ForceGraph  from '../Components/charts/ForceGraph';
import {
    HiOutlineUsers,
    HiOutlineAcademicCap,
    HiOutlineOfficeBuilding,
    HiOutlineBookOpen,
    HiOutlineChartBar,
    HiOutlineTrendingUp,
    HiOutlineClipboardList,
    HiOutlineStar,
    HiOutlineCheckCircle,
    HiOutlineCalendar,
    HiOutlineLightningBolt,
    HiOutlineSparkles,
} from 'react-icons/hi';

// ── Reusable section divider ────────────────────────────────────────────────
const SectionHeader = ({ icon, title, subtitle }) => (
    <div className="flex items-center gap-4 pt-4">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-black text-base-content tracking-tighter">{title}</h3>
            <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-widest">{subtitle}</p>
        </div>
        <div className="flex-1 h-px bg-base-300 ml-2" />
    </div>
);

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'System Analytics | UniMS';
        api.get('/admin/analytics')
            .then(res => setData(res.data))
            .catch(err => console.error('Error fetching analytics:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <PageLoader message="Gathering University Insights..." />;

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in">
                <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center text-error border border-error/20">
                    <HiOutlineChartBar size={40} />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-black text-base-content tracking-tighter">Analytics Unavailable</h2>
                    <p className="text-base-content/60 text-sm mt-1">We could not retrieve the system data at this moment.</p>
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

    // Grouped bar: Students vs Faculty per department
    const depts = [
        ...new Set([
            ...Object.keys(data?.studentsByDepartment || {}),
            ...Object.keys(data?.facultiesByDepartment || {}),
        ]),
    ];
    const populationData = {
        labels: depts,
        datasets: [
            { label: 'Students', values: data?.studentsByDepartment || {}, color: '#3b82f6' },
            { label: 'Faculty', values: data?.facultiesByDepartment || {}, color: '#ec4899' },
        ],
    };

    return (
        <div className="space-y-8 animate-fade-in">

            {/* Page Header */}
            <div className="flex justify-between items-center bg-base-100 p-8 rounded-[2.5rem] border border-base-300 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary rounded-l-[2.5rem]" />
                <div>
                    <h3 className="text-4xl font-black text-base-content tracking-tighter flex items-center gap-3">
                        University <span className="text-primary italic">Analytics</span>
                    </h3>
                    <p className="text-[10px] font-black text-base-content/70 uppercase tracking-[0.2em] mt-1">
                        Data-Driven Educational Insights
                    </p>
                </div>
                {/* <div className="hidden md:flex items-center gap-6 text-right">
                    <div>
                        <p className="text-3xl font-black text-primary">{data?.totalStudents || 0}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-base-content/40">Students</p>
                    </div>
                    <div className="w-px h-10 bg-base-300" />
                    <div>
                        <p className="text-3xl font-black text-secondary">{data?.totalFaculties || 0}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-base-content/40">Faculty</p>
                    </div>
                    <div className="w-px h-10 bg-base-300" />
                    <div>
                        <p className="text-3xl font-black text-accent">{data?.totalCourses || 0}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-base-content/40">Courses</p>
                    </div>
                </div> */}
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Students', value: data?.totalStudents || 0, icon: <HiOutlineUsers />, color: 'text-primary' },
                    { label: 'Total Faculty', value: data?.totalFaculties || 0, icon: <HiOutlineAcademicCap />, color: 'text-secondary' },
                    { label: 'Departments', value: data?.totalDepartments || 0, icon: <HiOutlineOfficeBuilding />, color: 'text-accent' },
                    { label: 'Total Courses', value: data?.totalCourses || 0, icon: <HiOutlineBookOpen />, color: 'text-info' },
                ].map((stat, i) => (
                    <div key={i} className="stat bg-base-100 border border-base-300 rounded-2xl shadow-sm transition-all hover:shadow-md">
                        <div className={`stat-figure ${stat.color} opacity-30`}>
                            {React.cloneElement(stat.icon, { size: 40 })}
                        </div>
                        <div className="stat-title text-base-content/60 font-medium whitespace-nowrap">{stat.label}</div>
                        <div className={`stat-value ${stat.color} leading-tight text-3xl font-black`}>{stat.value}</div>
                        <div className="stat-desc mt-1 font-medium">System Records</div>
                    </div>
                ))}
            </div>

            {/* SECTION 1 — Activity & Trends */}
            <SectionHeader
                icon={<HiOutlineTrendingUp size={20} />}
                title="Activity & Trends"
                subtitle="Login behaviour and user growth over time"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 flex items-center gap-2 text-base-content/80">
                        <HiOutlineLightningBolt className="text-primary" /> Peak Login Hours
                    </h4>
                    <AreaChart data={data?.loginsByHour || {}} color="#3b82f6" height={260} />
                </div>
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 flex items-center gap-2 text-base-content/80">
                        <HiOutlineUsers className="text-secondary" /> User Registration Trend
                    </h4>
                    <AreaChart data={data?.registrationsByDate || {}} color="#ec4899" height={260} />
                </div>
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 flex items-center gap-2 text-base-content/80">
                        <HiOutlineCalendar className="text-accent" /> Faculty Hiring by Year
                    </h4>
                    <BarChart data={data?.facultyByJoiningYear || {}} color="#f59e0b" height={260} />
                </div>
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 flex items-center gap-2 text-base-content/80">
                        <HiOutlineChartBar className="text-info" /> Average CGPA by Department
                    </h4>
                    <LineChart
                        data={data?.averageCgpaByDepartment || {}}
                        color="#8b5cf6"
                        yDomain={[0, 4.0]}
                        height={260}
                    />
                </div>
            </div>

            {/* SECTION 2 — Department Distribution */}
            <SectionHeader
                icon={<HiOutlineOfficeBuilding size={20} />}
                title="Department Distribution"
                subtitle="How people and resources are spread across departments"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 flex items-center gap-2 text-base-content/80">
                        <HiOutlineChartBar className="text-primary" /> Population by Department
                    </h4>
                    <GroupedBarChart data={populationData} height={260} />
                </div>
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 flex items-center gap-2 text-base-content/80">
                        <HiOutlineBookOpen className="text-accent" /> Courses per Department
                    </h4>
                    <HorizontalBarChart data={data?.coursesByDepartment || {}} color="#10b981" />
                </div>
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 flex items-center gap-2 text-base-content/80">
                        <HiOutlineCalendar className="text-primary" /> Offerings per Department
                    </h4>
                    <BarChart data={data?.offeringsByDepartment || {}} color="#3b82f6" height={260} />
                </div>
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 flex items-center gap-2 text-base-content/80">
                        <HiOutlineStar className="text-warning" /> Avg Faculty Rating by Department
                    </h4>
                    <HorizontalBarChart
                        data={data?.avgFacultyRatingByDepartment || {}}
                        color="#f59e0b"
                        valueFormat={v => v.toFixed(2)}
                    />
                </div>
            </div>

            {/* SECTION 3 — Demographics */}
            <SectionHeader
                icon={<HiOutlineUsers size={20} />}
                title="Demographics"
                subtitle="Gender and status breakdown across user groups"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 text-center text-xs uppercase tracking-widest text-base-content/50">
                        Student Gender
                    </h4>
                    <DonutChart data={data?.studentsByGender || {}} maxSize={190} />
                </div>
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 text-center text-xs uppercase tracking-widest text-base-content/50">
                        Faculty Gender
                    </h4>
                    <DonutChart data={data?.facultiesByGender || {}} maxSize={190} />
                </div>
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 text-center text-xs uppercase tracking-widest text-base-content/50">
                        Student Status
                    </h4>
                    <DonutChart data={data?.studentStatusDistribution || {}} maxSize={190} />
                </div>
            </div>

            {/* SECTION 4 — Course & Enrollment Insights */}
            <SectionHeader
                icon={<HiOutlineClipboardList size={20} />}
                title="Course & Enrollment Insights"
                subtitle="Popularity, capacity fill rate, and enrollment health"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 flex items-center gap-2 text-base-content/80">
                        <HiOutlineTrendingUp className="text-accent" /> Most Popular Courses
                    </h4>
                    <HorizontalBarChart data={data?.enrollmentByCourse || {}} />
                </div>
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 flex items-center gap-2 text-base-content/80">
                        <HiOutlineLightningBolt className="text-warning" />
                        Course Capacity Utilization
                        <span className="ml-auto text-[10px] font-black text-base-content/30 uppercase">% filled</span>
                    </h4>
                    <HorizontalBarChart
                        data={data?.courseCapacityUtilization || {}}
                        color="#f59e0b"
                        valueFormat={v => `${v.toFixed(1)}%`}
                    />
                </div>
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 flex items-center gap-2 text-base-content/80">
                        <HiOutlineCheckCircle className="text-success" /> Enrollment Status Breakdown
                    </h4>
                    <DonutChart data={data?.enrollmentStatusDistribution || {}} maxSize={200} />
                </div>
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 flex items-center gap-2 text-base-content/80">
                        <HiOutlineCalendar className="text-info" /> Offering Status Breakdown
                    </h4>
                    <DonutChart data={data?.offeringStatusDistribution || {}} maxSize={200} />
                </div>
            </div>

            {/* SECTION 5 — Academic Performance */}
            <SectionHeader
                icon={<HiOutlineAcademicCap size={20} />}
                title="Academic Performance"
                subtitle="CGPA distribution, credits earned, and faculty ratings"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 flex items-center gap-2 text-base-content/80">
                        <HiOutlineChartBar className="text-primary" /> Student CGPA Distribution
                    </h4>
                    <BarChart data={data?.cgpaRangeDistribution || {}} color="#8b5cf6" height={260} />
                </div>
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <h4 className="font-bold mb-5 flex items-center gap-2 text-base-content/80">
                        <HiOutlineBookOpen className="text-secondary" /> Student Credits Completed
                    </h4>
                    <BarChart data={data?.creditsDistribution || {}} color="#14b8a6" height={260} />
                </div>
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6 lg:col-span-2">
                    <h4 className="font-bold mb-5 flex items-center gap-2 text-base-content/80">
                        <HiOutlineStar className="text-success" /> Top Rated Faculty
                    </h4>
                    <HorizontalBarChart
                        data={data?.facultyRatings || {}}
                        color="#10b981"
                        valueFormat={v => v.toFixed(1)}
                    />
                </div>
            </div>

            {/* SECTION 6 — Visual Network & Bubble Analysis */}
            <SectionHeader
                icon={<HiOutlineSparkles size={20} />}
                title="Network & Bubble Analysis"
                subtitle="Force-layout visualisations of structure and scale"
            />
            <div className="grid grid-cols-1 gap-6">

                {/* Bubble Chart — students per department */}
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <h4 className="font-bold flex items-center gap-2 text-base-content/80">
                                <HiOutlineChartBar className="text-primary" />
                                Student Population Bubbles
                            </h4>
                            <p className="text-[10px] text-base-content/40 font-bold uppercase tracking-widest mt-1">
                                Bubble size = number of students in that department
                            </p>
                        </div>
                    </div>
                    <BubbleChart data={data?.studentsByDepartment || {}} height={420} />
                </div>

                {/* Force Graph — dept hub → course satellites */}
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6">
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <h4 className="font-bold flex items-center gap-2 text-base-content/80">
                                <HiOutlineOfficeBuilding className="text-secondary" />
                                Department–Course Network
                            </h4>
                            <p className="text-[10px] text-base-content/40 font-bold uppercase tracking-widest mt-1">
                                Each cluster = one department hub connected to its courses
                            </p>
                        </div>
                    </div>
                    <ForceGraph data={data?.departmentCourseMap || {}} height={520} />
                </div>

            </div>

            {/* Footer note */}
            <div className="bg-base-100 border border-base-300 rounded-2xl p-6 flex items-center gap-4">
                <HiOutlineSparkles className="text-primary text-2xl shrink-0" />
                <p className="text-xs text-base-content/50 font-medium">
                    All analytics are computed live from the database on each page load. Data reflects the current state of the system.
                </p>
            </div>

        </div>
    );
};

export default Analytics;