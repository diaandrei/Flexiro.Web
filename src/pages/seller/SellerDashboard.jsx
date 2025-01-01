import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PeopleIcon from "@mui/icons-material/People";
import { fetchSellerDashboardData } from "./sellerApi";
import toast from "react-hot-toast";

const StyledPaper = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  backgroundColor: color,
  color: "#fff",
  borderRadius: "12px",
  height: { xs: "120px", sm: "160px" },
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const IconWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "12px",
  "& svg": {
    fontSize: "32px",
  },
});

const SellerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    newOrderCount: 0,
    deliveredOrderCount: 0,
    customerCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const shopId = user?.shopId;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchSellerDashboardData(shopId);
        setDashboardData({
          newOrderCount: data.newOrderCount,
          deliveredOrderCount: data.deliveredOrderCount,
          customerCount: data.customerCount,
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const dashboardItems = [
    {
      title: "New Order",
      value: dashboardData.newOrderCount,
      icon: <ShoppingCartIcon />,
      color: "#4096FF",
    },
    {
      title: "Order Delivered",
      value: dashboardData.deliveredOrderCount,
      icon: <LocalShippingIcon />,
      color: "#F38E58",
    },
    {
      title: "Customers",
      value: dashboardData.customerCount,
      icon: <PeopleIcon />,
      color: "#2C3E50",
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
      <Grid
        container
        spacing={{ xs: 2, sm: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {dashboardItems.map((item, index) => (
          <Grid item xs={4} sm={4} md={4} key={index}>
            <StyledPaper color={item.color}>
              <IconWrapper>{item.icon}</IconWrapper>
              <Box>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                  }}
                >
                  {item.value}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                  {item.title}
                </Typography>
              </Box>
            </StyledPaper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default SellerDashboard;
