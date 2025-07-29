import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import './Search.css';

const ItemSearch = () => {
    const [query, setQuery] = useState('');
    const history = useHistory();

    const handleSearch = () => {
        if (query.trim() === '') return;
        const params = new URLSearchParams();
        params.append('itemName', query.trim());
        history.push(`/shop-left?${params.toString()}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClear = () => {
        setQuery('');
    };

    return (
        <div className="jewel-search-container">
            <input
                type="text"
                className="jewel-input-field"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            {query && (
                <X
                    className="jewel-clear-icon"
                    size={16}
                    onClick={handleClear}
                />
            )}
            <Search
                className="jewel-search-icon"
                size={16}
                onClick={handleSearch}
            />
        </div>
    );
};

export default ItemSearch;