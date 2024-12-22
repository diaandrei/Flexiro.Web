import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Initialize state with localStorage value
    const [userRole, setUserRole] = useState(() => localStorage.getItem("role"));

    // Function to update both context and localStorage
    const updateUserRole = (newRole) => {
        localStorage.setItem("role", newRole);
        setUserRole(newRole);
    };

    // Watch for localStorage changes
    useEffect(() => {
        // Handler for storage events (other tabs)
        const handleStorageChange = (e) => {
            if (e.key === "role") {
                setUserRole(e.newValue);
            }
        };

        // Handler to check localStorage periodically
        const checkLocalStorage = () => {
            const currentRole = localStorage.getItem("role");
            if (currentRole !== userRole) {
                setUserRole(currentRole);
            }
        };

        // Set up listeners and interval
        window.addEventListener("storage", handleStorageChange);
        const interval = setInterval(checkLocalStorage, 1000); // Check every second

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, [userRole]);

    return (
        <UserContext.Provider value={{ userRole, setUserRole: updateUserRole }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser hook must be used within a UserProvider component.");
    }
    return context;
};