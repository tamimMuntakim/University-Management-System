import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// For future JWT injection
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        if (user.email) {
            config.headers['X-User-Email'] = user.email;
        }
    }
    return config;
});

export default api;
