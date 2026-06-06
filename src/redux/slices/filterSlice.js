import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    ItemName: '',
    subItemName: '',
    sizeName: '',
    gender: '',
    sortBy: '',
    priceRange: '',
    weightRange: '',
    new_arrival: '',
    page: 0,
    pageSize: 10,
};

const filterSlice = createSlice({
    name: 'productFilters',
    initialState,
    reducers: {
        setItemName: (state, action) => {
            state.ItemName = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setSubItemName: (state, action) => {
            state.subItemName = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setSizeName: (state, action) => {
            state.sizeName = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },

        setGender: (state, action) => {
            state.gender = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setSortBy: (state, action) => {
            state.sortBy = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setPriceRange: (state, action) => {
            state.priceRange = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setWeightRange: (state, action) => {
            state.weightRange = typeof action.payload === 'string' ? action.payload.replace(/^"|"$/g, '') : '';
        },
        setNewArrival: (state, action) => {
            state.new_arrival = action.payload === true ? 'YES' : action.payload === false ? 'NO' : '';
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
    setSizeName,
    setGender,
    setSortBy,
    setPriceRange,
    setNewArrival,
    setPage,
    setPageSize,
    setWeightRange,
    resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;

