import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../../service/AuthService';

// Get user from localStorage if exists
const initialUser = JSON.parse(localStorage.getItem("user")) || null;

// Async thunk: login
export const login = createAsyncThunk('user/login', async (loginData, thunkAPI) => {
    try {
        const response = await loginUser(loginData);
        localStorage.setItem("user", JSON.stringify(response));
        localStorage.setItem("user_token", response.token);
        localStorage.setItem("userMobileNumber", response.contact);
        return response;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Async thunk: signup
export const signup = createAsyncThunk('user/signup', async (userData, thunkAPI) => {
    try {
        const response = await registerUser(userData);
        if (response.message?.toLowerCase().includes("already exists")) {
            return thunkAPI.rejectWithValue(response.message);
        }
        localStorage.setItem("user", JSON.stringify(response));
        localStorage.setItem("userMobileNumber", response.contactNumber);
        return response;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || "Signup failed");
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: initialUser,
        isAuthenticated: !!(initialUser && initialUser.token),
        loading: false,              // <-- Add this
        error: null,
    },

    reducers: {
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem("user");
            localStorage.removeItem("user_token");
            localStorage.removeItem("userMobileNumber");
        }
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
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
