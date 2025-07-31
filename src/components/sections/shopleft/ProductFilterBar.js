import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { X, ChevronDown, ChevronUp, RotateCcw, Filter, Menu } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { resetFilters } from '../../../redux/slices/filterSlice';

// Filter options and validation (unchanged)
const FILTER_OPTIONS = {
    gender: ['Men', 'Women', 'Kids'],
    occasion: ['DAILY_WEAR', 'WEDDING', 'TRADITIONAL'],
    size: ['2', '2.2', '2.4', '2.6', '2.8', '2.10'],
    colorAccent: ['Silver', 'Gold'],
    materialFinish: ['GOLDCOATED', 'SILVERCOATED'],
    stoneUnit: ['Carat', 'Gram', 'Piece'],
    sortBy: [
        { label: 'Most Relevant', value: 'relevance_DESC' },
        { label: 'Price – Low to High', value: 'price_ASC' },
        { label: 'Price – High to Low', value: 'price_DESC' },
    ]
};

const FILTER_VALIDATION = {
    gender: ['Men', 'Women', 'Kids'],
    occasion: ['DAILY_WEAR', 'WEDDING', 'TRADITIONAL'],
    sizeName: ['2', '2.2', '2.4', '2.6', '2.8', '2.10'],
    colorAccent: ['Silver', 'Gold'],
    materialFinish: ['GOLDCOATED', 'SILVERCOATED'],
    stoneUnit: ['Carat', 'Gram', 'Piece'],
    sortBy: ['relevance', 'price'],
    sortDirection: ['ASC', 'DESC']
};

const PRICE_RANGE = {
    min: 0,
    max: 500000,
    step: 1000
};

const FILTER_LABELS = {
    gender: 'Gender',
    occasion: 'Occasion',
    sizeName: 'Size',
    colorAccent: 'Color Accent',
    materialFinish: 'Material Finish',
    stoneUnit: 'Stone Unit',
    priceRange: 'Price Range',
    sortBy: 'Sort By'
};

const ModernFilterBar = ({ onFiltersChange, totalResults = 0, isLoading = false }) => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    // State management
    const [priceRange, setPriceRange] = useState([PRICE_RANGE.min, PRICE_RANGE.max]);
    const [activeModal, setActiveModal] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [expandedSections, setExpandedSections] = useState({}); // New state for collapsible sections
    const modalRefs = useRef({});
    const filterRefs = useRef({});

    // Filter extraction and validation (unchanged)
    const filters = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);
        const extractedFilters = {
            gender: searchParams.get('gender') || '',
            occasion: searchParams.get('occasion') || '',
            sizeName: searchParams.get('sizeName') || '',
            colorAccent: searchParams.get('colorAccent') || '',
            materialFinish: searchParams.get('materialFinish') || '',
            stoneUnit: searchParams.get('stoneUnit') || '',
            priceಸ0priceRange: searchParams.get('priceRange') || '',
            sortBy: searchParams.get('sortBy') || '',
            sortDirection: searchParams.get('sortDirection') || '',
        };

        const validatedFilters = {};
        Object.entries(extractedFilters).forEach(([key, value]) => {
            if (value && FILTER_VALIDATION[key]) {
                if (FILTER_VALIDATION[key].includes(value)) {
                    validatedFilters[key] = value;
                }
            } else if (value) {
                validatedFilters[key] = value;
            }
        });

        return validatedFilters;
    }, [location.search]);

    useEffect(() => {
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                setPriceRange([min, max]);
            }
        }
    }, [filters.priceRange]);

    // Filter change handlers (unchanged)
    const updateQueryString = useCallback((key, value) => {
        const params = new URLSearchParams(location.search);
        if (value && value !== '') {
            if (FILTER_VALIDATION[key]) {
                if (FILTER_VALIDATION[key].includes(value)) {
                    params.set(key, value);
                } else {
                    console.warn(`Invalid value for ${key}: ${value}`);
                    return;
                }
            } else {
                params.set(key, value);
            }
        } else {
            params.delete(key);
        }

        const newSearch = params.toString();
        history.push({ search: newSearch });

        if (onFiltersChange) {
            onFiltersChange(Object.fromEntries(params));
        }
    }, [location.search, history, onFiltersChange]);

    const handleFilterChange = useCallback((key, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value
        }));

        updateQueryString(key, value);
        setActiveModal(null);
        setIsMobileMenuOpen(false);
    }, [updateQueryString]);

    const handleSortChange = useCallback((value) => {
        if (!value) {
            const params = new URLSearchParams(location.search);
            params.delete('sortBy');
            params.delete('sortDirection');
            history.push({ search: params.toString() });
            return;
        }

        const [sortBy, sortDirection] = value.split('_');
        if (FILTER_VALIDATION.sortBy.includes(sortBy) &&
            FILTER_VALIDATION.sortDirection.includes(sortDirection)) {
            const params = new URLSearchParams(location.search);
            params.set('sortBy', sortBy);
            params.set('sortDirection', sortDirection);
            history.push({ search: params.toString() });

            if (onFiltersChange) {
                onFiltersChange(Object.fromEntries(params));
            }
        }
        setActiveModal(null);
        setIsMobileMenuOpen(false);
    }, [location.search, history, onFiltersChange]);

    const handlePriceChange = useCallback((min, max) => {
        const newRange = [min, max];
        setPriceRange(newRange);
        const priceValue = min === PRICE_RANGE.min && max === PRICE_RANGE.max
            ? ''
            : `${min}-${max}`;
        updateQueryString('priceRange', priceValue);
        setActiveModal(null);
        setIsMobileMenuOpen(false);
    }, [updateQueryString]);

    const handleRemoveFilter = useCallback((key) => {
        const params = new URLSearchParams(location.search);
        params.delete(key);

        if (key === 'sortBy') {
            params.delete('sortDirection');
        }

        history.push({ search: params.toString() });

        if (key === 'priceRange') {
            setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
        }

        setLocalFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            if (key === 'sortBy') delete newFilters.sortDirection;
            return newFilters;
        });

        if (onFiltersChange) {
            onFiltersChange(Object.fromEntries(params));
        }
    }, [location.search, history, onFiltersChange]);

    const handleClearAll = useCallback(() => {
        history.push({ search: '' });
        setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
        setLocalFilters({});
        dispatch(resetFilters());
        if (onFiltersChange) {
            onFiltersChange({});
        }
        setIsMobileMenuOpen(false);
    }, [history, onFiltersChange, dispatch]);

    const activeFiltersCount = useMemo(() => {
        return Object.values(filters).filter(value => value && value !== '').length;
    }, [filters]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatFilterLabel = (key, value) => {
        if (key === 'priceRange') {
            const [min, max] = value.split('-');
            return `${formatCurrency(min)} - ${formatCurrency(max)}`;
        }
        if (key === 'sortBy' || key === 'sortDirection') return null;
        return `${FILTER_LABELS[key] || key}: ${value}`;
    };

    useEffect(() => {
        setIsLoaded(true);
        const timer = setTimeout(() => {
            setIsLoaded(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    // Toggle collapsible sections
    const toggleSection = (key) => {
        setExpandedSections(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Modal positioning (unchanged)
    const handleFilterClick = useCallback((filterKey, event) => {
        if (window.innerWidth <= 768) {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            setActiveModal(null);
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const modalWidth = 280;
        const windowWidth = window.innerWidth;

        let left = rect.left;
        if (left + modalWidth > windowWidth - 20) {
            left = windowWidth - modalWidth - 20;
        }

        setModalPosition({
            top: rect.bottom + 8,
            left: left
        });
        setActiveModal(activeModal === filterKey ? null : filterKey);
        setIsMobileMenuOpen(false);
    }, [activeModal, isMobileMenuOpen]);

    // Close modal when clicking outside (unchanged)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeModal && !event.target.closest('.filter-modal') && !event.target.closest('.filter-item')) {
                setActiveModal(null);
            }
            if (isMobileMenuOpen && !event.target.closest('.mobile-filter-menu') && !event.target.closest('.mobile-menu-toggle')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeModal, isMobileMenuOpen]);

    const formatFilterValue = (key, value) => {
        if (key === 'priceRange') {
            const [min, max] = value.split('-');
            return `${formatCurrency(min)} - ${formatCurrency(max)}`;
        }
        if (key === 'sortBy') {
            const option = FILTER_OPTIONS.sortBy.find(opt => opt.value === `${value}_${filters.sortDirection}`);
            return option ? option.label : value;
        }
        return value;
    };

    // Price Range Slider Component (unchanged)
    const PriceRangeSlider = () => {
        const [localRange, setLocalRange] = useState(priceRange);

        const handleMouseDown = (e, handle) => {
            e.preventDefault();
            const slider = e.currentTarget.closest('.price-slider');
            const rect = slider.getBoundingClientRect();
            const startX = e.clientX;
            const startValue = localRange[handle];

            const handleMouseMove = (e) => {
                const deltaX = e.clientX - startX;
                const sliderWidth = rect.width;
                const valueRange = PRICE_RANGE.max - PRICE_RANGE.min;
                const deltaValue = (deltaX / sliderWidth) * valueRange;

                let newValue = startValue + deltaValue;
                newValue = Math.max(PRICE_RANGE.min, Math.min(PRICE_RANGE.max, newValue));
                newValue = Math.round(newValue / PRICE_RANGE.step) * PRICE_RANGE.step;

                const newRange = [...localRange];
                newRange[handle] = newValue;

                if (handle === 0 && newValue >= newRange[1]) return;
                if (handle === 1 && newValue <= newRange[0]) return;

                setLocalRange(newRange);
            };

            const handleMouseUp = () => {
                handlePriceChange(localRange[0], localRange[1]);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        };

        const getHandlePosition = (value) => {
            return ((value - PRICE_RANGE.min) / (PRICE_RANGE.max - PRICE_RANGE.min)) * 100;
        };

        return (
            <div className="price-range-container">
                <div className="price-slider">
                    <div className="price-track"></div>
                    <div
                        className="price-range"
                        style={{
                            left: `${getHandlePosition(localRange[0])}%`,
                            width: `${getHandlePosition(localRange[1]) - getHandlePosition(localRange[0])}%`
                        }}
                    ></div>
                    <div
                        className="price-handle"
                        style={{ left: `${getHandlePosition(localRange[0])}%` }}
                        onMouseDown={(e) => handleMouseDown(e, 0)}
                    ></div>
                    <div
                        className="price-handle"
                        style={{ left: `${getHandlePosition(localRange[1])}%` }}
                        onMouseDown={(e) => handleMouseDown(e, 1)}
                    ></div>
                </div>
                <div className="price-labels">
                    <span>{formatCurrency(localRange[0])}</span>
                    <span>{formatCurrency(localRange[1])}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="modern-filter-container">
            {/* Mobile Menu Toggle */}
            <div className="mobile-header">
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Filter size={18} />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
                </button>
                {/* <div className="results-count mobile-results">
                    <span>{totalResults.toLocaleString()} Products</span>
                </div> */}
            </div>

            {/* Desktop Filter Row */}
            <div className="desktop-filter-row">
                <div className="filter-items">
                    {Object.entries(FILTER_LABELS).map(([key, label]) => (
                        <div key={key} className="filter-item" ref={el => filterRefs.current[key] = el}>
                            <button
                                className={`filter-button ${filters[key] ? 'active' : ''}`}
                                onClick={(e) => handleFilterClick(key, e)}
                            >
                                <span>{label}</span>
                                {filters[key] && <span className="filter-value">{formatFilterValue(key, filters[key])}</span>}
                                <ChevronDown size={14} className={`chevron ${activeModal === key ? 'rotated' : ''}`} />
                            </button>
                        </div>
                    ))}
                </div>
                {/* <div className="results-count desktop-results">
                    <Filter size={14} />
                    <span>{totalResults.toLocaleString()} Products</span>
                </div> */}
            </div>

            {/* Mobile Filter Menu (Bottom Sheet) */}
            {isMobileMenuOpen && (
                <div className="mobile-filter-menu">
                    <div className="mobile-menu-header">
                        <h3>Filters</h3>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="close-mobile-menu">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="mobile-filter-grid">
                        {Object.entries(FILTER_LABELS).map(([key, label]) => (
                            <div key={key} className="mobile-filter-section">
                                <button
                                    className="section-toggle"
                                    onClick={() => toggleSection(key)}
                                >
                                    <span>{label}</span>
                                    {expandedSections[key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                {expandedSections[key] && (
                                    <div className="mobile-options">
                                        {key === 'priceRange' ? (
                                            <PriceRangeSlider />
                                        ) : (
                                            <>
                                                <button
                                                    className={`mobile-option ${!filters[key] ? 'active' : ''}`}
                                                    onClick={() => handleFilterChange(key, '')}
                                                >
                                                    All {label}
                                                </button>
                                                {(key === 'sortBy' ? FILTER_OPTIONS.sortBy :
                                                    FILTER_OPTIONS[key === 'sizeName' ? 'size' : key] || []).map(option => {
                                                        const value = typeof option === 'object' ? option.value : option;
                                                        const optionLabel = typeof option === 'object' ? option.label : option;
                                                        return (
                                                            <button
                                                                key={value}
                                                                className={`mobile-option ${filters[key] === value ? 'active' : ''}`}
                                                                onClick={() => key === 'sortBy' ? handleSortChange(value) : handleFilterChange(key, value)}
                                                            >
                                                                {optionLabel}
                                                            </button>
                                                        );
                                                    })}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {activeFiltersCount > 0 && (
                        <div className="mobile-menu-footer">
                            <button onClick={handleClearAll} className="mobile-clear-all">
                                <RotateCcw size={14} />
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Active Filters Row */}
            {activeFiltersCount > 0 && (
                <div className="active-filters-row">
                    <div className="active-filters">
                        {Object.entries(filters).map(([key, value]) => {
                            if (!value || value === '' || key === 'sortDirection') return null;
                            const displayValue = formatFilterLabel(key, value);
                            if (!displayValue) return null;
                            return (
                                <div key={key} className="filter-tag">
                                    <span>{displayValue}</span>
                                    <button onClick={() => handleRemoveFilter(key)} className="remove-tag">
                                        <X size={12} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={handleClearAll} className="clear-all-button">
                        <RotateCcw size={12} />
                        <span>Clear All</span>
                    </button>
                </div>
            )}

            {/* Desktop Modal */}
            {activeModal && (
                <div
                    className="filter-modal"
                    style={{
                        position: 'fixed',
                        top: modalPosition.top,
                        left: modalPosition.left,
                        zIndex: 1000
                    }}
                    ref={el => modalRefs.current[activeModal] = el}
                >
                    <div className="modal-content">
                        {activeModal === 'priceRange' ? (
                            <div className="price-modal">
                                <h4>Price Range</h4>
                                <PriceRangeSlider />
                            </div>
                        ) : (
                            <div className="options-modal">
                                <h4>{FILTER_LABELS[activeModal]}</h4>
                                <div className="options-list">
                                    <button
                                        className={`option-item ${!filters[activeModal] ? 'active' : ''}`}
                                        onClick={() => handleFilterChange(activeModal, '')}
                                    >
                                        All {FILTER_LABELS[activeModal]}
                                    </button>
                                    {(activeModal === 'sortBy' ? FILTER_OPTIONS.sortBy :
                                        FILTER_OPTIONS[activeModal === 'sizeName' ? 'size' : activeModal] || []).map(option => {
                                            const value = typeof option === 'object' ? option.value : option;
                                            const label = typeof option === 'object' ? option.label : option;
                                            return (
                                                <button
                                                    key={value}
                                                    className={`option-item ${filters[activeModal] === value ? 'active' : ''}`}
                                                    onClick={() => activeModal === 'sortBy' ? handleSortChange(value) : handleFilterChange(activeModal, value)}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(isLoading || isLoaded) && (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <span>{isLoading ? 'Applying filters...' : 'Loading...'}</span>
                </div>
            )}
            <style jsx>
                {`
            .modern-filter-container {
                font-family: 'Montserrat', sans-serif;
                background: #f5f6f0;
                padding: 16px;
              
            }

            /* Mobile Header */
            .mobile-header {
                display: none;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .mobile-menu-toggle {
                background: #ffffff;
                border: 1px solid #cd865c;
                color: #cd865c;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            }

            .mobile-menu-toggle:hover {
                background: #cd865c;
                color: #ffffff;
            }

            .filter-count {
                background: #dc3545;
                color: #ffffff;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: bold;
                position: absolute;
                top: -6px;
                right: -6px;
            }

            .mobile-results {
                display: flex;
                align-items: center;
                gap: 6px;
                color: #404040;
                font-size: 13px;
                font-weight: 500;
            }

            /* Desktop Filter Row */
            .desktop-filter-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .filter-items {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                align-items: center;
                flex: 1;
            }

            .filter-item {
                position: relative;
            }

            .filter-button {
                border:none !important;
                background-color:#f5f6f0;
                padding: 6px 10px;
                font-size: 13px;
                font-weight: 500;
                color: #404040;
                display: flex;
                align-items: center;
                gap: 5px;
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
                max-width: 180px;
            }

          

          
            .filter-value {
                font-size: 11px;
                opacity: 0.8;
                max-width: 70px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .chevron {
                transition: transform 0.2s ease;
                flex-shrink: 0;
            }

            .chevron.rotated {
                transform: rotate(180deg);
            }

            .desktop-results {
                display: flex;
                align-items: center;
                gap: 6px;
                color: #404040;
                font-size: 13px;
                font-weight: 500;
                margin-left: 12px;
            }

            /* Mobile Filter Menu (Bottom Sheet) */
            .mobile-filter-menu {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: 80%;
                background: #ffffff;
                border-top-left-radius: 16px;
                border-top-right-radius: 16px;
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
                overflow-y: auto;
                animation: slideUp 0.3s ease-out;
                z-index: 1000;
            }

            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                }
                to {
                    transform: translateY(0);
                }
            }

            .mobile-menu-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                border-bottom: 1px solid #e9ecef;
                background: #ffffff;
                position: sticky;
                top: 0;
                z-index: 1;
            }

            .mobile-menu-header h3 {
                margin: 0;
                color: #404040;
                font-size: 16px;
                font-weight: 600;
            }

            .close-mobile-menu {
                background: none;
                border: none;
                color: #404040;
                cursor: pointer;
                padding: 4px;
            }

            .mobile-filter-grid {
                padding: 12px 16px;
            }

            .mobile-filter-section {
                margin-bottom: 16px;
            }

            .section-toggle {
                width: 100%;
                background: none;
                border: none;
                padding: 8px 0;
                font-size: 14px;
                font-weight: 500;
                color: #404040;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
            }

            .mobile-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                gap: 6px;
                margin-top: 8px;
            }

            .mobile-option {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                color: #404040;
                padding: 8px 10px;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: center;
                min-height: 36px;
            }

            .mobile-option:hover {
                background: #e9ecef;
            }

            .mobile-option.active {
                background: #cd865c;
                color: #ffffff;
                border-color: #cd865c;
            }

            .mobile-menu-footer {
                padding: 12px 16px;
                border-top: 1px solid #e9ecef;
                background: #ffffff;
                position: sticky;
                bottom: 0;
            }

            .mobile-clear-all {
                width: 100%;
                background: #dc3545;
                color: #ffffff;
                border: none;
                padding: 10px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .mobile-clear-all:hover {
                background: #c82333;
            }

            /* Active Filters Row */
            .active-filters-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid #e9ecef;
            }

            .active-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                align-items: center;
            }

            .filter-tag {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 12px;
                padding: 4px 8px;
                font-size: 11px;
                color: #404040;
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .remove-tag {
                background: none;
                border: none;
                color: #6c757d;
                cursor: pointer;
                padding: 0;
                display: flex;
                align-items: center;
            }

            .remove-tag:hover {
                color: #dc3545;
            }

            .clear-all-button {
                background: none;
                border: none;
                color: #dc3545;
                font-size: 12px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 4px;
                cursor: pointer;
                padding: 4px 6px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }

            .clear-all-button:hover {
                background: rgba(220, 53, 69, 0.1);
            }

            /* Filter Modal */
            .filter-modal {
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                min-width: 240px;
                max-width: 280px;
                animation: fadeIn 0.2s ease-out;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .modal-content {
                padding: 12px;
            }

            .modal-content h4 {
                margin: 0 0 12px 0;
                color: #404040;
                font-size: 14px;
                font-weight: 600;
            }

            .price-modal {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .price-slider {
                position: relative;
                height: 4px;
                background: #e9ecef;
                border-radius: 2px;
                margin: 20px 0;
            }

            .price-track {
                position: absolute;
                height: 100%;
                background: #e9ecef;
                border-radius: 2px;
                width: 100%;
            }

            .price-range {
                position: absolute;
                height: 100%;
                background: #cd865c;
                border-radius: 2px;
            }

            .price-handle {
                position: absolute;
                width: 14px;
                height: 14px;
                background: #ffffff;
                border: 2px solid #cd865c;
                border-radius: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                cursor: pointer;
                z-index: 2;
            }

            .price-handle:hover {
                transform: translate(-50%, -50%) scale(1.1);
            }

            .price-labels {
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                color: #6c757d;
                margin-top: 8px;
            }

            .options-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .option-item {
                background: none;
                border: none;
                padding: 6px 10px;
                border-radius: 6px;
                font-size: 12px;
                color: #404040;
                text-align: left;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .option-item:hover {
                background: #f8f9fa;
            }

            .option-item.active {
                background: #cd865c;
                color: #ffffff;
            }

            /* Loading State */
            .loading-state {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.8);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                gap: 12px;
            }

            .spinner {
                width: 32px;
                height: 32px;
                border: 3px solid rgba(205, 134, 92, 0.2);
                border-top-color: #cd865c;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }

            .loading-state span {
                color: #404040;
                font-size: 14px;
                font-weight: 500;
            }

            /* Responsive Styles */
            @media (max-width: 768px) {
                .mobile-header {
                    display: flex;
                }

                .desktop-filter-row {
                    display: none;
                }

                .active-filters-row {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                }

                .clear-all-button {
                    margin-top: 6px;
                }
            }

            @media (max-width: 576px) {
                .mobile-filter-menu {
                    height: 85%;
                }

                .mobile-filter-grid {
                    padding: 8px 12px;
                }

                .mobile-filter-section {
                    margin-bottom: 12px;
                }

                .section-toggle {
                    font-size: 13px;
                }

                .mobile-options {
                    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
                    gap: 4px;
                }

                .mobile-option {
                    font-size: 11px;
                    padding: 6px 8px;
                    min-height: 32px;
                }
            }
        `}
            </style>
        </div>
       
    );
};

export default ModernFilterBar;