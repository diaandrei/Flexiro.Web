import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Container,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  LinearProgress,
  Card,
  CardContent,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { ChevronDown, Filter, Plus, Search } from "lucide-react";
import {
  fetchSellerProducts,
  changeProductStatus,
  updateProductDiscount,
} from "./sellerApi";
import { useNavigate } from "react-router-dom";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductStatusMap = {
  0: "Draft",
  1: "Available",
  2: "Sold Out",
};

const AvailabilityStatusMap = {
  0: "Sold Out",
  1: "Available",
};

const getScoreProgress = (score) => {
  switch (score) {
    case "Good":
      return 100;
    case "Average":
      return 70;
    case "Poor":
      return 40;
    default:
      return 0;
  }
};

export default function SellerProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState({
    forSaleProducts: [],
    notForSaleProducts: [],
    forSellProducts: [],
    draftProducts: [],
    soldOutProducts: [],
  });

  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productStatus, setProductStatus] = useState("");
  const [saleStatus, setSaleStatus] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const shopId = user?.shopId;
        const response = await fetchSellerProducts(shopId);
        if (response?.success && response.content) {
          setProducts(response.content);
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setProductStatus(ProductStatusMap[product.status] || "Draft");
    setSaleStatus(AvailabilityStatusMap[product.availability] || "NotForSale");
    setEditModalOpen(true);
  };

  const handleSaveStatus = async () => {
    setIsSaving(true);

    const newProductStatus =
      productStatus === "ForSell" ? 1 : productStatus === "SoldOut" ? 2 : 0;

    if (selectedProduct) {
      try {
        await changeProductStatus(selectedProduct.productId, newProductStatus);

        setProducts((prevProducts) => {
          const updatedDraftProducts = prevProducts.draftProducts.filter(
            (product) => product.productId !== selectedProduct.productId
          );
          const updatedForSellProducts = prevProducts.forSellProducts.filter(
            (product) => product.productId !== selectedProduct.productId
          );
          const updatedForSaleProducts = prevProducts.forSaleProducts.filter(
            (product) => product.productId !== selectedProduct.productId
          );
          const updatedSoldOutProducts = prevProducts.soldOutProducts.filter(
            (product) => product.productId !== selectedProduct.productId
          );

          let targetList;
          if (newProductStatus === 1) {
            targetList = [
              ...prevProducts.forSellProducts,
              { ...selectedProduct, status: newProductStatus },
            ];
          } else if (newProductStatus === 2) {
            targetList = [
              ...prevProducts.soldOutProducts,
              { ...selectedProduct, status: newProductStatus },
            ];
          } else {
            targetList = [
              ...prevProducts.draftProducts,
              { ...selectedProduct, status: newProductStatus },
            ];
          }

          return {
            ...prevProducts,
            draftProducts:
              newProductStatus === 0 ? targetList : updatedDraftProducts,
            forSellProducts:
              newProductStatus === 1 ? targetList : updatedForSellProducts,
            forSaleProducts: updatedForSaleProducts,
            soldOutProducts:
              newProductStatus === 2 ? targetList : updatedSoldOutProducts,
          };
        });

        setIsSaving(false);
        setEditModalOpen(false);
      } catch (error) {
        setIsSaving(false);
        toast.error(error.message || "Failed to update product status");
      }
    }
  };

  const handleDiscountUpdate = async (productId, newDiscount) => {
    try {
      const parsedDiscount = parseFloat(newDiscount);
      if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
        throw new Error("Invalid discount value");
      }
      await updateProductDiscount(productId, parsedDiscount);
      setProducts((prevProducts) => {
        const updateProductList = (list) =>
          list.map((product) =>
            product.productId === productId
              ? { ...product, discountPercentage: parsedDiscount }
              : product
          );

        return {
          ...prevProducts,
          forSaleProducts: updateProductList(prevProducts.forSaleProducts),
          forSellProducts: updateProductList(prevProducts.forSellProducts),
          draftProducts: updateProductList(prevProducts.draftProducts),
          soldOutProducts: updateProductList(prevProducts.soldOutProducts),
        };
      });
      toast.success("Success! The discount has been applied to the product.");
    } catch (error) {
      toast.error(
        error.message || "Failed to update discount. Please try again."
      );
    } finally {
      setEditingDiscount(null);
    }
  };

  const handleDiscountBlur = (productId, newValue) => {
    const parsedValue = parseFloat(newValue);
    const currentProduct =
      products.forSellProducts.find((p) => p.productId === productId) ||
      products.forSaleProducts.find((p) => p.productId === productId) ||
      products.draftProducts.find((p) => p.productId === productId) ||
      products.soldOutProducts.find((p) => p.productId === productId);

    if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100) {
      toast.error("Please enter a valid discount between 0 and 100");
      setEditingDiscount(null);
    } else if (parsedValue !== currentProduct.discountPercentage) {
      handleDiscountUpdate(productId, parsedValue);
    } else {
      setEditingDiscount(null);
    }
  };

  const filteredProducts = (list) =>
    list.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const renderProductTable = (productList) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                <TableCell padding="checkbox" />
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
                  Items
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
                  Score
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
                  Prices
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
                  Discount
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
                  Stock
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "text.secondary" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {productList.map((product) => (
                <TableRow
                  key={product.productId}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedProducts.includes(product.productId)}
                      onChange={() => handleProductSelect(product.productId)}
                      sx={{
                        color: "grey.400",
                        "&.Mui-checked": {
                          color: "#F38E58",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <img
                        src={product.mainImage.replace("\\", "/")}
                        alt={product.productName}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 8,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Typography variant="body2" fontWeight="medium">
                        {product.productName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          mb: 0.5,
                          color: "text.secondary",
                        }}
                      >
                        {product.productScore}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={getScoreProgress(product.productScore)}
                        sx={{
                          width: "100px",
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "grey.200",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#F38E58",
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      £{product.pricePerItem.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {editingDiscount === product.productId ? (
                      <TextField
                        type="number"
                        defaultValue={product.discountPercentage || 0}
                        onBlur={(e) => {
                          handleDiscountBlur(product.productId, e.target.value);
                          setEditingDiscount(null);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleDiscountUpdate(
                              product.productId,
                              e.target.value
                            );
                            setEditingDiscount(null);
                          }
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                          inputProps: { min: 0, max: 100 },
                        }}
                        sx={{
                          width: "80px",
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#F38E58",
                            },
                            "&:hover fieldset": {
                              borderColor: "#F38E58",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#F38E58",
                            },
                          },
                        }}
                        autoFocus
                      />
                    ) : (
                      <Button
                        variant="text"
                        onClick={() => setEditingDiscount(product.productId)}
                        sx={{
                          color: "text.secondary",
                          "&:hover": {
                            backgroundColor: "rgba(243, 142, 88, 0.08)",
                            color: "#F38E58",
                          },
                        }}
                      >
                        {product.discountPercentage || 0}%
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          product.status === 1
                            ? "success.main"
                            : product.status === 2
                            ? "error.main"
                            : "text.secondary",
                        fontWeight: "medium",
                      }}
                    >
                      {ProductStatusMap[product.status]}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {product.stockQuantity}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        color: "#F38E58",
                        borderColor: "#F38E58",
                        "&:hover": {
                          backgroundColor: "rgba(243, 142, 88, 0.08)",
                          borderColor: "#F38E58",
                        },
                      }}
                      onClick={() => handleEditClick(product)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          pb: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
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
          Product List
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus />}
            sx={{
              bgcolor: "#F38E58",
              "&:hover": {
                bgcolor: "#e67d47",
              },
              boxShadow: "none",
              py: 1.2,
              px: 3,
            }}
            onClick={() => navigate("/seller/addproduct")}
          >
            Add Products
          </Button>
        </Stack>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "medium",
              color: "text.secondary",
            },
            "& .Mui-selected": {
              color: "#F38E58 !important",
              fontWeight: "bold",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#F38E58",
            },
          }}
        >
          <Tab label={`Available (${products.forSellProducts.length})`} />
          <Tab label={`On Sale (${products.forSaleProducts.length})`} />
          <Tab label={`Drafts (${products.draftProducts.length})`} />
          <Tab label={`Sold Out (${products.soldOutProducts.length})`} />
        </Tabs>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="gray" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              backgroundColor: "background.paper",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "divider",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#F38E58",
              },
            },
          }}
        />
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderProductTable(filteredProducts(products.forSellProducts))}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderProductTable(filteredProducts(products.forSaleProducts))}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderProductTable(filteredProducts(products.draftProducts))}
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {renderProductTable(filteredProducts(products.soldOutProducts))}
      </TabPanel>

      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{
              mb: 2,
              fontWeight: "bold",
              color: "text.primary",
            }}
          >
            Edit Product Status
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Product Status</InputLabel>
            <Select
              value={productStatus}
              onChange={(e) => setProductStatus(e.target.value)}
              label="Product Status"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "divider",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#F38E58",
                },
              }}
            >
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="ForSell">Available</MenuItem>
              <MenuItem value="SoldOut">Sold Out</MenuItem>
            </Select>
          </FormControl>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              mt: 3,
              justifyContent: "space-between",
            }}
          >
            <Button
              sx={{
                backgroundColor: "transparent",
                color: "#F38E58",
                border: "1px solid #F38E58",
              }}
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              sx={{
                backgroundColor: "#F38E58",
                color: "white",
                "&:hover": {
                  backgroundColor: "#e67d47",
                },
              }}
              variant="contained"
              onClick={handleSaveStatus}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
}
