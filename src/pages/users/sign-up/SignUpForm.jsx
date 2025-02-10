import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  Typography,
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import {
  signUpUser,
  selectAuthError,
} from "../../../features/sign-up/signUpSlice";
import { signInUser } from "../../../features/sign-in/signInSlice";
import CustomLoader from "../../../CustomLoader";
import toast from "react-hot-toast";
import { setUser } from "../../../features/user/userSlice";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();
  const notificationRef = useRef();
  const navigate = useNavigate();
  const authError = useSelector(selectAuthError);
  const [loadingItems, setLoadingItems] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoadingItems(true);

    setUsernameError("");
    setEmailError("");
    setPasswordError("");

    let isValid = true;

    // Validation checks
    if (!username) {
      setUsernameError("Username is required");
      isValid = false;
    }

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (!/(?=.*[A-Z])(?=.*\d)(?=.*\W)/.test(password)) {
      setPasswordError(
        "Password must include at least one uppercase letter, one digit, and one special character"
      );
      isValid = false;
    }

    if (!isValid) {
      setLoadingItems(false);
      return;
    }

    try {
      const resultAction = await dispatch(
        signUpUser({ username, email, password })
      );

      if (signUpUser.fulfilled.match(resultAction)) {
        const resultLogin = await dispatch(signInUser({ email, password }));
        if (signInUser.fulfilled.match(resultLogin)) {
          const {
            userId,
            token,
            email,
            role,
            name,
            sellerId,
            shopId,
            shopName,
            ownerName,
          } = resultLogin.payload;
          dispatch(
            setUser({
              userId,
              token,
              email,
              role,
              name,
              sellerId,
              shopId,
              shopName,
              ownerName,
            })
          );
          setUsername("");
          setEmail("");
          setPassword("");
          navigate("/");
        } else {
          toast.error("Login failed. Please try again later.");
        }
      } else if (signUpUser.rejected.match(resultAction)) {
      }
    } catch (error) {
    } finally {
      setLoadingItems(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

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
          Create Account
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          align="center"
          sx={{ mb: 3 }}
        >
          Please follow the instructions to register and start exploring
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!usernameError}
            helperText={usernameError}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faUser} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
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
            type={showPassword ? "text" : "password"}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    aria-label="toggle password visibility"
                    sx={{ fontSize: "1rem", padding: "0" }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 1, display: "block" }}
          >
            <FontAwesomeIcon
              icon={faInfoCircle}
              style={{ marginRight: "4px" }}
            />
            Password must include at least one non-alphanumeric character, one
            digit (0-9), and one uppercase letter.
          </Typography>

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
            {loadingItems ? <CustomLoader circlesize={20} /> : "Create Account"}
          </Button>
        </Box>

        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 2 }}
        >
          Already have an account?{" "}
          <MuiLink
            component={Link}
            to="/login"
            color="#F38E58"
            sx={{ fontWeight: 600 }}
          >
            Login now!
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default SignUpForm;
