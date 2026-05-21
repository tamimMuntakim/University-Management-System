import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import Swal from 'sweetalert2';
import PageLoader from '../Components/PageLoader';
import { 
    HiOutlineMail, 
    HiOutlineIdentification, 
    HiOutlineSave,
    HiOutlineOfficeBuilding,
    HiOutlineBriefcase,
    HiOutlineStatusOnline
} from 'react-icons/hi';
import { BiMaleFemale } from "react-icons/bi";

const FacultyProfile = () => {
    const [profile, setProfile] = useState({
        email: '',
        facultyStaffId: '',
        designation: '',
        gender: '',
        departmentName: '',
        status: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        document.title = "My Profile | UniMS";
        const fetchProfile = async () => {
            try {
                const response = await api.get('/faculty/profile');
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
            await api.put('/faculty/profile', {
                gender: profile.gender,
                designation: profile.designation
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
        return <PageLoader message="Loading your faculty profile..." />;
    }

    return (
        <div className="w-full space-y-6">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                Faculty Profile
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Summary Card */}
                <div className="lg:col-span-1">
                    <div className="card bg-base-100 border border-base-200 shadow-sm p-6">
                        <div className="flex flex-col items-center">
                            <div className="avatar placeholder mb-4">
                                <div className="bg-primary text-primary-content rounded-full w-24 flex items-center justify-center">
                                    <span className="text-3xl font-bold">
                                        {profile.email?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-base-content">{profile.email?.split('@')[0]}</h2>
                            <p className="text-sm text-base-content/60 mb-4">{profile.designation}</p>
                            
                            <div className="w-full space-y-3 mt-4">
                                <div className="flex items-center gap-3 text-sm p-3 bg-base-200/50 rounded-lg">
                                    <HiOutlineIdentification className="text-primary text-lg" />
                                    <div>
                                        <p className="opacity-50 text-[10px] font-bold uppercase">Staff ID</p>
                                        <p className="font-semibold">{profile.facultyStaffId}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm p-3 bg-base-200/50 rounded-lg">
                                    <HiOutlineOfficeBuilding className="text-primary text-lg" />
                                    <div>
                                        <p className="opacity-50 text-[10px] font-bold uppercase">Department</p>
                                        <p className="font-semibold">{profile.departmentName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm p-3 bg-base-200/50 rounded-lg">
                                    <HiOutlineStatusOnline className="text-primary text-lg" />
                                    <div>
                                        <p className="opacity-50 text-[10px] font-bold uppercase">Work Status</p>
                                        <p className={`font-bold ${profile.status === 'ACTIVE' ? 'text-success' : 'text-warning'}`}>{profile.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form Card */}
                <div className="lg:col-span-2">
                    <div className="card bg-base-100 border border-base-200 shadow-sm p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text flex items-center gap-2 font-bold opacity-70">
                                            <HiOutlineMail /> Email Address
                                        </span>
                                    </label>
                                    <input 
                                        type="email" 
                                        value={profile.email} 
                                        disabled 
                                        className="input input-bordered bg-base-200 cursor-not-allowed font-medium" 
                                    />
                                </div>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text flex items-center gap-2 font-bold opacity-70">
                                            <HiOutlineBriefcase /> Designation
                                        </span>
                                    </label>
                                    <input 
                                        type="text" 
                                        name="designation"
                                        value={profile.designation} 
                                        onChange={handleChange}
                                        className="input input-bordered focus:border-primary font-medium" 
                                    />
                                </div>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text flex items-center gap-2 font-bold opacity-70">
                                            <BiMaleFemale /> Gender
                                        </span>
                                    </label>
                                    <select 
                                        name="gender"
                                        className="select select-bordered focus:border-primary font-medium"
                                        value={profile.gender || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="card-actions justify-end mt-4">
                                <button 
                                    type="submit" 
                                    className={`btn btn-primary px-8 shadow-lg shadow-primary/20 ${saving ? 'loading' : ''}`}
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
    );
};

export default FacultyProfile;
