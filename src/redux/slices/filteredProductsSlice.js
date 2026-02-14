// src/redux/slices/productFilterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import PublicUrl from '../../api/publicUrl';

export const fetchFilteredProducts = createAsyncThunk(
    'products/fetchFilteredProducts',
    async (filters, { rejectWithValue }) => {
        //console.log(filters,'filter in service');
        try {
            const response = await PublicUrl.get('/product/items/filter', null, { params: filters });
            //console.log(response.data,'response');
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const productFilterSlice = createSlice({
    name: 'productFilter',
    initialState: {
        filters: {},
        products: [],
        loading: false,
        error: null,
        pagination: {
            page: 0,
            pageSize: 10,
        },
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = {};
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilteredProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload?.items || []; // assuming `items` is returned
                state.pagination.totalPages = action.payload?.totalPages || 1;
            })
            .addCase(fetchFilteredProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, resetFilters, setPagination } = productFilterSlice.actions;
export default productFilterSlice.reducer;
