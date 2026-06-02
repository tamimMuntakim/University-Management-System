import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../Providers/AuthProvider';
import api from '../Services/api';
import Swal from 'sweetalert2';
import ThemeToggle from '../Components/ThemeToggle';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Login | UniMS";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            const userData = response.data;
            login(userData);
            
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                timer: 1500
            });

            // Redirect based on role
            if (userData.role === 'ROLE_ADMIN') navigate('/admin');
            else if (userData.role === 'ROLE_FACULTY') navigate('/faculty');
            else navigate('/student');
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Invalid credentials'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse"></div>

            <div className="absolute top-8 right-8 animate-fade-in z-20">
                <ThemeToggle />
            </div>

            <div className="card w-full max-w-md bg-base-100/70 backdrop-blur-xl border border-white/20 shadow-2xl relative z-10 m-4 rounded-2xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient-x"></div>
                <div className="card-body p-8 md:p-12">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <span className="text-white text-3xl font-black italic">U</span>
                        </div>
                        <h2 className="text-3xl font-black text-base-content tracking-tighter">Portal Access</h2>
                        <p className="text-base-content/50 text-sm font-medium mt-2">Enter your institutional credentials</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">Email Identifier</label>
                            <input 
                                type="email" 
                                placeholder="name@university.edu" 
                                className="input bg-base-200/50 border-base-300 w-full rounded-2xl h-14 font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-base-content/40 ml-1">Secure Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                className="input bg-base-200/50 border-base-300 w-full rounded-2xl h-14 font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full h-14 rounded-2xl border-none shadow-xl shadow-primary/30 text-lg font-black tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Sign In to Dashboard
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
