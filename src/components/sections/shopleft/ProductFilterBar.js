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
    // { label: 'Most Relevant', value: 'relevance_DESC' },
    { label: 'Price – Low to High', value: 'priceLowToHigh_ASC' },
    { label: 'Price – High to Low', value: 'priceHighToLow_DESC' },
  ],
  sortDirection : ['ASC', 'DESC'],
};

const FILTER_VALIDATION = {
  gender: ['Men', 'Women', 'Kids'],
  occasion: ['DAILY_WEAR', 'WEDDING', 'TRADITIONAL'],
  sizeName: ['2', '2.2', '2.4', '2.6', '2.8', '2.10'],
  colorAccent: ['Silver', 'Gold'],
  materialFinish: ['GOLDCOATED', 'SILVERCOATED'],
  stoneUnit: ['Carat', 'Gram', 'Piece'],
  sortBy: ['priceLowToHigh', 'priceHighToLow'],
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

const UnifiedFilterBar = ({ onFiltersChange, totalResults = 0, isLoading = false }) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // State management
  const [priceRange, setPriceRange] = useState([PRICE_RANGE.min, PRICE_RANGE.max]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    gender: true,
    occasion: true,
    sizeName: true,
    colorAccent: true,
    materialFinish: true,
    stoneUnit: true,
    priceRange: true,
    sortBy: true,
  });
  const [inputValues, setInputValues] = useState({ min: '', max: '' });
  const priceInputRef = useRef({ min: null, max: null });
  const searchParams = new URLSearchParams(location.search);
  const itemName = searchParams.get('itemName') || '';

  useEffect(() => {
    // Normalize item name: lowercase + singular
    const normalizedName = itemName?.toLowerCase().trim();

    // Allow both singular & plural (ring/rings, bangle/bangles)
    const shouldShowSize = ['ring', 'rings', 'bangle', 'bangles'].includes(normalizedName);

    setExpandedSections((prev) => ({
      ...prev,
      sizeName: shouldShowSize,
    }));
  }, [itemName]);

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

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => setIsLoaded(false), 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterPanelOpen && !event.target.closest('.filter-panel') && !event.target.closest('.filter-toggle-btn')) {
        setIsFilterPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterPanelOpen]);

  // Prevent body scroll when filter panel is open
  useEffect(() => {
    if (isFilterPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFilterPanelOpen]);

  const PriceRangeSlider = () => {
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
      <div className="price-range-container">
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
      </div>
    );
  };

  return (
    <>
      {/* Filter Toggle Button */}
      <div className="filter-container">
        <div className="filter-head">
          <button
            className="filter-toggle-btn"
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            aria-label="Toggle filter panel"
          >
            <Filter size={18} />
            <span>Filters</span>
            {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
          </button>
          {activeFiltersCount > 0 && (
            <button onClick={handleClearAll} className="clear-all-button" aria-label="Clear all filters">
              <RotateCcw size={12} />
              <span>Clear All</span>
            </button>
          )}
        </div>
        {/* Active Filters Row */}
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
                      <X size={12}  />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isFilterPanelOpen && <div className="filter-overlay" onClick={() => setIsFilterPanelOpen(false)} />}

      {/* Filter Panel */}
      <div className={`filter-panel ${isFilterPanelOpen ? 'open' : ''}`} role="dialog" aria-label="Filter panel">
        <div className="filter-panel-header">
          <h3 style={{ fontFamily: 'var(--title-font)' }}>Filters</h3>
          <button
            onClick={() => setIsFilterPanelOpen(false)}
            className="close-panel-btn"
            aria-label="Close filter panel"
          >
            <X size={20} />
          </button>
        </div>

        <div className="filter-panel-content">
          {Object.entries(FILTER_LABELS).map(([key, label]) => {
            // Hide "sizeName" filter unless itemName is ring/bangle
            const normalizedName = itemName?.toLowerCase().trim();
            const shouldShowSize = ['ring', 'rings', 'bangle', 'bangles'].includes(normalizedName);

            if (key === 'sizeName' && !shouldShowSize) {
              return null; // 👈 skip rendering size filter
            }

            return (
              <div key={key} className="filter-section">
                <button
                  className="section-toggle"
                  onClick={() => toggleSection(key)}
                  aria-expanded={!!expandedSections[key]}
                  aria-label={`Toggle ${label} filter section`}
                  style={{ fontFamily: 'var(--secondary-font)' }}
                >
                  <span style={{ color: 'var(--primary-text-color)' }}>{label}</span>
                  {expandedSections[key] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {expandedSections[key] && (
                  <div className="filter-options">
                    {key === 'priceRange' ? (
                      <PriceRangeSlider />
                    ) : (
                      <div className="options-grid">
                        {(key === 'sortBy'
                          ? FILTER_OPTIONS.sortBy
                          : FILTER_OPTIONS[key === 'sizeName' ? 'size' : key] || []
                        ).map((option) => {
                          const value = typeof option === 'object' ? option.value : option;
                          const optionLabel = typeof option === 'object' ? option.label : option;
                          const isChecked =
                            filters[key] === value ||
                            (key === 'sortBy' && `${filters[key]}_${filters.sortDirection}` === value);

                          return (
                            <label key={value} className="filter-option">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() =>
                                  key === 'sortBy'
                                    ? handleSortChange(isChecked ? '' : value)
                                    : handleFilterChange(key, isChecked ? '' : value)
                                }
                                className="filter-checkbox"
                              />
                              <span className="filter-label">{optionLabel}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

        </div>

        {activeFiltersCount > 0 && (
          <div className="filter-panel-footer">
            <button onClick={handleClearAll} className="clear-all-footer-btn" aria-label="Clear all filters">
              <RotateCcw size={14} />
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {(isLoading || isLoaded) && (
        <div className="loading-state">
          {/* <div className="spinner" />
          <span>{isLoading ? 'Applying...' : 'Loading...'}</span> */}
        </div>
      )}

      <style>{`
        .filter-container {
          background: var(--primary-color);
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          position: relative;
          top: 0;
          z-index: 10;
        }

        .filter-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .filter-toggle-btn {
          background: var(--primary-card-color);
          border: 2px solid var(--primary-hover-color);
          color: var(--primary-hover-color);
          padding: 0.75rem 1.25rem;
          border-radius: 1.5rem;
          font-family: var(--secondary-font);
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .filter-toggle-btn:hover {
          background: var(--primary-hover-color);
          color: var(--primary-color);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .filter-count {
          background: #ef4444;
          color: var(--primary-color);
          border-radius: 50%;
          width: 1.25rem;
          height: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6875rem;
          font-weight: 700;
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
        }

        .active-filters-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  flex-direction: column;
  gap: 0.5rem;
}

        .active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
}

        .filter-tag {
          background: var(--primary-card-color);
          border: 1px solid var(--primary-hover-color);
          border-radius: 1rem;
          padding: 0.375rem 0.75rem;
          font-family: var(--secondary-font);
          font-size: 0.75rem;
          color: var(--primary-text-color);
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-weight: 500;
        }

        .remove-tag {
          background: none;
          border: none;
          color: var(--primary-hover-color) !important;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }

        .remove-tag:hover {
          opacity: 1;
        }

        .clear-all-button {
          background: none;
          border: none;
          color: #ef4444;
          font-family: var(--secondary-font);
          font-size: 0.8125rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          cursor: pointer;
          padding: 0.375rem 0.75rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }

        .clear-all-button:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .filter-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(2px);
          z-index: 999;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .filter-panel {
          position: fixed;
          top: 0;
          left: -400px;
          width: 380px;
          height: 100vh;
          background: var(--primary-color);
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
        }

        .filter-panel.open {
          left: 0;
        }

        .filter-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .filter-panel-header h3 {
          margin: 0 auto;
          color: var(--primary-text-color);
          font-size: 2rem;
          font-weight: bolder;
          font-family: var(--title-font);
          background: var(--gradient-text);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
        }

        .close-panel-btn {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          transition: all 0.2s ease;
        }

        .close-panel-btn:hover {
          background: #e5e7eb;
          color: var(--primary-text-color);
        }

        .filter-panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 0;
        }

        .filter-section {
          border-bottom: 1px solid #f1f5f9;
        }

        .section-toggle {
          width: 90%;
          background: none;
          border: none;
          padding: 0.55rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          color: var(--primary-text-color);
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .section-toggle:hover {
          background: var(--secondary-card-color);
        }

        .filter-options {
          display: flex;
          justify-content: center;
        }

        .options-grid {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 300px;
          padding: 0.5rem 2rem;
        }

        .filter-option {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 0.5rem;
          font-family: var(--secondary-font);
          font-size: 0.875rem;
          color: var(--primary-text-color);
          cursor: pointer;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
        }

        .filter-checkbox {
          width: 1.25rem;
          height: 1.25rem;
          accent-color: var(--primary-hover-color);
          cursor: pointer;
        }

        .filter-checkbox:checked + .filter-label {
          color: var(--primary-hover-color);
          font-weight: 400;
        }

        .filter-label {
          flex: 1;
          text-align: left;
        }

        .filter-panel-footer {
          padding: 1.25rem 1.5rem;
          border-top: 1px solid #e5e7eb;
          background: var(--secondary-card-color);
        }

        .clear-all-footer-btn {
          width: 100%;
          background: #ef4444;
          color: var(--primary-color);
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-family: var(--secondary-font);
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-all-footer-btn:hover {
          background: #dc2626;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(239, 68, 68, 0.2);
        }

        /* Price Range Slider Styles */
        .price-range-container {
          margin: 1rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .price-slider {
          position: relative;
          height: 0.5rem;
          background: #e5e7eb;
          border-radius: 0.25rem;
          margin: 1.5rem 0;
          cursor: pointer;
          user-select: none;
          touch-action: none;
          width: 100%;
          max-width: 300px;
        }

        .price-track {
          position: absolute;
          height: 100%;
          background: #e5e7eb;
          border-radius: 0.25rem;
          width: 100%;
        }

        .price-range-fill {
          position: absolute;
          height: 100%;
          background: var(--primary-hover-color);
          border-radius: 0.25rem;
          pointer-events: none;
        }

        .price-handle {
          position: absolute;
          width: 1.25rem;
          height: 1.25rem;
          background: var(--primary-card-color);
          border: 3px solid var(--primary-hover-color);
          border-radius: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          cursor: grab;
          z-index: 3;
          transition: all 0.2s ease;
          touch-action: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .price-handle:hover,
        .price-handle.dragging {
          transform: translate(-50%, -50%) scale(1.1);
          cursor: grabbing;
          box-shadow: 0 4px 8px rgba(205, 134, 92, 0.4);
        }

        .price-labels {
          display: flex;
          justify-content: space-between;
          font-family: var(--secondary-font);
          font-size: 0.8125rem;
          color: #6b7280;
          font-weight: 600;
          margin-top: 0.5rem;
          width: 100%;
          max-width: 300px;
        }

        .loading-state {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          gap: 0.75rem;
          backdrop-filter: blur(2px);
        }

        .spinner {
          width: 2rem;
          height: 2rem;
          border: 4px solid rgba(205, 134, 92, 0.2);
          border-top-color: var(--primary-hover-color);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-state span {
          color: var(--primary-text-color);
          font-family: var(--secondary-font);
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .filter-panel {
            width: 320px;
          }

          .filter-container {
            padding: 0.75rem 1rem;
          }

          .filter-toggle-btn {
            padding: 0.5rem 1rem;
            font-size: 0.8125rem;
          }

          .filter-panel-header {
            padding: 1rem;
          }

          .filter-panel-header h3 {
            font-size: 1.5rem;
            text-align: center;
            margin: 0 auto;
          }

          .section-toggle {
            padding: 0.55rem 1rem !important;
            font-size: 0.9375rem;
            margin-bottom: 0 !important;
          }

          .filter-options {
            padding: 0rem;
          }

          .options-grid {
            gap: 0rem;
          }

          .filter-option {
            padding: 0.4rem 2rem;
            font-size: 0.875rem;
          }

          .filter-panel-footer {
            padding: 1rem 1.25rem;
          }

          .price-slider {
            max-width: 280px;
          }

          .price-labels {
            max-width: 280px;
          }
        }

        @media (max-width: 480px) {
          .filter-panel {
            width: 280px;
          }

          .filter-container {
            padding: 0.5rem 0.75rem;
          }

          .filter-toggle-btn {
            padding: 0.375rem 0.75rem;
            font-size: 0.75rem;
          }

          .filter-count {
            width: 1.125rem;
            height: 1.125rem;
            font-size: 0.625rem;
          }

         .active-filters {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
  }
  
  .filter-tag {
    margin: 0;
    justify-content: space-between;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

          .active-filters-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .clear-all-button {
            margin-top: 0.25rem;
            align-self: flex-start;
          }

          .price-handle {
            width: 1.5rem;
            height: 1.5rem;
            border-width: 4px;
          }

          .price-slider {
            max-width: 240px;
          }

          .price-labels {
            max-width: 240px;
          }
        }

        @media (pointer: coarse) {
          .price-handle {
            width: 1.75rem;
            height: 1.75rem;
            border-width: 4px;
          }

          .section-toggle {
            font-size: 0.9375rem;
          }

          .filter-option {
            padding: 0.25rem 1rem;
            font-size: 0.875rem;
          }
        }

        /* Animation for panel opening */
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .filter-panel.open {
          animation: slideInFromLeft 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </>
  );
};

export default UnifiedFilterBar;