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

    if (data.status === "error" || data.error) {
        throw new Error(data.message || data.error || "Login failed");
    }

    // Optional: also validate token
    if (!data.token) {
        throw new Error("No token received. Please try again.");
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

// Change Password
export const changePasswordService = async ({ oldPassword, newPassword }) => {
    const token = localStorage.getItem("user_token");

    if (!token) {
        throw new Error("No token found. Please login again.");
    }

    try {
        const response = await PublicUrl.post(
            "/user/change-password", // ✅ ensure leading slash
            {
                oldPassword: oldPassword,   // ✅ correctly passed in body
                newPassword: newPassword,
            },
           
        );

        return response.data; // e.g. { message: "Password changed successfully" }
    } catch (error) {
        throw new Error(
            error.response?.data?.message || error.message || "Failed to change password"
        );
    }
};
// Google Login Service
export const googleLoginService = async (idToken) => {
    try {
        if (!idToken) {
            throw new Error("Google ID token is missing");
        }

        const response = await PublicUrl.post(
            "/auth/google-login", // ✅ ensure proper endpoint
            { idToken }
        );

        return response.data; // Expected to include user + token
    } catch (error) {
        throw new Error(
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Google login failed"
        );
    }
};


