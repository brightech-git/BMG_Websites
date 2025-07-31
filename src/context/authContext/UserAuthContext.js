import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../../service/AuthService";

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
    const [user, setUser] = useState(() =>
        JSON.parse(localStorage.getItem("user")) || null
    );

    // Sync with localStorage on mount (once)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // ✅ Add computed flag for login status
    const isAuthenticated = !!(user && user.token);

    // ✅ Login handler
    const login = async (loginData) => {
        try {
            const response = await loginUser(loginData);
            localStorage.setItem("user", JSON.stringify(response));
            localStorage.setItem("user_token", response.token);
            localStorage.setItem("userMobileNumber", response.contact);
            setUser(response);
            return response;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    // ✅ Signup handler
    const signup = async (userData) => {
        try {
            const response = await registerUser(userData);

            if (
                typeof response.message === "string" &&
                response.message.toLowerCase().includes("already exists")
            ) {
                return { errorMessage: response.message };
            }

            localStorage.setItem("user", JSON.stringify(response));
            localStorage.setItem("userMobileNumber", response.contactNumber);
            setUser(response);

            return response;
        } catch (error) {
            console.error("Signup failed:", error);
            return { errorMessage: error.message || "Signup failed" };
        }
    };

    // ✅ Logout handler
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("user_token");
        localStorage.removeItem("userMobileNumber");
        window.location.href = "/login"; // Redirect to login page
    };

    return (
        <UserAuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
            {children}
        </UserAuthContext.Provider>
    );
};

// Hook for consuming context
export const useAuth = () => useContext(UserAuthContext);
