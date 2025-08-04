// src/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../../service/AuthService';
import { toast } from 'react-toastify';
// Get user and token from localStorage if exists
const initialUser = JSON.parse(localStorage.getItem('user')) || null;
const initialToken = localStorage.getItem('user_token') || null;

// Async thunk: login
export const login = createAsyncThunk('user/login', async (loginData, thunkAPI) => {
    try {
        const response = await loginUser(loginData);
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('user_token', response.token);
        localStorage.setItem('userMobileNumber', response.contact);
        return response;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Async thunk: signup
export const signup = createAsyncThunk('auth/user/register', async (userData, thunkAPI) => {
    try {
        const response = await registerUser(userData);

        // If the backend ever returns a 'message' key indicating error
        if (response?.message && response.message.toLowerCase().includes('already exists')) {
            return thunkAPI.rejectWithValue(response.message);
        }

        // If there's no error, save user and return
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('userMobileNumber', response.contactNumber);
        localStorage.setItem('user_token', response.token);
        return response;

    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Signup failed');
    }
});


const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: initialUser,
        isAuthenticated: !!(initialUser && (initialUser.token || initialToken)), // Check both user.token and user_token
        loading: false,
        error: null,
    },
    reducers: {
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('user');
            localStorage.removeItem('user_token');
            localStorage.removeItem('userMobileNumber');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
                toast.success("🎉 Registered successfully!", {
                    position: 'top-right',
                    autoClose: 2000,
                });

            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
                
                    toast.success("✅ Login successful!", {
                        position: 'top-right',
                        autoClose: 2000,
                    });
                
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
               
            });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;