import React, { useState } from "react";
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { useNotifications } from "../../context/notificationContext";

const NotificationIcon = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (unreadCount > 0) {
      markAsRead();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List sx={{ width: 300, maxHeight: 400, overflow: "auto" }}>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.createdAt).toLocaleString()}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <Typography>No notifications at this time.</Typography>
            </ListItem>
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationIcon;
