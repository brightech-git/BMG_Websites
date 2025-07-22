import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Slider, Checkbox, Select, Input } from 'antd';
import './FilterStyles.css';

const { Option } = Select;

const ProductFilters = () => {
  const history = useHistory();
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
    priceRange: [],
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

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    // Add non-empty filters to params
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
      priceRange: [],
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
    <div className="filter-container">
      <h3>Filters</h3>
      
      <div className="filter-section">
        <h4>Price Range</h4>
        <Slider
          range
          min={0}
          max={10000}
          value={filters.priceRange.length ? filters.priceRange : [0, 10000]}
          onChange={(value) => handleFilterChange('priceRange', value)}
        />
        <div className="price-inputs">
          <Input
            value={filters.priceRange[0] || 0}
            onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1] || 10000])}
          />
          <span>to</span>
          <Input
            value={filters.priceRange[1] || 10000}
            onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0] || 0, Number(e.target.value)])}
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

      <div className="filter-actions">
        <button className="apply-btn" onClick={applyFilters}>
          Apply Filters
        </button>
        <button className="reset-btn" onClick={resetFilters}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;