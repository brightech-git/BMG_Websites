import { configureStore } from '@reduxjs/toolkit';
import filterReducer from '../redux/slices/filterSlice';
import userReducer from '../redux/slices/userSlice';

export const store = configureStore({
    reducer: {
        filter: filterReducer,
    },
    reducer: {
        user: userReducer,
    },
});
