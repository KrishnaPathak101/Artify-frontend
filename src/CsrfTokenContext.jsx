// src/contexts/CsrfTokenContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CsrfTokenContext = createContext();

export const CsrfTokenProvider = ({ children }) => {
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('/api/csrf-token');
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
            }
        };

        fetchCsrfToken();
    }, []);

    return (
        <CsrfTokenContext.Provider value={csrfToken}>
            {children}
        </CsrfTokenContext.Provider>
    );
};

export const useCsrfToken = () => useContext(CsrfTokenContext);
