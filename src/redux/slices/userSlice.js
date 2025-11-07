// src/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, verifyOtpService, forgotPasswordService, resetPasswordService, changePasswordService, googleLoginService ,updateContactNumber } from '../../service/AuthService';
import { toast } from 'react-toastify';
import { getProfile } from '../../service/profileService';

// Safely parse localStorage user
const getInitialUser = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        return null;
    }
};
export const fetchUser = createAsyncThunk(
    "user/profile",
    async (_, thunkAPI) => {
        console.log("🔍 fetchUser triggered");
        try {
            const response = await getProfile();
            console.log("✅ fetchUser response:", response);
            localStorage.setItem('user', JSON.stringify(response));
            localStorage.setItem('userMobileNumber', response.contact || response.contactNumber);
            return response;
        } catch (error) {
            console.error("❌ fetchUser error:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Get user and token from localStorage if exists
const initialUser = getInitialUser();
console.log('Initial User:', initialUser); // Debug
const initialToken = localStorage.getItem('user_token') || null;

// Async thunk: login
export const login = createAsyncThunk('user/login', async (loginData, thunkAPI) => {
    try {
        const response = await loginUser(loginData); 
        // console.log('Login Response:', response); // Debug
         localStorage.setItem('user_token', response.token);
        // localStorage.setItem('user', JSON.stringify(response?.user || response));
        // localStorage.setItem('userMobileNumber', response.contact || response.contactNumber);
      
            await thunkAPI.dispatch(fetchUser());
        
        return response;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Async thunk: signup
export const signup = createAsyncThunk(
    'auth/user/register',
    async (userData, thunkAPI) => {
        try {
            const response = await registerUser(userData);

            if (response?.message && response.message.toLowerCase().includes('already exists')) {
                return thunkAPI.rejectWithValue(response.message);
            }

            // At this point, response has no token — only OTP info.
            localStorage.setItem('pendingUser', JSON.stringify(response));
            localStorage.setItem('userMobileNumber', response.contactNumber || userData.contactNumber);

            return response; // pass data for OTP step
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Signup failed');
        }
    }
);


// Async thunk: verifyOtp
export const verifyOtp = createAsyncThunk( 
    'auth/user/verify-otp',
    async ({ contactNumber, otp }, thunkAPI) => {
        try {
            const data = await verifyOtpService(contactNumber, otp);
            localStorage.setItem('user_token', data.token);
            // Validate token format
            if (!data.token || data.token.split('.').length !== 3) {
                throw new Error('Invalid token received from server');
            }
            if (data?.token) {
                await thunkAPI.dispatch(fetchUser());
            }
            localStorage.setItem('userMobileNumber', data.contact || data.contactNumber);
           


            return data;
        } catch (error) {
            const message = error.message || 'OTP verification failed';
            toast.error(`❌ ${message}`, {
                position: 'top-right',
                autoClose: 2500,
            });
            return thunkAPI.rejectWithValue(message);
        }
    }
);


// Forgot Password
export const forgotPassword = createAsyncThunk(
    'user/forgotPassword',
    async (contactNumber, thunkAPI) => {
        try {
            const response = await forgotPasswordService(contactNumber);
            toast.success(response.message || "OTP sent to your registered number", {
                position: 'top-right',
                autoClose: 2500,
            });
            return response;
        } catch (error) {
            toast.error(error.message || "Failed to send OTP", {
                position: 'top-right',
                autoClose: 2500,
            });
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Reset Password
export const resetPassword = createAsyncThunk(
    'user/resetPassword',
    async ({ contactNumber, otp, newPassword }, thunkAPI) => {
        try {
            const response = await resetPasswordService({ contactNumber, otp, newPassword });
            toast.success(response.message || "Password reset successful", {
                position: 'top-right',
                autoClose: 2500,
            });
            return response;
        } catch (error) {
            toast.error(error.message || "Failed to reset password", {
                position: 'top-right',
                autoClose: 2500,
            });
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Change Password
export const changePassword = createAsyncThunk(
    "user/changePassword",
    async ({ oldPassword, newPassword }, thunkAPI) => {
        try {
            const response = await changePasswordService({ oldPassword, newPassword });

            // Show success toast
            toast.success(response.message || "Password changed successfully!", {
                position: "top-right",
                autoClose: 2500,
            });

            return response;
        } catch (error) {
            toast.error(error.message || "Failed to change password", {
                position: "top-right",
                autoClose: 2500,
            });
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
 //googleLogin
export const googleLogin = createAsyncThunk(
    "user/googleLogin",
    async (idToken, thunkAPI) => {
        try {
            const response = await googleLoginService(idToken);
            console.log('Google Login Response:', response);
            
            // Save to localStorage
            localStorage.setItem('user_token', response.token);
            // localStorage.setItem('userMobileNumber', response.contact || response.contactNumber);
            if (response) {
                await thunkAPI.dispatch(fetchUser());
            }
            toast.success("✅ Google login successful!", {
                position: "top-right",
                autoClose: 2000,
            });

            return response;
        } catch (error) {
            toast.error(error.message || "Google login failed", {
                position: "top-right",
                autoClose: 2500,
            });
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateMobileNumber = createAsyncThunk(
    "user/update-mobile-number",
    async ({ userId, contactNumber, }, thunkAPI) => {
        try {
            const response = await updateContactNumber({ userId,contactNumber });
            await thunkAPI.dispatch(fetchUser());
            return response;
            
        } catch (error) {
            toast.error(error.message || "Failed to update mobile number", {
                position: "top-right",
                autoClose: 2500,
            });
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);





const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: initialUser,
        isAuthenticated: !!(initialToken&&initialUser),
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
            localStorage.removeItem('pendingUser');
            toast.error('Logged out successfully!', {
                position: 'top-right',
                autoClose: 3000,
            });
        },
        clearError(state) {
            state.error = null;
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
                state.user = action.payload;       // Store pending registration details
                state.isAuthenticated = false;     // Not logged in yet
                state.error = null;
                toast.success('🎉 Registered successfully! Please verify OTP.');
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
                //state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
               
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                //state.user = action.payload;       // Full user data with token
                state.isAuthenticated = true;
                state.error = null;
            })

            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
               .addCase(changePassword.pending, (state) => {
                   state.loading = true;
                   state.error = null;
               })
        .addCase(changePassword.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addCase(changePassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //Google Login
            .addCase(googleLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.loading = false;
                //state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateMobileNumber.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMobileNumber.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateMobileNumber.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;

            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;