"use client";

import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  Avatar,
  MenuItem,
  Container,
  Paper,
  InputAdornment,
} from "@mui/material";
import {
  registerSeller,
  selectAuthError,
} from "../../features/registerSeller/registerSellerSlice";
import CustomLoader from "../../CustomLoader";
import toast from "react-hot-toast";
import enLocale from "date-fns/locale/en-US";
import { signInUser } from "../../features/sign-in/signInSlice";
import { setUser } from "../../features/user/userSlice";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { PhotoCamera, Visibility, VisibilityOff } from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faStore,
  faPhone,
  faMapMarkerAlt,
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import "./RegisterSellerForm.css";

const fieldLabels = {
  userName: "Username",
  ownerName: "Owner Name",
  shopLogo: "Shop Logo",
  storeName: "Store Name",
  slogan: "Slogan",
  contactNo: "Contact Number",
  email: "Email",
  password: "Password",
  country: "Country",
  city: "City",
  postcode: "Postcode",
  storeDescription: "Store Description",
  openingDate: "Opening Date",
  openingTime: "Opening Time",
  closingTime: "Closing Time",
  openingDay: "Opening Day",
  closingDay: "Closing Day",
};

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const RegisterSellerForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    ownerName: "",
    shopLogo: null,
    storeName: "",
    slogan: "",
    contactNo: "",
    country: "",
    city: "",
    postcode: "",
    storeDescription: "",
    email: "",
    password: "",
    openingDate: "",
    openingTime: dayjs(),
    closingTime: dayjs(),
    openingDay: "",
    closingDay: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const notificationRef = useRef();
  const localeMap = {
    en: enLocale,
  };
  const authError = useSelector(selectAuthError);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [locale, setLocale] = React.useState("ru");
  const [value, setValue] = React.useState(new Date());

  const selectLocale = (newLocale) => {
    setLocale(newLocale);
  };

  const validateField = (name, value) => {
    const displayName = fieldLabels[name] || name;
    if (value === "" || value === null) return `${displayName} cannot be empty`;

    switch (name) {
      case "userName":
        return value.length < 3
          ? `${displayName} must be at least 3 characters long`
          : "";
      case "ownerName":
        return value.length < 2
          ? `${displayName} must be at least 2 characters long`
          : "";
      case "storeName":
        return value.length < 2
          ? `${displayName} must be at least 2 characters long`
          : "";
      case "contactNo":
        return !/^\d{10}$/.test(value)
          ? `${displayName} must be 10 digits`
          : "";
      case "email":
        return !/\S+@\S+\.\S+/.test(value) ? "Email is invalid" : "";
      case "password":
        return !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        )
          ? `${displayName} must contain at least 8 characters, one uppercase, one lowercase, one number and one special character`
          : "";
      case "country":
        return value.length < 2
          ? `${displayName} must be at least 2 characters long`
          : "";
      case "city":
        return value.length < 2
          ? `${displayName} must be at least 2 characters long`
          : "";
      case "postcode":
        return !/^\d{5}(-\d{4})?$/.test(value) ? "Invalid Postcode" : "";
      case "slogan":
        const sloganWordCount = value.trim().split(/\s+/).length;
        if (value.length < 5) {
          return `${displayName} must be at least 5 characters long`;
        } else if (sloganWordCount > 10) {
          return `${displayName} must not exceed 10 words`;
        }
        return "";
      case "storeDescription":
        const descriptionWordCount = value.trim().split(/\s+/).length;
        if (value.length < 10) {
          return `${displayName} must be at least 10 characters long`;
        } else if (descriptionWordCount > 20) {
          return `${displayName} must not exceed 20 words`;
        }
        return "";
      case "openingTime":
      case "closingTime":
        if (!value || !dayjs.isDayjs(value)) {
          return `${displayName} is required`;
        }
        if (!value.isValid()) {
          return `Invalid ${displayName.toLowerCase()}`;
        }
        if (name === "closingTime" && formData.openingTime) {
          if (value.isBefore(formData.openingTime)) {
            return "Closing time must be after opening time";
          }
        }
        return "";
      case "openingDate":
      case "openingDay":
      case "closingDay":
        return value === "" ? `${displayName} must be selected` : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = files ? files[0] : value;

    if (name === "slogan" && newValue.trim().split(/\s+/).length > 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Slogan must not exceed 8 words",
      }));
      return;
    }

    if (
      name === "storeDescription" &&
      newValue.trim().split(/\s+/).length > 20
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Store description must not exceed 20 words",
      }));
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    const errorMessage = validateField(name, newValue);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const errorMessage = validateField(key, formData[key]);
      if (errorMessage) {
        newErrors[key] = errorMessage;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill out all required fields.");
      setLoading(false);
      return;
    }
    try {
      const resultAction = await dispatch(registerSeller(formData));

      if (registerSeller.fulfilled.match(resultAction)) {
        const { email, password } = formData;
        const loginResult = await dispatch(signInUser({ email, password }));
        if (signInUser.fulfilled.match(loginResult)) {
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
          } = loginResult.payload;

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
          setFormData({});
          navigate("/");
        } else {
          toast.error("Login failed. Please try again manually.");
          navigate("/login");
        }
      } else if (registerSeller.rejected.match(resultAction)) {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (field) => (newValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            maxWidth: 800,
            margin: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 4,
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
            Register as a Seller
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="userName"
                  label="Username"
                  value={formData.userName}
                  onChange={handleChange}
                  error={!!errors.userName}
                  helperText={errors.userName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faUser} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="ownerName"
                  label="Owner Name"
                  value={formData.ownerName}
                  onChange={handleChange}
                  error={!!errors.ownerName}
                  helperText={errors.ownerName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faUser} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} align="center">
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="shopLogo"
                  type="file"
                  name="shopLogo"
                  onChange={handleChange}
                />
                <label htmlFor="shopLogo">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <Avatar
                      alt="Shop Logo"
                      src={
                        formData.shopLogo
                          ? URL.createObjectURL(formData.shopLogo)
                          : ""
                      }
                      sx={{ width: 56, height: 56 }}
                    />
                    <PhotoCamera />
                  </IconButton>
                </label>
                {errors.shopLogo && (
                  <Typography
                    variant="caption"
                    color="error"
                    display="block"
                    sx={{ mt: 1 }}
                  >
                    {errors.shopLogo}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="storeName"
                  label="Store Name"
                  value={formData.storeName}
                  onChange={handleChange}
                  error={!!errors.storeName}
                  helperText={errors.storeName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faStore} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="slogan"
                  label="Slogan"
                  value={formData.slogan}
                  onChange={handleChange}
                  error={!!errors.slogan}
                  helperText={errors.slogan}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faStore} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="contactNo"
                  label="Contact Number"
                  value={formData.contactNo}
                  onChange={handleChange}
                  error={!!errors.contactNo}
                  helperText={errors.contactNo}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faPhone} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
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
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="country"
                  label="Country"
                  value={formData.country}
                  onChange={handleChange}
                  helperText={errors.country}
                  error={!!errors.country}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleChange}
                  helperText={errors.city}
                  error={!!errors.city}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="postcode"
                  label="Postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  error={!!errors.postcode}
                  helperText={errors.postcode}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="storeDescription"
                  label="Store Description"
                  value={formData.storeDescription}
                  onChange={handleChange}
                  placeholder="Describe your store (max 20 words)..."
                  multiline
                  helperText={errors.storeDescription}
                  error={!!errors.storeDescription}
                  rows={3}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faStore} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="openingDate"
                  label="Opening Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.openingDate}
                  helperText={errors.openingDate}
                  error={!!errors.openingDate}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Opening Time"
                  value={formData.openingTime}
                  onChange={handleTimeChange("openingTime")}
                  ampm={false}
                  sx={{ width: "100%" }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.openingTime,
                      helperText: errors.openingTime,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <FontAwesomeIcon icon={faClock} />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Closing Time"
                  value={formData.closingTime}
                  onChange={handleTimeChange("closingTime")}
                  ampm={false}
                  sx={{ width: "100%" }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.closingTime,
                      helperText: errors.closingTime,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <FontAwesomeIcon icon={faClock} />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="openingDay"
                  label="Opening Day"
                  value={formData.openingDay}
                  helperText={errors.openingDay}
                  error={!!errors.openingDay}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputAdornment>
                    ),
                  }}
                >
                  {daysOfWeek.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  name="closingDay"
                  label="Closing Day"
                  value={formData.closingDay}
                  helperText={errors.closingDay}
                  error={!!errors.closingDay}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputAdornment>
                    ),
                  }}
                >
                  {daysOfWeek.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: "#F38E58",
                  color: "white",
                  py: 1.5,
                  px: 8,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "white",
                    color: "#F38E58",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "rgba(243, 142, 88, 0.5)",
                    color: "white",
                  },
                }}
              >
                {loading ? <CustomLoader circlesize={20} /> : "Register Seller"}
              </Button>
            </Box>
          </form>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{" "}
              <Button
                variant="text"
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none", padding: 0, color: "#F38E58" }}
              >
                Sign In
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default RegisterSellerForm;
