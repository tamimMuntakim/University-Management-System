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
        <div className="min-h-screen flex items-center justify-center bg-base-200 relative">
            <div className="absolute top-4 right-4 animate-fade-in">
                <ThemeToggle />
            </div>
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl font-bold mb-4">University Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input 
                                type="email" 
                                placeholder="email@university.edu" 
                                className="input input-bordered w-full" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control w-full mt-4">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder="password" 
                                className="input input-bordered w-full" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="card-actions justify-center mt-6">
                            <button type="submit" className="btn btn-primary w-full shadow-lg">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
