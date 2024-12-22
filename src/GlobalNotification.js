import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Snackbar, Box, Typography } from '@mui/material';

const GlobalNotification = forwardRef((props, ref) => {
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Function to show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 4000); // Auto-hide after 4 seconds
  };

  // Expose showNotification method
  useImperativeHandle(ref, () => ({
    showNotification,
  }));

  // Background color based on notification type
  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return '#4caf50'; // Green for success
      case 'error':
        return '#f44336'; // Red for error
      case 'warning':
        return '#ff9800'; // Orange for warning
      case 'info':
      default:
        return '#2196f3'; // Blue for info
    }
  };

  return (
    <Snackbar
      open={!!notification.message}
      autoHideDuration={4000}
      onClose={() => setNotification({ message: '', type: '' })}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Box
        sx={{
          minWidth: '250px',
          padding: '16px',
          borderRadius: '4px',
          backgroundColor: getBackgroundColor(notification.type),
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>{notification.message}</Typography>
      </Box>
    </Snackbar>
  );
});

export default GlobalNotification;
