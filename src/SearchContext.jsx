// src/SearchContext.js
import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');

    return (
        <SearchContext.Provider value={{category, setCategory, searchTerm, setSearchTerm }}>
            {children}
        </SearchContext.Provider>
    );
};
