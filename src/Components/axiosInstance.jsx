// src/axiosInstance.jsx
import axios from 'axios';
import { useCsrfToken } from '../CsrfTokenContext';

const useAxiosInstance = () => {
    const csrfToken = useCsrfToken();

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000', // Adjust this to your backend URL
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
        }
    });

    return axiosInstance;
};

export default useAxiosInstance;
