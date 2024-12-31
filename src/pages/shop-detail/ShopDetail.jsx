import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchShopProducts } from "../../features/shop-detail/shopDetailApi";
import {
  selectShopProducts,
  selectShopProductsStatus,
  clearProducts,
} from "../../features/shop-detail/shopDetailSlice";
import CustomLoader from "../../CustomLoader";
import GlobalNotification from "../../GlobalNotification";
import {
  Box,
  Typography,
  Grid,
  Pagination,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  useMediaQuery,
  useTheme,
  InputAdornment,
  alpha,
} from "@mui/material";
import ProductCard from "./ShopCard";
import { FaTh, FaList, FaSearch } from "react-icons/fa";

const ITEMS_PER_PAGE = 8;

export default function ShopDetail() {
  const { id: shopId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const userId = localStorage.getItem("userId");
  const products = useSelector(selectShopProducts);
  const status = useSelector(selectShopProductsStatus);
  const [page, setPage] = useState(1);
  const [viewType, setViewType] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  const notificationRef = useRef();

  useEffect(() => {
    dispatch(clearProducts());
    if (shopId) dispatch(fetchShopProducts({ shopId, userId: userId || null }));
  }, [dispatch, shopId, userId]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortOption) {
          case "PriceLowHigh":
            return a.pricePerItem - b.pricePerItem;
          case "PriceHighLow":
            return b.pricePerItem - a.pricePerItem;
          default:
            return new Date(b.dateAdded) - new Date(a.dateAdded);
        }
      });
  }, [products, searchQuery, sortOption]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handlePageChange = (_, value) => setPage(value);
  const toggleViewType = () =>
    setViewType((prev) => (prev === "grid" ? "list" : "grid"));

  if (status === "loading") return <CustomLoader />;

  if (status === "failed" && filteredProducts.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
      >
        <Typography variant="h4" gutterBottom>
          No products available right now. Please check back later
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            mt: 2,
            bgcolor: "#111827",
            color: "#fff",
            "&:hover": {
              bgcolor: "#1f2937",
            },
          }}
        >
          Go back Home
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: { xs: "20px", sm: "32px", md: "30px" },
        paddingTop: "10px !important",
        minHeight: "70vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <GlobalNotification ref={notificationRef} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mb: 4,
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <TextField
            label="Search Products"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth={isMobile}
            sx={{
              flexGrow: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
                "&.Mui-focused": {
                  backgroundColor: "white",
                  boxShadow: `0 0 0 2px ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch color={theme.palette.text.secondary} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl
            variant="outlined"
            sx={{
              minWidth: 160,
              width: { xs: "100%", sm: "auto" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "white",
                "&:hover": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              },
            }}
          >
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="Newest">Newest</MenuItem>
              <MenuItem value="PriceLowHigh">Price: Low to High</MenuItem>
              <MenuItem value="PriceHighLow">Price: High to Low</MenuItem>
            </Select>
          </FormControl>

          {!isMobile && (
            <Button
              onClick={toggleViewType}
              aria-label="Toggle view"
              variant="outlined"
              sx={{
                minWidth: "auto",
                p: 1.5,
                borderRadius: "8px",
                borderColor: alpha(theme.palette.primary.main, 0.2),
                color: theme.palette.primary.main,
                backgroundColor: "white",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {viewType === "grid" ? <FaTh size={20} /> : <FaList size={20} />}
            </Button>
          )}
        </Box>
      </Box>
      <Grid container spacing={3}>
        {paginatedProducts.map((product) => (
          <Grid
            item
            key={product.productId}
            xs={12}
            sm={viewType === "grid" ? 6 : 12}
            md={viewType === "grid" ? 4 : 12}
            lg={viewType === "grid" ? 3 : 12}
            sx={{
              display: "flex",
              mb: viewType === "grid" ? 3 : 2,
            }}
          >
            <ProductCard
              id={product.productId}
              image={product.mainImage}
              name={product.productName}
              description={product.description}
              price={product.pricePerItem}
              rating={product.averageRating}
              reviews={product.totalReviews}
              sold={product.totalSold}
              shopId={product.shopId}
              isInWishlist={product.isInWishlist}
              onClick={() => handleProductClick(product.productId)}
              viewType={viewType}
            />
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 6,
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "16px 24px",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
        }}
      >
        {filteredProducts.length > ITEMS_PER_PAGE && (
          <Pagination
            count={Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
            sx={{
              "& .MuiPagination-ul": {
                justifyContent: "center",
              },
              "& .MuiPaginationItem-root": {
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
              },
            }}
          />
        )}
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            alignSelf: { xs: "center", sm: "flex-end" },
            width: { xs: "100%", sm: "auto" },
            textAlign: { xs: "center", sm: "right" },
          }}
        >
          Viewing {paginatedProducts.length} of {filteredProducts.length}{" "}
          products
        </Typography>
      </Box>
    </Box>
  );
}
