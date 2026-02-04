import React, { createContext, useContext, useState, useEffect } from "react";

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


    return (
        <UserAuthContext.Provider value={{ user, isAuthenticated }}>
            {children}
        </UserAuthContext.Provider>
    );
};

// Hook for consuming context
export const useAuth = () => useContext(UserAuthContext);
