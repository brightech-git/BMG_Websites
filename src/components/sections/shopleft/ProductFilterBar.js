import React, { useState, useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Collapse, Button, Form, Badge, Row, Col, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Slider from 'rc-slider';
import { Filter, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import 'rc-slider/assets/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductFilterBar.css';

const FILTER_OPTIONS = {
    gender: ['Men', 'Women', 'Kids'],
    occasion: ['Daily Wear', 'Wedding', 'Office', 'Traditional', 'Party'],
    size: ['2', '2.2', '2.4', '2.6', '2.8', '2.10'],
    colorAccent: ['Silver', 'Gold'],
    materialFinish: ['Gold Coated', 'Silver Coated'],
    stoneUnit: ['Carat', 'Gram', 'Piece'],
    sortBy: [
        { label: 'Most Relevant', value: 'relevance_DESC' },
        { label: 'Price – Low to High', value: 'price_ASC' },
        { label: 'Price – High to Low', value: 'price_DESC' },
        
    ]
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

const ProductFilterBar = ({ onFiltersChange, totalResults = 0, isLoading = false }) => {
    const history = useHistory();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [priceRange, setPriceRange] = useState([PRICE_RANGE.min, PRICE_RANGE.max]);

    // Memoized filter extraction from URL
    const filters = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);
        return {
            gender: searchParams.get('gender') || '',
            occasion: searchParams.get('occasion') || '',
            sizeName: searchParams.get('sizeName') || '',
            colorAccent: searchParams.get('colorAccent') || '',
            materialFinish: searchParams.get('materialFinish') || '',
            stoneUnit: searchParams.get('stoneUnit') || '',
            priceRange: searchParams.get('priceRange') || '',
            sortBy: searchParams.get('sortBy') || '',
            sortDirection: searchParams.get('sortDirection') || '',
        };
    }, [location.search]);

    // Initialize price range from URL
    React.useEffect(() => {
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            setPriceRange([min, max]);
        }
    }, [filters.priceRange]);

    const updateQueryString = useCallback((key, value) => {
        const params = new URLSearchParams(location.search);
        if (value && value !== '') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        const newSearch = params.toString();
        history.push({ search: newSearch });

        // Trigger callback for parent component
        if (onFiltersChange) {
            onFiltersChange(Object.fromEntries(params));
        }
    }, [location.search, history, onFiltersChange]);

    const handleFilterChange = useCallback((key, value) => {
        updateQueryString(key, value);
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
        const params = new URLSearchParams(location.search);
        params.set('sortBy', sortBy);
        params.set('sortDirection', sortDirection);
        history.push({ search: params.toString() });

        if (onFiltersChange) {
            onFiltersChange(Object.fromEntries(params));
        }
    }, [location.search, history, onFiltersChange]);

    const handlePriceChange = useCallback((value) => {
        setPriceRange(value);
        const priceValue = value[0] === PRICE_RANGE.min && value[1] === PRICE_RANGE.max
            ? ''
            : value.join('-');
        updateQueryString('priceRange', priceValue);
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

        if (onFiltersChange) {
            onFiltersChange(Object.fromEntries(params));
        }
    }, [location.search, history, onFiltersChange]);

    const handleClearAll = useCallback(() => {
        history.push({ search: '' });
        setPriceRange([PRICE_RANGE.min, PRICE_RANGE.max]);

        if (onFiltersChange) {
            onFiltersChange({});
        }
    }, [history, onFiltersChange]);

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

    return (
        <Card className="filter-bar-container">
            <Card.Body className="p-0">
                {/* Filter Header */}
                <div className="filter-header d-flex justify-content-between align-items-center p-3 border-bottom">
                    <div className="d-flex align-items-center">
                        <Filter size={20} className="me-2 text-primary" />
                        <h6 className="mb-0 fw-semibold">
                            Filters
                            {activeFiltersCount > 0 && (
                                <Badge bg="primary" className="ms-2 rounded-pill">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </h6>
                        {totalResults > 0 && (
                            <span className="text-muted ms-3 small">
                                {totalResults.toLocaleString()} products
                            </span>
                        )}
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        {activeFiltersCount > 0 && (
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={handleClearAll}
                                className="d-flex align-items-center"
                                disabled={isLoading}
                                aria-label="Clear all filters"
                            >
                                <RotateCcw size={14} className="me-1" />
                                Clear All
                            </Button>
                        )}
                        <Button
                            variant="outline-secondary"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="d-lg-none filter-toggle d-flex align-items-center"
                            aria-expanded={!isCollapsed}
                            aria-controls="filter-collapse"
                            aria-label={isCollapsed ? 'Show filters' : 'Hide filters'}
                        >
                            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                            <span className="ms-1">{isCollapsed ? 'Show' : 'Hide'}</span>
                        </Button>
                    </div>
                </div>

                {/* Filter Content */}
                <Collapse in={!isCollapsed} className="d-lg-block filter-container">
                    <div id="filter-collapse" className="p-3 ">
                        {/* Single Row Layout for All Filters */}
                        <div className="filters-single-row d-flex flex-wrap align-items-end gap-2">
                            {/* Price Range Slider */}
                            <div className="filter-item price-range-container">
                                <label className="form-label fw-medium mb-2">
                                    Price Range
                                </label>
                                <div className="price-range-wrapper">
                                    <Slider
                                        range
                                        min={PRICE_RANGE.min}
                                        max={PRICE_RANGE.max}
                                        step={PRICE_RANGE.step}
                                        value={priceRange}
                                        onChange={setPriceRange}
                                        onAfterChange={handlePriceChange}
                                        trackStyle={[{ backgroundColor: '#ffffff', height: 6 }]}
                                        handleStyle={[
                                            {
                                                borderColor: '#ffffff',
                                                backgroundColor: '#fff',
                                                width: 18,
                                                height: 18,
                                                marginTop: -6,
                                                cursor: 'grab'
                                            },
                                            {
                                                borderColor: '#ffffff',
                                                backgroundColor: '#fff',
                                                width: 18,
                                                height: 18,
                                                marginTop: -6,
                                                cursor: 'grab'
                                            }
                                        ]}
                                        railStyle={{ backgroundColor: '#606060', height: 6 }}
                                        disabled={isLoading}
                                        ariaLabelForHandle={['Minimum price', 'Maximum price']}
                                    />
                                    <div className="price-display d-flex justify-content-between mt-1">
                                        <span className="price-label">{formatCurrency(priceRange[0])}</span>
                                        <span className="price-label">{formatCurrency(priceRange[1])}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Gender Dropdown */}
                            <div className="filter-item">
                                <Form.Group>
                                    {/* <Form.Label className="fw-medium">Gender</Form.Label> */}
                                    <Form.Select
                                        value={filters.gender}
                                        onChange={(e) => handleFilterChange('gender', e.target.value)}
                                        disabled={isLoading}
                                        className="filter-select"
                                        aria-label="Filter by gender"
                                    >
                                        <option value="">Gender</option>
                                        {FILTER_OPTIONS.gender.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            {/* Occasion Dropdown */}
                            <div className="filter-item">
                                <Form.Group>
                                    {/* <Form.Label className="fw-medium">Occasion</Form.Label> */}
                                    <Form.Select
                                        value={filters.occasion}
                                        onChange={(e) => handleFilterChange('occasion', e.target.value)}
                                        disabled={isLoading}
                                        className="filter-select"
                                        aria-label="Filter by occasion"
                                    >
                                        <option value="">Occasions</option>
                                        {FILTER_OPTIONS.occasion.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            {/* Size Dropdown */}
                            <div className="filter-item">
                                <Form.Group>
                                    {/* <Form.Label className="fw-medium">Size</Form.Label> */}
                                    <Form.Select
                                        value={filters.sizeName}
                                        onChange={(e) => handleFilterChange('sizeName', e.target.value)}
                                        disabled={isLoading}
                                        className="filter-select"
                                        aria-label="Filter by size"
                                    >
                                        <option value=""> Size</option>
                                        {FILTER_OPTIONS.size.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            {/* Color Accent Dropdown */}
                            <div className="filter-item">
                                <Form.Group>
                                    {/* <Form.Label className="fw-medium">Color Accent</Form.Label> */}
                                    <Form.Select
                                        value={filters.colorAccent}
                                        onChange={(e) => handleFilterChange('colorAccent', e.target.value)}
                                        disabled={isLoading}
                                        className="filter-select"
                                        aria-label="Filter by color accent"
                                    >
                                        <option value="">Color Accent</option>
                                        {FILTER_OPTIONS.colorAccent.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            {/* Material Finish Dropdown */}
                            <div className="filter-item">
                                <Form.Group>
                                  
                                    <Form.Select
                                        value={filters.materialFinish}
                                        onChange={(e) => handleFilterChange('materialFinish', e.target.value)}
                                        disabled={isLoading}
                                        className="filter-select"
                                        aria-label="Filter by material finish"
                                    >
                                        <option value="">Material Finish</option>
                                        {FILTER_OPTIONS.materialFinish.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            {/* Stone Unit Dropdown */}
                            <div className="filter-item">
                                <Form.Group>
                                    {/* <Form.Label className="fw-medium">Stone Unit</Form.Label> */}
                                    <Form.Select
                                        value={filters.stoneUnit}
                                        onChange={(e) => handleFilterChange('stoneUnit', e.target.value)}
                                        disabled={isLoading}
                                        className="filter-select"
                                        aria-label="Filter by stone unit"
                                    >
                                        <option value="">Stone Unit</option>
                                        {FILTER_OPTIONS.stoneUnit.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            {/* Sort By Dropdown */}
                            <div className="filter-item">
                                <Form.Group>
                                    {/* <Form.Label className="fw-medium">Sort By</Form.Label> */}
                                    <Form.Select
                                        value={`${filters.sortBy}_${filters.sortDirection}`}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        disabled={isLoading}
                                        className="filter-select"
                                        aria-label="Sort products"
                                    >
                                        <option value="">Sort By</option>
                                        {FILTER_OPTIONS.sortBy.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>

                        {isLoading && (
                            <div className="text-center py-3 mt-3 border-top">
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <span className="ms-2 text-muted">Applying filters...</span>
                            </div>
                        )}
                    </div>
                </Collapse>

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                    <div className="active-filters border-top p-3">
                        <div className="d-flex flex-wrap gap-2 align-items-center">
                            <small className="text-muted fw-medium me-2">Active Filters:</small>
                            {Object.entries(filters).map(([key, value]) => {
                                if (!value || value === '' || key === 'sortDirection') return null;

                                const displayValue = key === 'sortBy'
                                    ? FILTER_OPTIONS.sortBy.find(opt => opt.value === `${value}_${filters.sortDirection}`)?.label || value
                                    : formatFilterLabel(key, value);

                                if (!displayValue) return null;

                                return (
                                    <OverlayTrigger
                                        key={key}
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-${key}`}>{displayValue}</Tooltip>}
                                    >
                                        <Badge
                                            bg="primary"
                                            className="filter-pill d-flex align-items-center"
                                        >
                                            <span className="text-truncate" style={{ maxWidth: '120px' }}>
                                                {displayValue}
                                            </span>
                                            <Button
                                                variant="link"
                                                className="ms-1 p-0 text-white flex-shrink-0"
                                                onClick={() => handleRemoveFilter(key)}
                                                aria-label={`Remove ${key} filter`}
                                                style={{ fontSize: '0.75rem', lineHeight: 1 }}
                                            >
                                                <X size={12} />
                                            </Button>
                                        </Badge>
                                    </OverlayTrigger>
                                );
                            })}
                        </div>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default ProductFilterBar;