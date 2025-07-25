import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const Pagination = ({ currentPage, pageSize, totalItems }) => {
    const history = useHistory();
    const location = useLocation();
    const totalPages = Math.ceil(totalItems / pageSize) || 1;

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return; // Prevent invalid pages
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('page', newPage);
        history.push({ search: searchParams.toString() });
    };

    return (
        <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={currentPage === i + 1 ? 'active' : ''}
                >
                    {i + 1}
                </button>
            ))}
        </div>
    );
};

export default Pagination;