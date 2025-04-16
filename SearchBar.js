import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value);
    };

    return (
        <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={handleChange}
        />
    );
};

export default SearchBar;