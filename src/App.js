import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import store from './app/store';
import { setUser } from './features/user/userSlice';
import toast, { Toaster } from 'react-hot-toast';
import routes from "./routes/routes";
import GlobalNotification from './GlobalNotification';
import { Box } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { SearchProvider } from './context/searchContext';
import { UserProvider } from "./context/userContext";
import { NotificationProvider } from './context/notificationContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const { role, isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    if (userToken && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        dispatch(setUser(parsedUserData));
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    } else {
      console.warn("No user data found in localStorage");
    }
  }, [dispatch]);
  return (
    <>
      <Provider store={store}>
        <ToastContainer />
        <Toaster
          position="top-right"
          reverseOrder={false}

          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "1rem",
              width: "200px", 
              padding: "15px",
              borderRadius: "8px",
              display: "flex", 
              alignItems: "center",
              gap: "8px", 
            },
          }}
        />
        <UserProvider>
          <SearchProvider>
            <Router>
              <NotificationProvider>
                <GlobalNotification />
                <Box sx={{ width: '100%', height: '100%' }}>
                  <Routes>
                    {routes.map((route, index) => (
                      <Route
                        key={index}
                        path={route.path}
                        element={route.element}
                      >
                        {route.children && route.children.map((child, idx) => (
                          <Route
                            key={idx}
                            index={child.index}
                            path={child.path}
                            element={child.element}
                          />
                        ))}
                      </Route>
                    ))}
                  </Routes>
                </Box>
              </NotificationProvider>
            </Router>
          </SearchProvider>
        </UserProvider>
      </Provider>
    </>
  );
}
export default App;