import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import Swal from 'sweetalert2';
import PageLoader from '../Components/PageLoader';
import { 
    HiOutlineUser, 
    HiOutlineMail, 
    HiOutlineIdentification, 
    HiOutlineCalendar,
    HiOutlineSave,
    HiOutlineOfficeBuilding,
    HiOutlineTranslate
} from 'react-icons/hi';
import { BiMaleFemale } from "react-icons/bi";

const StudentProfile = () => {
    const [profile, setProfile] = useState({
        email: '',
        studentRegId: '',
        gender: '',
        enrollmentSemester: '',
        departmentName: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        document.title = "My Profile | UniMS";
        const fetchProfile = async () => {
            try {
                // We'll use a combined approach or separate calls. 
                // Let's assume the stats endpoint gave us some info, but we also want a dedicated profile endpoint.
                const response = await api.get('/student/profile');
                // The profile endpoint we made in controller returns Map with user email and profile details
                setProfile(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile:", error);
                Swal.fire('Error', 'Failed to load profile data', 'error');
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/student/profile', {
                gender: profile.gender
            });
            Swal.fire({
                title: 'Success!',
                text: 'Profile updated successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            Swal.fire('Error', 'Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <PageLoader message="Loading your student profile..." />;
    }

    return (
        <div className="w-full space-y-6">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                My Profile
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Summary Card */}
                <div className="lg:col-span-1">
                    <div className="card bg-base-100 border border-base-300 shadow-sm p-6">
                        <div className="flex flex-col items-center">
                            <div className="avatar placeholder mb-4">
                                <div className="bg-primary text-primary-content rounded-full w-24 flex items-center justify-center">
                                    <span className="text-3xl font-bold">
                                        {profile.email?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <h4 className="font-bold text-lg">{profile.email?.split('@')[0]}</h4>
                            <p className="text-sm text-base-content/60">{profile.email}</p>
                            <div className="flex justify-center w-full mt-2">
                                <div className="badge badge-success font-bold">Active Student</div>
                            </div>
                        </div>
                        
                        <div className="divider text-xs text-base-content/40 uppercase tracking-widest font-bold">Overview</div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl">
                                <HiOutlineIdentification className="text-primary text-xl" />
                                <div>
                                    <p className="text-xs text-base-content/50 font-bold uppercase">Reg ID</p>
                                    <p className="font-semibold">{profile.studentRegId}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl">
                                <HiOutlineOfficeBuilding className="text-primary text-xl" />
                                <div>
                                    <p className="text-xs text-base-content/50 font-bold uppercase">Department</p>
                                    <p className="font-semibold">{profile.departmentName || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl">
                                <HiOutlineCalendar className="text-primary text-xl" />
                                <div>
                                    <p className="text-xs text-base-content/50 font-bold uppercase">Joined</p>
                                    <p className="font-semibold">{profile.enrollmentSemester || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form Card */}
                <div className="lg:col-span-2">
                    <div className="card bg-base-100 border border-base-300 shadow-sm">
                        <div className="card-body">
                            <h4 className="card-title text-base-content/80 mb-4 font-bold">Account Settings</h4>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text font-semibold flex items-center gap-2">
                                                <HiOutlineMail /> Email Address
                                            </span>
                                        </label>
                                        <input 
                                            type="text" 
                                            className="input input-bordered bg-base-200 cursor-not-allowed w-full" 
                                            value={profile.email || ''} 
                                            readOnly 
                                        />
                                        <label className="label">
                                            <span className="label-text-alt text-base-content/50 italic">Primary email cannot be changed</span>
                                        </label>
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text font-semibold flex items-center gap-2">
                                                <HiOutlineIdentification /> Registration ID
                                            </span>
                                        </label>
                                        <input 
                                            type="text" 
                                            className="input input-bordered bg-base-200 cursor-not-allowed w-full" 
                                            value={profile.studentRegId || ''} 
                                            readOnly 
                                        />
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text font-semibold flex items-center gap-2">
                                                <BiMaleFemale /> Gender
                                            </span>
                                        </label>
                                        <select 
                                            name="gender" 
                                            value={profile.gender || ''} 
                                            onChange={handleChange}
                                            className="select select-bordered w-full"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text font-semibold flex items-center gap-2">
                                                <HiOutlineCalendar /> Enrollment Semester
                                            </span>
                                        </label>
                                        <input 
                                            type="text" 
                                            className="input input-bordered bg-base-200 cursor-not-allowed w-full" 
                                            value={profile.enrollmentSemester || ''} 
                                            readOnly 
                                        />
                                    </div>
                                </div>

                                <div className="card-actions justify-end mt-6">
                                    <button 
                                        type="submit" 
                                        className={`btn btn-primary gap-2 ${saving ? 'loading' : ''}`}
                                        disabled={saving}
                                    >
                                        {!saving && <HiOutlineSave className="text-lg" />}
                                        {saving ? 'Saving...' : 'Update Profile'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
