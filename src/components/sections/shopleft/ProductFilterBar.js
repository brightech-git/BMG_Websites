import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
    setItemName,
    setSubItemName,
    setMetalId,
    setSizeId,
    setSizeName,
    setCatName,
    setGender,
    setSortBy,
    setSortDirection,
    setMinGrandTotal,
    setMaxGrandTotal,
    setPriceRange,
    setOccasion,
    setMaterialFinish,
    setColorAccent,
    setStoneUnit,
    setAvailability,
    setNewArrival,
    setTopTrending,
    setFeaturedProducts, // Add this
    setPage,
    setPageSize,
    resetFilters,
} from '../../../redux/slices/filterSlice';
import './ProductFilterBar.css';

// Predefined options
const itemNameOptions = ['Ring', 'Necklace', 'Earrings', 'Bracelet'];
const subItemNameOptions = ['Solitaire', 'Pendant', 'Stud', 'Bangle'];
const genderOptions = ['MEN', 'WOMEN', 'KIDS'];
const colorAccentOptions = ['SILVER', 'GOLD'];

const ProductFilterBar = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const filters = useSelector((state) => state.productFilters);

    // Reset state on page refresh
    React.useEffect(() => {
        const handleUnload = () => {
            dispatch(resetFilters());
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, [dispatch]);

    // Update URL query string when filters change
    const updateQueryString = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined && value !== 'ASC') {
                params.append(key, value);
            }
        });
        history.push({ search: params.toString() });
    };

    // Handlers for filter changes
    const handleSetItemName = (value) => {
        dispatch(setItemName(value));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetSubItemName = (value) => {
        dispatch(setSubItemName(value));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetGender = (value) => {
        dispatch(setGender(value));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetMetalId = (value) => {
        dispatch(setMetalId(value));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetSizeId = (value) => {
        dispatch(setSizeId(value));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetSizeName = (value) => {
        dispatch(setSizeName(value));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetCatName = (value) => {
        dispatch(setCatName(value));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetSortBy = (value) => {
        dispatch(setSortBy(value));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetSortDirection = (value) => {
        dispatch(setSortDirection(value));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetMinGrandTotal = (value) => {
        const numValue = value ? Number(value) : '';
        if (numValue && filters.maxGrandTotal && numValue > filters.maxGrandTotal) {
            return;
        }
        dispatch(setMinGrandTotal(numValue));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetMaxGrandTotal = (value) => {
        const numValue = value ? Number(value) : '';
        dispatch(setMaxGrandTotal(numValue));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetPriceRange = (value) => {
        dispatch(setPriceRange(value));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetOccasion = (value) => {
        dispatch(setOccasion(value));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetMaterialFinish = (value) => {
        dispatch(setMaterialFinish(value));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetColorAccent = (value) => {
        dispatch(setColorAccent(value));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetStoneUnit = (value) => {
        dispatch(setStoneUnit(value));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetAvailability = (value) => {
        dispatch(setAvailability(value));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetNewArrival = (value) => {
        dispatch(setNewArrival(value ? 'YES' : ''));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetTopTrending = (value) => {
        dispatch(setTopTrending(value ? 'YES' : ''));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetFeaturedProducts = (value) => {
        dispatch(setFeaturedProducts(value ? 'true' : ''));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleSetPageSize = (value) => {
        dispatch(setPageSize(Number(value)));
        dispatch(setPage(1));
        updateQueryString();
    };
    const handleResetFilters = () => {
        dispatch(resetFilters());
        history.push({ search: '' });
    };

    return (
        <div className="product-filter-bar">
            <form>
                <div className="filter-group">
                    <div>
                        <label>Item Name</label>
                        <select
                            value={filters.itemName}
                            onChange={(e) => handleSetItemName(e.target.value)}
                        >
                            <option value="">Select Item Name</option>
                            {itemNameOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Sub Item Name</label>
                        <select
                            value={filters.subItemName}
                            onChange={(e) => handleSetSubItemName(e.target.value)}
                        >
                            <option value="">Select Sub Item Name</option>
                            {subItemNameOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="filter-group">
                    <div>
                        <label>Gender</label>
                        <select
                            value={filters.gender}
                            onChange={(e) => handleSetGender(e.target.value)}
                        >
                            <option value="">All Genders</option>
                            {genderOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Metal Type</label>
                        <select
                            value={filters.metalId}
                            onChange={(e) => handleSetMetalId(e.target.value)}
                        >
                            <option value="">All Metals</option>
                            <option value="1">Gold</option>
                            <option value="2">Silver</option>
                            <option value="3">Diamond</option>
                        </select>
                    </div>
                </div>

                <div className="filter-group">
                    <div>
                        <label>Size ID</label>
                        <input
                            type="number"
                            placeholder="E.g., 7"
                            value={filters.sizeId}
                            onChange={(e) => handleSetSizeId(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Size Name</label>
                        <input
                            type="text"
                            placeholder="E.g., Medium"
                            value={filters.sizeName}
                            onChange={(e) => handleSetSizeName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-group">
                    <div>
                        <label>Category Name</label>
                        <input
                            type="text"
                            placeholder="E.g., Rings"
                            value={filters.catName}
                            onChange={(e) => handleSetCatName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Occasion</label>
                        <input
                            type="text"
                            placeholder="E.g., Wedding"
                            value={filters.occasion}
                            onChange={(e) => handleSetOccasion(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-group">
                    <div>
                        <label>Material Finish</label>
                        <input
                            type="text"
                            placeholder="E.g., Polished"
                            value={filters.materialFinish}
                            onChange={(e) => handleSetMaterialFinish(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Color Accent</label>
                        <select
                            value={filters.colorAccent}
                            onChange={(e) => handleSetColorAccent(e.target.value)}
                        >
                            <option value="">Select Color Accent</option>
                            {colorAccentOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="filter-group">
                    <div>
                        <label>Stone Unit</label>
                        <input
                            type="text"
                            placeholder="E.g., Diamond"
                            value={filters.stoneUnit}
                            onChange={(e) => handleSetStoneUnit(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Availability</label>
                        <select
                            value={filters.availability}
                            onChange={(e) => handleSetAvailability(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="true">Available</option>
                            <option value="false">Out of Stock</option>
                        </select>
                    </div>
                </div>

                <div className="checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={filters.new_arrival === 'YES'}
                            onChange={(e) => handleSetNewArrival(e.target.checked)}
                        />
                        New Arrival
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={filters.top_trending === 'YES'}
                            onChange={(e) => handleSetTopTrending(e.target.checked)}
                        />
                        Top Trending
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={filters.featured_products === 'true'}
                            onChange={(e) => handleSetFeaturedProducts(e.target.checked)}
                        />
                        Featured Products
                    </label>
                </div>

                <div className="filter-group">
                    <div>
                        <label>Min Price</label>
                        <input
                            type="number"
                            placeholder="E.g., 1000"
                            value={filters.minGrandTotal}
                            onChange={(e) => handleSetMinGrandTotal(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Max Price</label>
                        <input
                            type="number"
                            placeholder="E.g., 5000"
                            value={filters.maxGrandTotal}
                            onChange={(e) => handleSetMaxGrandTotal(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-group">
                    <div>
                        <label>Price Range</label>
                        <input
                            type="range"
                            min="0"
                            max="10000"
                            value={filters.priceRange || 0}
                            onChange={(e) => handleSetPriceRange(e.target.value)}
                        />
                        <span>{filters.priceRange || 0}</span>
                    </div>
                </div>

                <div className="sort-group">
                    <div>
                        <label>Sort By</label>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleSetSortBy(e.target.value)}
                        >
                            <option value="">Sort By</option>
                            <option value="price">Price</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                    <div>
                        <label>Sort Direction</label>
                        <select
                            value={filters.sortDirection}
                            onChange={(e) => handleSetSortDirection(e.target.value)}
                        >
                            <option value="ASC">Ascending</option>
                            <option value="DESC">Descending</option>
                        </select>
                    </div>
                    <div>
                        <label>Items Per Page</label>
                        <select
                            value={filters.pageSize}
                            onChange={(e) => handleSetPageSize(e.target.value)}
                        >
                            <option value="10">10 per page</option>
                            <option value="20">20 per page</option>
                            <option value="50">50 per page</option>
                        </select>
                    </div>
                </div>

                <button type="button" onClick={handleResetFilters}>
                    Clear All Filters
                </button>
            </form>
        </div>
    );
};

export default ProductFilterBar;

// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { updateFilter } from '../../../redux/slices/filterSlice';

// const FilterBar = () => {
//     const dispatch = useDispatch();
//     const filters = useSelector(state => state.productFilters);

//     const handleChange = (key, value) => {
//         dispatch(updateFilter({ key, value }));
//     };

//     return (
//         <div className="filter-bar">
//             <select onChange={(e) => handleChange('gender', e.target.value)} value={filters.gender}>
//                 <option value="">Gender</option>
//                 <option value="MEN">Men</option>
//                 <option value="WOMEN">Women</option>
//                 <option value="KIDS">Kids</option>
//             </select>

//             <select onChange={(e) => handleChange('colorAccent', e.target.value)} value={filters.colorAccent}>
//                 <option value="">Color</option>
//                 <option value="GOLD">Gold</option>
//                 <option value="SILVER">Silver</option>
//             </select>

//             <select onChange={(e) => handleChange('materialFinish', e.target.value)} value={filters.materialFinish}>
//                 <option value="">Material Finish</option>
//                 <option value="GOLDCOATED">Gold Coated</option>
//                 <option value="SILVERCOATED">Silver Coated</option>
//             </select>

//             <select onChange={(e) => handleChange('occasion', e.target.value)} value={filters.occasion}>
//                 <option value="">Occasion</option>
//                 <option value="DAILY_WEAR">Daily Wear</option>
//                 <option value="WEDDING">Wedding</option>
//                 <option value="OFFICE">Office</option>
//                 <option value="GIFT">Gift</option>
//             </select>
//         </div>
//     );
// };

// export default FilterBar;
