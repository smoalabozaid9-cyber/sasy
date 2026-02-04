import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL
    ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
    : '/api';

console.log(`%c [API Config] Base URL: ${baseURL}`, 'background: #222; color: #bada55; font-size: 14px');

const api = axios.create({
    baseURL,
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
