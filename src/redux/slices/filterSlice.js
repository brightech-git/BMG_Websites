import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    itemName: '',
    subItemName: '',
    metalId: '',
    sizeId: '',
    sizeName: '',
    catName: '',
    gender: '',
    sortBy: '',
    sortDirection: 'ASC',
    minGrandTotal: '', // Will store as number or empty string
    maxGrandTotal: '', // Will store as number or empty string
    priceRange: '', // Consider removing if redundant
    occasion: '',
    materialFinish: '',
    colorAccent: '',
    stoneUnit: '',
    availability: '',
    new_arrival: '', // Expects 'YES'/'NO'
    top_trending: '', // Expects 'YES'/'NO'
    featured_products: '', // Add this
    page: 0, // Default to 0
    pageSize: 10,
};

const filterSlice = createSlice({
    name: 'productFilters',
    initialState,
    reducers: {
        setItemName: (state, action) => {
            state.itemName = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setSubItemName: (state, action) => {
            state.subItemName = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setMetalId: (state, action) => {
            state.metalId = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setSizeId: (state, action) => {
            state.sizeId = action.payload ? Number(action.payload) : '';
        },
        setSizeName: (state, action) => {
            state.sizeName = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setCatName: (state, action) => {
            state.catName = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setGender: (state, action) => {
            state.gender = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setSortBy: (state, action) => {
            state.sortBy = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setSortDirection: (state, action) => {
            state.sortDirection = action.payload ? action.payload.toUpperCase() : 'ASC';
        },
        setMinGrandTotal: (state, action) => {
            state.minGrandTotal = action.payload ? Number(action.payload) : '';
        },
        setMaxGrandTotal: (state, action) => {
            state.maxGrandTotal = action.payload ? Number(action.payload) : '';
        },
        setPriceRange: (state, action) => {
            state.priceRange = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setOccasion: (state, action) => {
            state.occasion = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setMaterialFinish: (state, action) => {
            state.materialFinish = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setColorAccent: (state, action) => {
            state.colorAccent = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setStoneUnit: (state, action) => {
            state.stoneUnit = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setAvailability: (state, action) => {
            state.availability = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setNewArrival: (state, action) => {
            state.new_arrival = action.payload === true ? 'YES' : action.payload === false ? 'NO' : '';
        },
        setTopTrending: (state, action) => {
            state.top_trending = action.payload === true ? 'YES' : action.payload === false ? 'NO' : '';
        },
        setFeaturedProducts(state, action) {
            state.featured_products = action.payload;
        },
        setPage: (state, action) => {
            state.page = Number(action.payload) || 1; // Default to 1
        },
        setPageSize: (state, action) => {
            state.pageSize = Number(action.payload) || 10;
        },
        resetFilters: () => initialState,
    },
});

export const {
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
    setPage,
    setPageSize,
    resetFilters,
    setFeaturedProducts, // Export new reducer
} = filterSlice.actions;

export default filterSlice.reducer;

// redux/slices/filterSlice.js
// src/redux/slices/filterSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     itemName: '',
//     subItemName: '',
//     metalId: '',
//     sizeId: '',
//     sizeName: '',
//     catName: '',
//     gender: '',
//     sortBy: '',
//     sortDirection: 'ASC',
//     minGrandTotal: '',
//     maxGrandTotal: '',
//     priceRange: '',
//     occasion: '',
//     materialFinish: '',
//     colorAccent: '',
//     stoneUnit: '',
//     availability: '',
//     new_arrival: '',
//     top_trending: '',
//     page: 0,
//     pageSize: 10,
// };

// const filterSlice = createSlice({
//     name: 'productFilters',
//     initialState,
//     reducers: {
//         setFilter(state, action) {
//             Object.assign(state, action.payload);
//         },
//         updateFilter(state, action) {
//             const { key, value } = action.payload;
//             state[key] = value;
//         },
//         clearFilter(state) {
//             return { ...initialState };
//         }
//     }
// });

// export const { setFilter, updateFilter, clearFilter } = filterSlice.actions;
// export default filterSlice.reducer;
