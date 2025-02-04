import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Custom primary color
    },
    secondary: {
      main: '#ff4081', // Custom secondary color
    },
    background: {
      default: '#f4f6f8', // Background color
      paper: '#ffffff', // Paper background color
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: 'Calibri, Arial, sans-serif', // Global font
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  spacing: 8, // Default spacing
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Custom border radius for buttons
          textTransform: 'none', // No uppercase transformation
          padding: '8px 16px',
        },
        containedPrimary: {
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;
