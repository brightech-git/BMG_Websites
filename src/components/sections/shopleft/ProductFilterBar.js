import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { X, ChevronDown, ChevronUp, RotateCcw, Filter } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { resetFilters } from '../../../redux/slices/filterSlice';
import debounce from 'lodash/debounce';

// Filter options and validation
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
    ],
};

const FILTER_VALIDATION = {
    gender: ['Men', 'Women', 'Kids'],
    occasion: ['DAILY_WEAR', 'WEDDING', 'TRADITIONAL'],
    sizeName: ['2', '2.2', '2.4', '2.6', '2.8', '2.10'],
    colorAccent: ['Silver', 'Gold'],
    materialFinish: ['GOLDCOATED', 'SILVERCOATED'],
    stoneUnit: ['Carat', 'Gram', 'Piece'],
    sortBy: ['relevance', 'price'],
    sortDirection: ['ASC', 'DESC'],
};

const PRICE_RANGE = {
    min: 0,
    max: 100000,
    step: 100,
};

const FILTER_LABELS = {
    gender: 'Gender',
    occasion: 'Occasion',
    sizeName: 'Size',
    colorAccent: 'Color',
    materialFinish: 'Finish',
    stoneUnit: 'Stone Unit',
    priceRange: 'Price',
    sortBy: 'Sort',
};

const CompactFilterBar = ({ onFiltersChange, totalResults = 0, isLoading = false }) => {
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
    const [expandedSections, setExpandedSections] = useState({});
    const [inputValues, setInputValues] = useState({ min: '', max: '' });
    const modalRefs = useRef({});
    const filterRefs = useRef({});
    const priceInputRef = useRef({ min: null, max: null });

    // Filter extraction and validation
    const filters = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);
        const extractedFilters = {
            gender: searchParams.get('gender') || '',
            occasion: searchParams.get('occasion') || '',
            sizeName: searchParams.get('sizeName') || '',
            colorAccent: searchParams.get('colorAccent') || '',
            materialFinish: searchParams.get('materialFinish') || '',
            stoneUnit: searchParams.get('stoneUnit') || '',
            minGrandTotal: searchParams.get('minGrandTotal') || '',
            maxGrandTotal: searchParams.get('maxGrandTotal') || '',
            sortBy: searchParams.get('sortBy') || '',
            sortDirection: searchParams.get('sortDirection') || '',
        };

        const validatedFilters = {};
        Object.entries(extractedFilters).forEach(([key, value]) => {
            if (value && FILTER_VALIDATION[key] && FILTER_VALIDATION[key].includes(value)) {
                validatedFilters[key] = value;
            } else if (value) {
                validatedFilters[key] = value;
            }
        });

        return validatedFilters;
    }, [location.search]);

    // Sync price range with URL parameters
    useEffect(() => {
        const minPrice = Number(filters.minGrandTotal) || PRICE_RANGE.min;
        const maxPrice = Number(filters.maxGrandTotal) || PRICE_RANGE.max;
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            setPriceRange([minPrice, maxPrice]);
            setInputValues({
                min: minPrice === PRICE_RANGE.min ? '' : minPrice.toString(),
                max: maxPrice === PRICE_RANGE.max ? '' : maxPrice.toString(),
            });
        } else {
            setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
            setInputValues({ min: '', max: '' });
        }
    }, [filters.minGrandTotal, filters.maxGrandTotal]);

    // Filter change handlers
    const updateQueryString = useCallback(
        (key, value) => {
            const params = new URLSearchParams(location.search);
            if (value && value !== '') {
                if (FILTER_VALIDATION[key] && !FILTER_VALIDATION[key].includes(value)) {
                    console.warn(`Invalid value for ${key}: ${value}`);
                    return;
                }
                params.set(key, value);
            } else {
                params.delete(key);
            }
            params.delete('page');
            history.push({ search: params.toString() });
            if (onFiltersChange) {
                onFiltersChange(Object.fromEntries(params));
            }
        },
        [location.search, history, onFiltersChange]
    );

    const handleFilterChange = useCallback(
        (key, value) => {
            setLocalFilters((prev) => ({ ...prev, [key]: value }));
            updateQueryString(key, value);
            setActiveModal(null);
            setIsMobileMenuOpen(false);
        },
        [updateQueryString]
    );

    const handleSortChange = useCallback(
        (value) => {
            if (!value) {
                const params = new URLSearchParams(location.search);
                params.delete('sortBy');
                params.delete('sortDirection');
                params.delete('page');
                history.push({ search: params.toString() });
                return;
            }
            const [sortBy, sortDirection] = value.split('_');
            if (FILTER_VALIDATION.sortBy.includes(sortBy) && FILTER_VALIDATION.sortDirection.includes(sortDirection)) {
                const params = new URLSearchParams(location.search);
                params.set('sortBy', sortBy);
                params.set('sortDirection', sortDirection);
                params.delete('page');
                history.push({ search: params.toString() });
                if (onFiltersChange) {
                    onFiltersChange(Object.fromEntries(params));
                }
            }
            setActiveModal(null);
            setIsMobileMenuOpen(false);
        },
        [location.search, history, onFiltersChange]
    );

    const debouncedPriceChange = useCallback(
        debounce((min, max) => {
            const params = new URLSearchParams(location.search);
            if (min > PRICE_RANGE.min) {
                params.set('minGrandTotal', min.toString());
            } else {
                params.delete('minGrandTotal');
            }
            if (max < PRICE_RANGE.max) {
                params.set('maxGrandTotal', max.toString());
            } else {
                params.delete('maxGrandTotal');
            }
            if (min === PRICE_RANGE.min && max === PRICE_RANGE.max) {
                params.delete('minGrandTotal');
                params.delete('maxGrandTotal');
            }
            params.delete('page');
            history.push({ search: params.toString() });
            if (onFiltersChange) {
                onFiltersChange(Object.fromEntries(params));
            }
        }, 300),
        [location.search, history, onFiltersChange]
    );

    const handlePriceChange = useCallback(
        (min, max) => {
            setPriceRange([min, max]);
            debouncedPriceChange(min, max);
        },
        [debouncedPriceChange]
    );

    const handleInputChange = useCallback(
        (type, value) => {
            const numValue = parseInt(value) || (type === 'min' ? PRICE_RANGE.min : PRICE_RANGE.max);
            const clampedValue = Math.max(PRICE_RANGE.min, Math.min(PRICE_RANGE.max, numValue));
            setInputValues((prev) => ({ ...prev, [type]: value }));
            if (type === 'min') {
                handlePriceChange(clampedValue, Math.max(clampedValue + PRICE_RANGE.step, priceRange[1]));
            } else {
                handlePriceChange(Math.min(clampedValue - PRICE_RANGE.step, priceRange[0]), clampedValue);
            }
        },
        [priceRange, handlePriceChange]
    );

    const handleRemoveFilter = useCallback(
        (key) => {
            const params = new URLSearchParams(location.search);
            if (key === 'priceRange' || key === 'minGrandTotal') {
                params.delete('minGrandTotal');
                params.delete('maxGrandTotal');
                setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
                setInputValues({ min: '', max: '' });
            } else {
                params.delete(key);
            }
            if (key === 'sortBy') {
                params.delete('sortDirection');
            }
            params.delete('page');
            history.push({ search: params.toString() });
            setLocalFilters((prev) => {
                const newFilters = { ...prev };
                if (key === 'priceRange' || key === 'minGrandTotal') {
                    delete newFilters.minGrandTotal;
                    delete newFilters.maxGrandTotal;
                } else {
                    delete newFilters[key];
                }
                if (key === 'sortBy') delete newFilters.sortDirection;
                return newFilters;
            });
            if (onFiltersChange) {
                onFiltersChange(Object.fromEntries(params));
            }
        },
        [location.search, history, onFiltersChange]
    );

    const handleClearAll = useCallback(() => {
        history.push({ search: '' });
        setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);
        setInputValues({ min: '', max: '' });
        setLocalFilters({});
        dispatch(resetFilters());
        if (onFiltersChange) {
            onFiltersChange({});
        }
        setIsMobileMenuOpen(false);
    }, [history, onFiltersChange, dispatch]);

    const activeFiltersCount = useMemo(() => {
        return Object.entries(filters).reduce(
            (count, [key, value]) =>
                value && value !== '' && key !== 'sortDirection' && key !== 'maxGrandTotal' ? count + 1 : count,
            0
        );
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
        if (key === 'priceRange' || (key === 'minGrandTotal' && (filters.minGrandTotal || filters.maxGrandTotal))) {
            const minVal = filters.minGrandTotal ? Number(filters.minGrandTotal) : PRICE_RANGE.min;
            const maxVal = filters.maxGrandTotal ? Number(filters.maxGrandTotal) : PRICE_RANGE.max;
            return `${formatCurrency(minVal)} - ${formatCurrency(maxVal)}`;
        }
        if (key === 'sortBy' || key === 'sortDirection' || key === 'maxGrandTotal') return null;
        return value;
    };

    const formatFilterValue = (key, value) => {
        if (key === 'priceRange') {
            const minVal = filters.minGrandTotal ? Number(filters.minGrandTotal) : PRICE_RANGE.min;
            const maxVal = filters.maxGrandTotal ? Number(filters.maxGrandTotal) : PRICE_RANGE.max;
            if (minVal > PRICE_RANGE.min || maxVal < PRICE_RANGE.max) {
                return `${formatCurrency(minVal)} - ${formatCurrency(maxVal)}`;
            }
            return null;
        }
        if (key === 'sortBy') {
            const sortValue = `${value}_${filters.sortDirection}`;
            const option = FILTER_OPTIONS.sortBy.find((opt) => opt.value === sortValue);
            return option ? option.label : value;
        }
        return value;
    };

    useEffect(() => {
        setIsLoaded(true);
        const timer = setTimeout(() => setIsLoaded(false), 300);
        return () => clearTimeout(timer);
    }, [filters]);

    const toggleSection = (key) => {
        setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFilterClick = useCallback(
        (filterKey, event) => {
            if (window.innerWidth <= 768) {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setActiveModal(null);
                return;
            }
            const rect = event.currentTarget.getBoundingClientRect();
            const modalWidth = 240;
            const windowWidth = window.innerWidth;
            let left = rect.left;
            if (left + modalWidth > windowWidth - 10) {
                left = windowWidth - modalWidth - 10;
            }
            setModalPosition({ top: rect.bottom + 4, left });
            setActiveModal(activeModal === filterKey ? null : filterKey);
            setIsMobileMenuOpen(false);
        },
        [activeModal, isMobileMenuOpen]
    );

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

    const PriceRangeSlider = ({ isMobile = false }) => {
        const [localRange, setLocalRange] = useState(priceRange);
        const [isDragging, setIsDragging] = useState(null);
        const sliderRef = useRef(null);

        useEffect(() => {
            setLocalRange(priceRange);
        }, [priceRange]);

        const getHandlePosition = (value) => {
            return ((value - PRICE_RANGE.min) / (PRICE_RANGE.max - PRICE_RANGE.min)) * 100;
        };

        const getValueFromPosition = (clientX, sliderRect) => {
            const relativeX = clientX - sliderRect.left;
            const percentage = Math.max(0, Math.min(1, relativeX / sliderRect.width));
            const value = PRICE_RANGE.min + percentage * (PRICE_RANGE.max - PRICE_RANGE.min);
            return Math.round(value / PRICE_RANGE.step) * PRICE_RANGE.step;
        };

        const handleStart = useCallback((e, handle) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(handle);
        }, []);

        const handleMove = useCallback(
            (e) => {
                if (isDragging === null || !sliderRef.current) return;
                e.preventDefault();
                const rect = sliderRef.current.getBoundingClientRect();
                const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                let newValue = getValueFromPosition(clientX, rect);
                newValue = Math.max(PRICE_RANGE.min, Math.min(PRICE_RANGE.max, newValue));
                const newRange = [...localRange];
                if (isDragging === 0 && newValue < newRange[1] - PRICE_RANGE.step) {
                    newRange[0] = newValue;
                } else if (isDragging === 1 && newValue > newRange[0] + PRICE_RANGE.step) {
                    newRange[1] = newValue;
                }
                setLocalRange(newRange);
            },
            [isDragging, localRange]
        );

        const handleEnd = useCallback(() => {
            if (isDragging !== null) {
                handlePriceChange(localRange[0], localRange[1]);
                setIsDragging(null);
            }
        }, [isDragging, localRange, handlePriceChange]);

        useEffect(() => {
            if (isDragging !== null) {
                const options = { passive: false };
                document.addEventListener('mousemove', handleMove);
                document.addEventListener('mouseup', handleEnd);
                document.addEventListener('touchmove', handleMove, options);
                document.addEventListener('touchend', handleEnd);
                return () => {
                    document.removeEventListener('mousemove', handleMove);
                    document.removeEventListener('mouseup', handleEnd);
                    document.removeEventListener('touchmove', handleMove);
                    document.removeEventListener('touchend', handleEnd);
                };
            }
        }, [isDragging, handleMove, handleEnd]);

        return (
            <div className={`price-range-container ${isMobile ? 'mobile' : ''}`}>
                <div className="price-slider" ref={sliderRef} role="slider" aria-label="Price range slider">
                    <div className="price-track" />
                    <div
                        className="price-range-fill"
                        style={{
                            left: `${getHandlePosition(localRange[0])}%`,
                            width: `${getHandlePosition(localRange[1]) - getHandlePosition(localRange[0])}%`,
                        }}
                    />
                    <div
                        className={`price-handle min-handle ${isDragging === 0 ? 'dragging' : ''}`}
                        style={{ left: `${getHandlePosition(localRange[0])}%` }}
                        onMouseDown={(e) => handleStart(e, 0)}
                        onTouchStart={(e) => handleStart(e, 0)}
                    />
                    <div
                        className={`price-handle max-handle ${isDragging === 1 ? 'dragging' : ''}`}
                        style={{ left: `${getHandlePosition(localRange[1])}%` }}
                        onMouseDown={(e) => handleStart(e, 1)}
                        onTouchStart={(e) => handleStart(e, 1)}
                    />
                </div>
                <div className="price-labels">
                    <span>{formatCurrency(localRange[0])}</span>
                    <span>{formatCurrency(localRange[1])}</span>
                </div>
                {/* <div className="price-inputs">
                    <input
                        ref={(el) => (priceInputRef.current.min = el)}
                        type="number"
                        min={PRICE_RANGE.min}
                        max={localRange[1] - PRICE_RANGE.step}
                        step={PRICE_RANGE.step}
                        value={inputValues.min}
                        onChange={(e) => handleInputChange('min', e.target.value)}
                        onBlur={(e) => !e.target.value && setInputValues((prev) => ({ ...prev, min: '' }))}
                        placeholder="Min"
                        className="price-input"
                    />
                    <span className="price-separator">-</span>
                    <input
                        ref={(el) => (priceInputRef.current.max = el)}
                        type="number"
                        min={localRange[0] + PRICE_RANGE.step}
                        max={PRICE_RANGE.max}
                        step={PRICE_RANGE.step}
                        value={inputValues.max}
                        onChange={(e) => handleInputChange('max', e.target.value)}
                        onBlur={(e) => !e.target.value && setInputValues((prev) => ({ ...prev, max: '' }))}
                        placeholder="Max"
                        className="price-input"
                    />
                </div> */}
            </div>
        );
    };

    return (
        <div className="compact-filter-container">
            <div className="mobile-header">
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle filter menu"
                >
                    <Filter size={16} />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
                </button>
            </div>

            <div className="desktop-filter-row">
                <div className="filter-items">
                    {Object.entries(FILTER_LABELS).map(([key, label]) => {
                        const hasValue = key === 'priceRange' ? filters.minGrandTotal || filters.maxGrandTotal : filters[key];
                        const displayValue = key === 'priceRange' ? formatFilterValue('priceRange') : formatFilterValue(key, filters[key]);
                        return (
                            <div key={key} className="filter-item" ref={(el) => (filterRefs.current[key] = el)}>
                                <button
                                    className={`filter-button ${hasValue ? 'active' : ''}`}
                                    onClick={(e) => handleFilterClick(key, e)}
                                    aria-expanded={activeModal === key}
                                    aria-label={`Filter by ${label}`}
                                >
                                    <span className="filter-label">{label}</span>
                                    {displayValue && <span className="filter-value">{displayValue}</span>}
                                    <ChevronDown size={12} className={`chevron ${activeModal === key ? 'rotated' : ''}`} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="mobile-filter-menu" role="dialog" aria-label="Filter menu">
                    <div className="mobile-menu-header">
                        <h3>Filters</h3>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="close-mobile-menu"
                            aria-label="Close filter menu"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <div className="mobile-filter-grid">
                        {Object.entries(FILTER_LABELS).map(([key, label]) => (
                            <div key={key} className="mobile-filter-section">
                                <button
                                    className="section-toggle"
                                    onClick={() => toggleSection(key)}
                                    aria-expanded={!!expandedSections[key]}
                                    aria-label={`Toggle ${label} filter section`}
                                >
                                    <span>{label}</span>
                                    {expandedSections[key] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                                {expandedSections[key] && (
                                    <div className="mobile-options">
                                        {key === 'priceRange' ? (
                                            <PriceRangeSlider isMobile />
                                        ) : (
                                            <div className="options-grid">
                                                <button
                                                    className={`mobile-option ${!filters[key] ? 'active' : ''}`}
                                                    onClick={() => handleFilterChange(key, '')}
                                                    aria-selected={!filters[key]}
                                                >
                                                    All
                                                </button>
                                                {(key === 'sortBy' ? FILTER_OPTIONS.sortBy : FILTER_OPTIONS[key === 'sizeName' ? 'size' : key] || []).map(
                                                    (option) => {
                                                        const value = typeof option === 'object' ? option.value : option;
                                                        const optionLabel = typeof option === 'object' ? option.label : option;
                                                        return (
                                                            <button
                                                                key={value}
                                                                className={`mobile-option ${filters[key] === value ? 'active' : ''}`}
                                                                onClick={() => (key === 'sortBy' ? handleSortChange(value) : handleFilterChange(key, value))}
                                                                aria-selected={filters[key] === value}
                                                            >
                                                                {optionLabel}
                                                            </button>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {activeFiltersCount > 0 && (
                        <div className="mobile-menu-footer">
                            <button onClick={handleClearAll} className="mobile-clear-all" aria-label="Clear all filters">
                                <RotateCcw size={12} />
                                Clear All
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeFiltersCount > 0 && (
                <div className="active-filters-row">
                    <div className="active-filters">
                        {Object.entries(filters).map(([key, value]) => {
                            if (!value || value === '' || key === 'sortDirection' || key === 'maxGrandTotal') return null;
                            let displayValue;
                            if (key === 'minGrandTotal' && (filters.minGrandTotal || filters.maxGrandTotal)) {
                                displayValue = formatFilterLabel('priceRange');
                                if (filters.maxGrandTotal) return null;
                            } else {
                                displayValue = formatFilterLabel(key, value);
                            }
                            if (!displayValue) return null;
                            return (
                                <div key={key} className="filter-tag">
                                    <span>{displayValue}</span>
                                    <button
                                        onClick={() => handleRemoveFilter(key === 'minGrandTotal' ? 'priceRange' : key)}
                                        className="remove-tag"
                                        aria-label={`Remove ${displayValue} filter`}
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={handleClearAll} className="clear-all-button" aria-label="Clear all filters">
                        <RotateCcw size={10} />
                        <span>Clear</span>
                    </button>
                </div>
            )}

            {activeModal && (
                <div
                    className="filter-modal"
                    style={{ position: 'sticky', top: modalPosition.top, left: modalPosition.left, zIndex: 1000 }}
                    ref={(el) => (modalRefs.current[activeModal] = el)}
                    role="dialog"
                    aria-label={`${FILTER_LABELS[activeModal]} filter options`}
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
                                        aria-selected={!filters[activeModal]}
                                    >
                                        All
                                    </button>
                                    {(activeModal === 'sortBy'
                                        ? FILTER_OPTIONS.sortBy
                                        : FILTER_OPTIONS[activeModal === 'sizeName' ? 'size' : activeModal] || []
                                    ).map((option) => {
                                        const value = typeof option === 'object' ? option.value : option;
                                        const label = typeof option === 'object' ? option.label : option;
                                        return (
                                            <button
                                                key={value}
                                                className={`option-item ${filters[activeModal] === value ? 'active' : ''}`}
                                                onClick={() => (activeModal === 'sortBy' ? handleSortChange(value) : handleFilterChange(activeModal, value))}
                                                aria-selected={filters[activeModal] === value}
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
                    <div className="spinner" />
                    <span>{isLoading ? 'Applying...' : 'Loading...'}</span>
                </div>
            )}

            <style jsx>{`
        .compact-filter-container {
          font-family: 'Inter', sans-serif;
          background: #f6f5f0 !important;
          padding: 8px;
      
          max-width: 100%;
          margin: 0 auto;
        }

        .mobile-header {
          display: none;
          margin-bottom: 8px;
        }

        .mobile-menu-toggle {
          background: #f6f5f0 !important;
          border: 1px solid #d97706;
          color: #d97706;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-menu-toggle:hover {
          background: #cd865c !important;
          color: #ffffff;
        }

        .filter-count {
          background: #ef4444;
          color: #ffffff;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          position: absolute;
          top: -6px;
          right: -6px;
        }

        .desktop-filter-row {
          display: flex;
          align-items: center;
        }

        .filter-items {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          flex: 1;
        }

        .filter-item {
          position: relative;
        }

        .filter-button {
          border: none !important;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 500;
          color: #404040;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 6px;
          max-width: 200px;
          background: none !important ;
        }

       

        .filter-button.active {
          color: #404040;
        }

        .filter-label {
          font-size: 12px;
        }

        .filter-value {
          font-size: 11px;
          opacity: 0.9;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chevron {
          transition: transform 0.2s ease;
        }

        .chevron.rotated {
          transform: rotate(180deg);
        }

        .mobile-filter-menu {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80%;
          background: #ffffff !important;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.15);
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
          border-bottom: 1px solid #e5e7eb;
          background: #ffffff !important;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .mobile-menu-header h3 {
          margin: 0;
          color: #1f2937;
          font-size: 16px;
          font-weight: 600;
        }

        .close-mobile-menu {
          background: none;
          border: none;
          color: #1f2937;
          cursor: pointer;
          padding: 4px;
        }

        .mobile-filter-grid {
          padding: 12px 16px;
        }

        .mobile-filter-section {
          margin-bottom: 12px;
        }

        .section-toggle {
          width: 100%;
          background: none;
          border: none;
          padding: 8px 0;
          font-size: 13px;
          font-weight: 500;
          color: #1f2937;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .mobile-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 6px;
          margin-top: 8px;
        }

        .mobile-option {
          background: #f3f4f6 !important;
          border: 1px solid #e5e7eb;
          color: #1f2937;
          padding: 6px 8px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          min-height: 32px;
        }

        .mobile-option:hover {
          background: #e5e7eb !important;
        }

        .mobile-option.active {
          background: #cd865c !important;
          color: #ffffff;
          border-color: #cd865c;
        }

        .mobile-menu-footer {
          padding: 12px 16px;
          border-top: 1px solid #e5e7eb;
          background: #ffffff !important;
          position: sticky;
          bottom: 0;
        }

        .mobile-clear-all {
          width: 100%;
          background: #ef4444;
          color: #ffffff;
          border: none;
          padding: 8px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-clear-all:hover {
          background: #dc2626;
        }

        .active-filters-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #e5e7eb;
          flex-wrap: wrap;
          gap: 6px;
        }

        .active-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
        }

        .filter-tag {
          border-radius: 12px;
          padding: 4px 8px;
          font-size: 12px;
          color: #202020;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .remove-tag {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .remove-tag:hover {
          color: #ef4444;
        }

        .clear-all-button {
          background: none;
          border: none;
          color: #ef4444;
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
          background: rgba(239, 68, 68, 0.1);
        }

        .filter-modal {
          background: #ffffff !important;
          border-radius: 8px;
          min-width: 150px;
          max-width: 200px;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
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
          margin: 0 0 2px 0;
          color: #1f2937;
          font-size: 14px;
          font-weight: 600;
        }

        .price-modal {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .price-range-container {
          margin: 6px 0;
        }

        .price-slider {
          position: relative;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          margin: 20px 0;
          cursor: pointer;
          user-select: none;
          touch-action: none;
        }

        .price-track {
          position: absolute;
          height: 100%;
          background: #e5e7eb;
          border-radius: 0px;
          width: 100%;
        }

        .price-range-fill {
          position: absolute;
          height: 100%;
          background: #cd865c;
          border-radius: 3px;
          pointer-events: none;
        }

        .price-handle {
          position: absolute;
          width: 16px;
          height: 16px;
          background: #ffffff;
          border: 2px solid #cd865c;
          border-radius: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          cursor: grab;
          z-index: 3;
          transition: all 0.2s ease;
          touch-action: none;
        }

        .price-handle:hover,
        .price-handle.dragging {
          transform: translate(-50%, -50%) scale(1.1);
          cursor: grabbing;
          box-shadow: 0 2px 6px rgba(217, 119, 6, 0.3);
        }

        .price-labels {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 0px;
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: space-between;
          margin-top: 10px;
        }

        .price-input {
          flex: 1;
          padding:0px;
          font-size: 12px;
          background: #ffffff;
          color: #404040;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .price-input:focus {
          border-color: #cd865c;
          box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.1);
        }

        .price-separator {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .option-item {
          background: #f3f4f6 !important;
          border: none;
          padding: 8px 10px;
          border-radius: 6px;
          font-size: 12px;
          color: #1f2937;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .option-item:hover {
          background: #e5e7eb !important;
        }

        .option-item.active {
          background: #cd865c !important;
          color: #ffffff;
        }

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
          gap: 8px;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(217, 119, 6, 0.2);
          border-top-color: #cd865c;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-state span {
          color: #1f2937;
          font-size: 12px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .mobile-header {
            display: flex;
            background: #ffffff !important;
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

          .mobile-options {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .mobile-option {
            border-radius: 0;
            border-bottom: none;
          }

          .mobile-option:first-child {
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
          }

          .mobile-option:last-child {
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            border-bottom: 1px solid #e5e7eb;
          }

          .price-range-container {
            margin: 10px 0;
          }

          .price-slider {
            margin: 16px 0;
            height: 8px;
          }

          .price-handle {
            width: 20px;
            height: 20px;
            border-width: 3px;
          }
        }

        @media (max-width: 576px) {
          .compact-filter-container {
            padding: 6px;
          }

          .mobile-filter-menu {
            height: 85%;
          }

          .mobile-filter-grid {
            padding: 8px 12px;
          }

          .mobile-filter-section {
            margin-bottom: 10px;
          }

          .section-toggle {
            font-size: 12px;
            padding: 6px 0;
          }

          .price-inputs {
            flex-direction: column;
            gap: 6px;
            align-items: stretch;
          }

          .price-inputs span {
            text-align: center;
            order: 1;
          }

          .filter-modal {
            min-width: 200px;
            max-width: 85vw;
          }
        }

        @media (pointer: coarse) {
          .price-handle {
            width: 24px;
            height: 24px;
            border-width: 3px;
          }

          .section-toggle {
            padding: 10px 0;
            font-size: 13px;
          }

          .mobile-option {
            min-height: 40px;
            font-size: 12px;
            padding: 8px;
          }
        }
      `}</style>
        </div>
    );
};

export default CompactFilterBar;