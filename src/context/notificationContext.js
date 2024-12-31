import React, { createContext, useState, useContext, useEffect } from 'react';
import signalRService from '../notification/signalRService';
import axios from "axios";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const checkUserSession = () => {
            const userId = localStorage.getItem('userId');
            if (userId !== currentUserId) {
                setNotifications([]);
                setUnreadCount(0);
                setCurrentUserId(userId);
            }
        };

        checkUserSession();

        const interval = setInterval(checkUserSession, 1000);

        return () => clearInterval(interval);
    }, [currentUserId]);

    useEffect(() => {
        const setupNotifications = async () => {
            if (currentUserId) {
                await signalRService.startConnection(currentUserId);
                signalRService.setOnNotificationReceived((message) => {
                    setNotifications(prev => [...prev, { message, isRead: false }]);
                    setUnreadCount(prev => prev + 1);
                });

                await fetchNotifications(currentUserId);
            }
        };

        setupNotifications();

        return () => {
            signalRService.stopConnection();
        };
    }, [currentUserId]);

    const fetchNotifications = async (userId) => {
        if (!userId) return;

        try {
            const response = await axios.get(
                `${API_ENDPOINT}/notifications/${userId}`
            );

            if (response.status === 200) {
                const notifications = response.data;
                setNotifications(notifications);
                setUnreadCount(notifications.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async () => {
        if (!currentUserId) return;

        try {
            const response = await fetch(`${API_ENDPOINT}/notifications/mark-as-read/${currentUserId}`, {
                method: 'POST',
            });
            if (response.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            clearNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;