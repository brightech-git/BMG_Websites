import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Slider, Checkbox, Select, Input } from 'antd';
import './FilterStyles.css';

const { Option } = Select;

const ProductFilters = () => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const [filters, setFilters] = useState({
    frameName: '',
    uniframeName: '',
    metalId: null,
    sizeId: null,
    sizeName: '',
    outName: '',
    gender: '',
    dentity: '',
    sortDirection: 'desc',
    minGenerTotal: 0,
    maxGenerTotal: 10000,
    priceRange: [0, 10000],
    occasion: '',
    materialFinish: '',
    valueAccent: '',
    storeType: '',
    swallowLity: '',
    new_arrival: false,
    top_treading: false,
    page: 1,
    pageSize: 10
  });

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    history.push(`/api/v1/product/items/filter?${params.toString()}`);
    setShowModal(false);
  };

  const resetFilters = () => {
    setFilters({
      frameName: '',
      uniframeName: '',
      metalId: null,
      sizeId: null,
      sizeName: '',
      outName: '',
      gender: '',
      dentity: '',
      sortDirection: 'desc',
      minGenerTotal: 0,
      maxGenerTotal: 10000,
      priceRange: [0, 10000],
      occasion: '',
      materialFinish: '',
      valueAccent: '',
      storeType: '',
      swallowLity: '',
      new_arrival: false,
      top_treading: false,
      page: 1,
      pageSize: 10
    });
    history.push('/api/v1/product/items/filter');
  };

  return (
    <>
      {/* Filter Button */}
      <button 
        className="filter-toggle-btn"
        onClick={() => setShowModal(true)}
      >
        <i className="fas fa-filter"></i> Filters
      </button>

      {/* Filter Modal */}
      <div className={`filter-modal ${showModal ? 'show' : ''}`}>
        <div className="filter-modal-content" ref={modalRef}>
          <div className="filter-modal-header">
            <h3>Filters</h3>
            <button 
              className="close-modal-btn"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
          </div>
          
          <div className="filter-modal-body">
            <div className="filter-section">
              <h4>Price Range</h4>
              <Slider
                range
                min={0}
                max={10000}
                value={filters.priceRange}
                onChange={(value) => handleFilterChange('priceRange', value)}
              />
              <div className="price-inputs">
                <Input
                  value={filters.priceRange[0]}
                  onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                />
                <span>to</span>
                <Input
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                />
              </div>
            </div>

            <div className="filter-section">
              <h4>Metal</h4>
              <Select
                style={{ width: '100%' }}
                placeholder="Select Metal"
                value={filters.metalId}
                onChange={(value) => handleFilterChange('metalId', value)}
              >
                <Option value="gold">Gold</Option>
                <Option value="silver">Silver</Option>
                <Option value="platinum">Platinum</Option>
              </Select>
            </div>

            <div className="filter-section">
              <h4>Size</h4>
              <Select
                style={{ width: '100%' }}
                placeholder="Select Size"
                value={filters.sizeId}
                onChange={(value) => handleFilterChange('sizeId', value)}
              >
                <Option value="small">Small</Option>
                <Option value="medium">Medium</Option>
                <Option value="large">Large</Option>
              </Select>
            </div>

            <div className="filter-section">
              <h4>Gender</h4>
              <Select
                style={{ width: '100%' }}
                placeholder="Select Gender"
                value={filters.gender}
                onChange={(value) => handleFilterChange('gender', value)}
              >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="unisex">Unisex</Option>
              </Select>
            </div>

            <div className="filter-section">
              <h4>Occasion</h4>
              <Select
                style={{ width: '100%' }}
                placeholder="Select Occasion"
                value={filters.occasion}
                onChange={(value) => handleFilterChange('occasion', value)}
              >
                <Option value="wedding">Wedding</Option>
                <Option value="engagement">Engagement</Option>
                <Option value="party">Party</Option>
                <Option value="daily">Daily Wear</Option>
              </Select>
            </div>

            <div className="filter-section">
              <h4>Special</h4>
              <div className="checkbox-group">
                <Checkbox
                  checked={filters.new_arrival}
                  onChange={(e) => handleFilterChange('new_arrival', e.target.checked)}
                >
                  New Arrivals
                </Checkbox>
                <Checkbox
                  checked={filters.top_treading}
                  onChange={(e) => handleFilterChange('top_treading', e.target.checked)}
                >
                  Top Trending
                </Checkbox>
              </div>
            </div>
          </div>

          <div className="filter-modal-footer">
            <button className="reset-btn" onClick={resetFilters}>
              Reset
            </button>
            <button className="apply-btn" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilters;