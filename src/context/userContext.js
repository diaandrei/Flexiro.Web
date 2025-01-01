import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(() => localStorage.getItem("role"));

    const updateUserRole = (newRole) => {
        localStorage.setItem("role", newRole);
        setUserRole(newRole);
    };

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "role") {
                setUserRole(e.newValue);
            }
        };

        const checkLocalStorage = () => {
            const currentRole = localStorage.getItem("role");
            if (currentRole !== userRole) {
                setUserRole(currentRole);
            }
        };

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