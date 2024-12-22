import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const setErrorMessage = (message) => setError(message);
  const clearError = () => setError(null);
  const setSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <NotificationContext.Provider
      value={{
        loading,
        error,
        successMessage,
        startLoading,
        stopLoading,
        setErrorMessage,
        clearError,
        setSuccess,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
