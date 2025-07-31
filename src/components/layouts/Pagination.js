import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './pagination.css';

const Pagination = ({ currentPage, pageSize, totalItems, onPageChange }) => {
    const location = useLocation();
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const maxPagesToShow = 5; // Number of page buttons to display at once

    // Calculate the range of pages to display
    const getPageRange = () => {
        const halfMax = Math.floor(maxPagesToShow / 2);
        let start = Math.max(0, currentPage - halfMax);
        let end = Math.min(totalPages - 1, start + maxPagesToShow - 1);

        // Adjust start if end is at the max to ensure maxPagesToShow
        if (end - start + 1 < maxPagesToShow) {
            start = Math.max(0, end - maxPagesToShow + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const pages = getPageRange();

    // Handle navigation with query params
    const getPageLink = (page) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page);
        return `${location.pathname}?${params.toString()}`;
    };

    // Prevent unnecessary navigation if already on the page
    const handlePageClick = (e, page) => {
        if (page === currentPage || page < 0 || page >= totalPages) {
            e.preventDefault();
            return;
        }
        onPageChange(page);
    };

    return (
        <nav aria-label="Product pagination">
            <ul className="pagination justify-content-center mb-4">
                {/* Previous Button */}
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <Link
                        className="page-link"
                        to={getPageLink(currentPage - 1)}
                        onClick={(e) => handlePageClick(e, currentPage - 1)}
                        aria-label="Previous page"
                        tabIndex={currentPage === 0 ? -1 : 0}
                    >
                        <span aria-hidden="true">&laquo;</span>
                    </Link>
                </li>

                {/* Page Numbers */}
                {pages[0] > 0 && (
                    <>
                        <li className="page-item">
                            <Link
                                className="page-link"
                                to={getPageLink(0)}
                                onClick={(e) => handlePageClick(e, 0)}
                                aria-label="Page 1"
                            >
                                1
                            </Link>
                        </li>
                        {pages[0] > 1 && (
                            <li className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        )}
                    </>
                )}

                {pages.map((page) => (
                    <li
                        key={page}
                        className={`page-item ${page === currentPage ? 'active' : ''}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                    >
                        <Link
                            className="page-link"
                            to={getPageLink(page)}
                            onClick={(e) => handlePageClick(e, page)}
                            aria-label={`Page ${page + 1}`}
                        >
                            {page + 1}
                        </Link>
                    </li>
                ))}

                {pages[pages.length - 1] < totalPages - 1 && (
                    <>
                        {pages[pages.length - 1] < totalPages - 2 && (
                            <li className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        )}
                        <li className="page-item">
                            <Link
                                className="page-link"
                                to={getPageLink(totalPages - 1)}
                                onClick={(e) => handlePageClick(e, totalPages - 1)}
                                aria-label={`Page ${totalPages}`}
                            >
                                {totalPages}
                            </Link>
                        </li>
                    </>
                )}

                {/* Next Button */}
                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <Link
                        className="page-link"
                        to={getPageLink(currentPage + 1)}
                        onClick={(e) => handlePageClick(e, currentPage + 1)}
                        aria-label="Next page"
                        tabIndex={currentPage === totalPages - 1 ? -1 : 0}
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;