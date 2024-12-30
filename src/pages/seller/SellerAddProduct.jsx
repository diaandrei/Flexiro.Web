"use client";

import React, { useState, useEffect } from "react";
import { fetchCategories, addProduct } from "./sellerApi";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Typography,
  TextField,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  IconButton,
} from "@mui/material";
import {
  Bold,
  Italic,
  Underline,
  AlignJustify,
  AlignLeft,
  AlignCenter,
  AlignRight,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SellerAddProduct() {
  const [formData, setFormData] = useState({
    Name: "",
    categoryId: "",
    price: "",
    weight: "",
    description: "",
    sku: "",
    tags: [],
    status: 1,
    MinimumPurchase: "",
    ProductCondition: "new",
    Stock: "",
    ImportedItem: "false",
    ProductImages: [],
  });

  const theme = createTheme({
    components: {
      MuiRadio: {
        styleOverrides: {
          root: {
            "&.Mui-checked": {
              color: "#f38e58",
            },
          },
        },
      },
    },
  });

  const [tagInput, setTagInput] = useState("");
  const [textFormatting, setTextFormatting] = useState({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    alignment: "left",
  });

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [wordCount, setWordCount] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();
  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const fetchCategoriesData = async () => {
    try {
      setLoading(true);
      const fetchedCategories = await fetchCategories();
      setCategories(formatCategories(fetchedCategories));
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch categories.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCategories = (fetchedCategories) => {
    if (!Array.isArray(fetchedCategories)) return [];
    return fetchedCategories
      .map((category, index) => ({
        id:
          category.id?.toString() ||
          category.categoryId?.toString() ||
          (index + 1).toString(),
        name: category.name || category.categoryName || category.toString(),
      }))
      .filter(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      const words = value.trim().split(/\s+/);
      if (words.length <= 40) {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setWordCount(words.length);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: ["price", "weight", "Stock", "MinimumPurchase"].includes(name)
          ? value.replace(/[^0-9.]/g, "")
          : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Name.trim()) newErrors.Name = "Product name is required.";
    if (!formData.categoryId)
      newErrors.categoryId = "Please select a category.";
    if (!formData.price) newErrors.price = "Price is required.";
    else if (parseFloat(formData.price) <= 0)
      newErrors.price = "Price must be greater than 0.";
    if (!formData.weight) newErrors.weight = "Weight is required.";
    else if (parseFloat(formData.weight) <= 0)
      newErrors.weight = "Weight must be greater than 0.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (formData.ProductImages.length === 0)
      newErrors.ProductImages = "At least one product image is required.";
    if (!formData.MinimumPurchase)
      newErrors.MinimumPurchase = "Minimum purchase is required.";
    else if (parseInt(formData.MinimumPurchase) <= 0)
      newErrors.MinimumPurchase = "Minimum purchase must be greater than 0.";
    if (!formData.Stock) newErrors.Stock = "Stock is required.";
    else if (parseInt(formData.Stock) < 0)
      newErrors.Stock = "Stock cannot be negative.";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required.";
    if (formData.tags.length === 0)
      newErrors.tags = "At least one tag is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSell = async (isDraft = false) => {
    if (!validateForm()) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const shopId = user?.shopId;

      if (!shopId) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      const productData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "price") {
          productData.append("PricePerItem", parseFloat(value));
        } else if (key === "tags") {
          productData.append("tags", JSON.stringify(value));
        } else if (key === "ProductImages") {
          value.forEach((file) => productData.append("ProductImages", file));
        } else if (key !== "status") {
          productData.append(key, value);
        }
      });

      productData.append("shopId", shopId);
      productData.append("status", isDraft ? "0" : "1");

      const response = await addProduct(productData);
      if (response.success) {
        toast.success(
          isDraft
            ? "Product successfully saved as draft!"
            : "Product added successfully!"
        );
        navigate("/seller/products");
      }
    } catch (error) {
      toast.error(
        `Error: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (event) => {
    if (event.key === "Enter" && tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
      event.preventDefault();
      if (errors.tags) {
        setErrors((prev) => ({ ...prev, tags: "" }));
      }
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [...images];
    const newProductImages = [...formData.ProductImages];

    files.forEach((file) => {
      if (newImages.length < 5) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result);
          setImages([...newImages]);
        };
        reader.readAsDataURL(file);
        newProductImages.push(file);
      }
    });

    setFormData((prev) => ({
      ...prev,
      ProductImages: newProductImages.slice(0, 5),
    }));

    // Clear error when images are uploaded
    if (errors.ProductImages) {
      setErrors((prev) => ({ ...prev, ProductImages: "" }));
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      ProductImages: prev.ProductImages.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Add New Product
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Product Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  error={!!errors.Name}
                  helperText={errors.Name}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.categoryId} required>
                  <InputLabel id="category-label">Product Category</InputLabel>
                  <Select
                    labelId="category-label"
                    label="Product Category"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                  >
                    {loading ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} /> Loading categories...
                      </MenuItem>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No categories available</MenuItem>
                    )}
                  </Select>
                  {errors.categoryId && (
                    <Typography variant="caption" color="error">
                      {errors.categoryId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Product Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price per Item"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="USD"
                  error={!!errors.price}
                  helperText={errors.price}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Minimum Purchase"
                  name="MinimumPurchase"
                  type="number"
                  value={formData.MinimumPurchase}
                  onChange={handleChange}
                  error={!!errors.MinimumPurchase}
                  helperText={errors.MinimumPurchase}
                  InputProps={{
                    endAdornment: <Typography sx={{ ml: 1 }}>Pcs</Typography>,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  error={!!errors.weight}
                  helperText={errors.weight}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select label="Unit" defaultValue="gram">
                    <MenuItem value="gram">Gram (gr)</MenuItem>
                    <MenuItem value="kg">Kilogram (kg)</MenuItem>
                    <MenuItem value="lb">Pound (lb)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Product Condition
                  </Typography>
                  <ThemeProvider theme={theme}>
                    <RadioGroup
                      row
                      name="ProductCondition"
                      value={formData.ProductCondition}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="new"
                        control={<Radio />}
                        label="New"
                      />
                      <FormControlLabel
                        value="secondhand"
                        control={<Radio />}
                        label="Secondhand"
                      />
                    </RadioGroup>
                  </ThemeProvider>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Imported Item
                  </Typography>
                  <ThemeProvider theme={theme}>
                    <RadioGroup
                      row
                      name="ImportedItem"
                      value={formData.ImportedItem}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </ThemeProvider>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Stock"
                  name="Stock"
                  type="number"
                  value={formData.Stock}
                  onChange={handleChange}
                  error={!!errors.Stock}
                  helperText={errors.Stock}
                  InputProps={{
                    endAdornment: <Typography sx={{ ml: 1 }}>Pcs</Typography>,
                  }}
                  required
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Product Images
            </Typography>
            <Grid container spacing={2}>
              {images.map((image, index) => (
                <Grid item key={index} xs={6} sm={4} md={3}>
                  <Card sx={{ position: "relative" }}>
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        bgcolor: "rgba(255,255,255,0.7)",
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X size={16} />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {images.length < 5 && (
              <Button
                component="label"
                variant="outlined"
                sx={{
                  mt: 2,
                  bgcolor: "white",
                  color: "#f38e58",
                  borderColor: "#f38e58",
                  "&:hover": { bgcolor: "#f38e58", color: "white" },
                }}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={handleImageUpload}
                />
              </Button>
            )}
            {errors.ProductImages && (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: "block", mt: 1 }}
              >
                {errors.ProductImages}
              </Typography>
            )}
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Product Description
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 1,
                  bgcolor: "grey.100",
                  p: 1,
                  borderRadius: 1,
                }}
              >
                {[
                  {
                    icon: Bold,
                    action: () =>
                      setTextFormatting((prev) => ({
                        ...prev,
                        isBold: !prev.isBold,
                      })),
                  },
                  {
                    icon: Italic,
                    action: () =>
                      setTextFormatting((prev) => ({
                        ...prev,
                        isItalic: !prev.isItalic,
                      })),
                  },
                  {
                    icon: Underline,
                    action: () =>
                      setTextFormatting((prev) => ({
                        ...prev,
                        isUnderline: !prev.isUnderline,
                      })),
                  },
                  {
                    icon: AlignLeft,
                    action: () =>
                      setTextFormatting((prev) => ({
                        ...prev,
                        alignment: "left",
                      })),
                  },
                  {
                    icon: AlignCenter,
                    action: () =>
                      setTextFormatting((prev) => ({
                        ...prev,
                        alignment: "center",
                      })),
                  },
                  {
                    icon: AlignRight,
                    action: () =>
                      setTextFormatting((prev) => ({
                        ...prev,
                        alignment: "right",
                      })),
                  },
                  {
                    icon: AlignJustify,
                    action: () =>
                      setTextFormatting((prev) => ({
                        ...prev,
                        alignment: "justify",
                      })),
                  },
                ].map((item, index) => (
                  <IconButton key={index} onClick={item.action} sx={{ p: 1 }}>
                    <item.icon size={16} />
                  </IconButton>
                ))}
              </Box>
              <TextField
                fullWidth
                multiline
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product (max 40 words)..."
                sx={{
                  bgcolor: "background.paper",
                  textAlign: textFormatting.alignment,
                  fontWeight: textFormatting.isBold ? "bold" : "normal",
                  fontStyle: textFormatting.isItalic ? "italic" : "normal",
                  textDecoration: textFormatting.isUnderline
                    ? "underline"
                    : "none",
                }}
                error={!!errors.description}
                helperText={errors.description || `${wordCount}/40 words`}
                required
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Product Grouping
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tags
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    sx={{
                      color: "#f38e58",
                      borderColor: "#f38e58",
                    }}
                    variant="outlined"
                  />
                ))}
              </Box>
              <TextField
                fullWidth
                label="Add Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Press Enter to add"
                error={!!errors.tags}
                helperText={errors.tags}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Input Here"
                error={!!errors.sku}
                helperText={errors.sku}
                required
              />
            </Box>
          </Paper>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => handleSell(true)}
              sx={{
                bgcolor: "white",
                color: "#f38e58",
                borderColor: "#f38e58",
                "&:hover": { bgcolor: "#f38e58", color: "white" },
              }}
            >
              Save as Draft
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSell(false)}
              sx={{
                bgcolor: "#f38e58",
                "&:hover": { bgcolor: "#e57c46" },
              }}
            >
              Publish Product
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
