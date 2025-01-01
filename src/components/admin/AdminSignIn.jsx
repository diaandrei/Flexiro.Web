import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import {
  signInUser,
  selectAuthError,
} from "../../features/sign-in/signInSlice";
import CustomLoader from "../../CustomLoader";
import GlobalNotification from "../../GlobalNotification";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../features/user/userSlice";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";

const AdminSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const notificationRef = useRef();
  const [loadingItems, setLoadingItems] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoadingItems(true);

    try {
      const resultAction = await dispatch(signInUser({ email, password }));

      if (signInUser.rejected.match(resultAction)) {
        // Handle rejection
        setErrors((prev) => ({
          ...prev,
          password: "Invalid email or password",
        }));
      } else {
        const { userId, token, email, role, name } = resultAction.payload;
        dispatch(setUser({ userId, token, email, role, name }));
        navigate(role === "Admin" ? "/admin/dashboard" : "/");
      }
    } catch (error) {
      // Handle errors
      notificationRef.current?.showNotification(
        "An unexpected error occurred. Please check your details and try again.",
        "error"
      );
    } finally {
      setLoadingItems(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Box
        sx={{
          width: 400,
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
          Admin Login
        </Typography>

        {errors.email || errors.password ? (
          <Typography
            color="error"
            variant="body2"
            sx={{ mb: 2, textAlign: "center" }}
          >
            {errors.email || errors.password}
          </Typography>
        ) : null}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faEnvelope} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            inputProps={{
              autoComplete: "off",
            }}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faLock} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                    sx={{ fontSize: ".9rem" }}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      style={{ color: "#7f8c8d" }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mb: 2,
              bgcolor: "#F38E58",
              color: "white",
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#e57c46",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(243, 142, 88, 0.5)",
                color: "white",
              },
            }}
            disabled={loadingItems}
          >
            {loadingItems ? <CustomLoader circlesize={20} /> : "Sign In"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default AdminSignIn;
