import React, { useState } from "react";
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemButton,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { useNotifications } from "../../context/notificationContext";
import { useNavigate } from "react-router-dom";

const NotificationIcon = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (unreadCount > 0) {
      markAsRead();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    const orderNumberMatch = notification.message.match(/#ORD-(\d+)/);
    if (orderNumberMatch) {
      const orderNumber = orderNumberMatch[1];
      if (userRole === "Seller") {
        navigate(`/seller/orders?orderNumber=${orderNumber}`);
      } else if (userRole === "Customer") {
        navigate(`/customerorders?orderNumber=${orderNumber}`);
      }
      handleClose();
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: "grey",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#FF4D4F",
              color: "white",
            },
          }}
        >
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
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          },
        }}
      >
        <List
          sx={{
            width: 320,
            maxHeight: 400,
            overflow: "auto",
            p: 0,
          }}
        >
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <ListItem
                key={index}
                disablePadding
                divider={index !== notifications.length - 1}
              >
                <ListItemButton
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    py: 2,
                    px: 2.5,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "#262C36",
                          mb: 0.5,
                        }}
                      >
                        {notification.message}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#94969F",
                          display: "block",
                        }}
                      >
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem sx={{ py: 3, px: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#94969F",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                No notifications
              </Typography>
            </ListItem>
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationIcon;
