import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    filters: {
        page: 0,
        pageSize: 10,
        sortDirection: 'ASC',
        // add defaults if needed
    }
};

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilter(state, action) {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters(state) {
            state.filters = initialState.filters;
        },
    }
});

export const { setFilter, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
