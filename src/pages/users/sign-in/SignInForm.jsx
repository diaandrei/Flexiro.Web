import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
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
} from "../../../features/sign-in/signInSlice";
import CustomLoader from "../../../CustomLoader";
import GlobalNotification from "../../../GlobalNotification";
import { useNavigate, Link } from "react-router-dom";
import { setUser } from "../../../features/user/userSlice";
import { transferGuestCart } from "../../../features/cart/cartSlice";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from "@mui/material";
import toast from "react-hot-toast";

const SignInForm = () => {
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

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      dispatch(setUser(userData));
    }
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }
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
    if (!validateForm()) return;
    setLoadingItems(true);

    try {
      const resultAction = await dispatch(
        signInUser({ email, password })
      ).unwrap();

      const {
        userId,
        token,
        email: userEmail,
        role,
        name,
        sellerId,
        shopId,
        shopName,
        ownerName,
      } = resultAction;

      dispatch(
        setUser({
          userId,
          token,
          email: userEmail,
          role,
          name,
          sellerId,
          shopId,
          shopName,
          ownerName,
        })
      );
      localStorage.setItem("userId", userId);
      localStorage.setItem("user", JSON.stringify(resultAction));

      const guestId = localStorage.getItem("guestId");
      if (guestId) {
        await dispatch(transferGuestCart(userId));
      }

      setEmail("");
      setPassword("");

      if (role === "Admin") {
        navigate("/");
      } else if (role === "Seller") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, password: "Invalid email or password" }));
    } finally {
      setLoadingItems(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      maxWidth="100%"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <GlobalNotification ref={notificationRef} />
      <Paper
        elevation={6}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 3,
          width: "100%",
          maxWidth: 450,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: "#2c3e50",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: "50%",
              height: 4,
              backgroundColor: "#F38E58",
              borderRadius: 2,
            },
          }}
        >
          Sign In
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          align="center"
          sx={{ mb: 3 }}
        >
          Welcome back! Please sign in to continue
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            fullWidth
            margin="normal"
            type="email"
            label="Email"
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
            fullWidth
            margin="normal"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
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
              mt: 3,
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
        </Box>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 2 }}
        >
          Don't have an account?{" "}
          <MuiLink
            component={Link}
            to="/signup"
            color="#F38E58"
            sx={{ fontWeight: 600 }}
          >
            Register now!
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default SignInForm;
