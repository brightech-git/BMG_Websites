import PublicUrl from "../api/publicUrl";

// Register
export const registerUser = async (userData) => {
    const response = await PublicUrl.post("auth/user/register", userData);
  
    return response.data;
};

// Login
export const loginUser = async (loginData) => {
    const response = await PublicUrl.post("auth/user/login", loginData);
 
    const data = response.data;

    // If there's an 'error' field, throw it
    if (data.error) {
        throw new Error(data.error); // e.g., "Invalid username or password"
    }

    // Optional: also check for missing token, just in case
    if (!data.token) {
        throw new Error("Login failed: Missing token from server.");
    }

    return data;
};

export const verifyOtpService = async (contactNumber, otp) => {
    const response = await PublicUrl.post(
        `auth/user/verify-otp?contactNumber=${contactNumber}&otp=${otp}`
    );

    const data = response.data;

    if (data.error) {
        throw new Error(data.error);
    }

    return data; // { message, user, token }
};

//Forgot password
export const forgotPasswordService = async (contactNumber) => {
    const response = await PublicUrl.post("auth/user/forgot-password", {
        contactNumber,
    });
    const data = response.data;

    if (data.error) {
        throw new Error(data.error);
    }

    return data; // { message: "...", otpSent: true }
};

// Reset Password
export const resetPasswordService = async ({ contactNumber, otp, newPassword }) => {
    const response = await PublicUrl.post("auth/user/reset-password", {
        contactNumber,
        otp,
        newPassword,
    });
    const data = response.data;

    if (data.error) {
        throw new Error(data.error);
    }

    return data; // { message: "Password reset successful" }
};
