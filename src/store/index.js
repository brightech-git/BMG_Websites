// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from '../redux/slices/filterSlice'
import userReducer from '../redux/slices/userSlice';
import filteredProductsSlice from '../redux/slices/filteredProductsSlice';

export const store = configureStore({
    reducer: { 
        user: userReducer,
        productFilters: filterReducer,
        filteredProducts: filteredProductsSlice,
    },
});
