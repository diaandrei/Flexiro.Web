import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Chip,
  Typography,
  Tab,
  Tabs,
  Container,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { fetchAdminDashboard } from "../admin/adminApi";
import { changeshopstatus } from "../admin/shopStatusHandler";
import toast from "react-hot-toast";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    activeShops: [],
    pendingShops: [],
    inactiveShops: [],
    allShops: [],
  });
  const [filteredShops, setFilteredShops] = useState({
    activeShops: [],
    pendingShops: [],
    inactiveShops: [],
    allShops: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAdminDashboard();

        setDashboardData(response.content);
        setFilteredShops(response.content);
      } catch (err) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterShops = (shops) => {
      return shops.filter(
        (shop) =>
          shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shop.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shop.shopDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    };

    setFilteredShops({
      allShops: filterShops(dashboardData.allShops),
      activeShops: filterShops(dashboardData.activeShops),
      pendingShops: filterShops(dashboardData.pendingShops),
      inactiveShops: filterShops(dashboardData.inactiveShops),
    });
  }, [searchQuery, dashboardData]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleEditClick = (shop) => {
    setSelectedShop(shop);
    setStatus(
      shop.adminStatus === 1
        ? "Active"
        : shop.adminStatus === 2
        ? "Inactive"
        : "Pending"
    );
    setEditModalOpen(true);
  };

  const handleStatusChange = (event) => setStatus(event.target.value);

  const handleSaveStatus = async () => {
    setIsSaving(true);
    const newStatus = status === "Active" ? 1 : status === "Inactive" ? 2 : 0;

    if (selectedShop) {
      try {
        debugger;
        await changeshopstatus(selectedShop.shopId, newStatus);
        setIsSaving(false);

        setDashboardData((prevData) => {
          const updatedShops = prevData.allShops.map((shop) =>
            shop.shopId === selectedShop.shopId
              ? { ...shop, adminStatus: newStatus }
              : shop
          );

          const updatedSelectedShop = {
            ...selectedShop,
            adminStatus: newStatus,
          };

          let updatedActiveShops = prevData.activeShops.filter(
            (shop) => shop.shopId !== selectedShop.shopId
          );
          let updatedPendingShops = prevData.pendingShops.filter(
            (shop) => shop.shopId !== selectedShop.shopId
          );
          let updatedInactiveShops = prevData.inactiveShops.filter(
            (shop) => shop.shopId !== selectedShop.shopId
          );

          // Add the updated shop to the correct array based on the new status
          if (newStatus === 1) {
            updatedActiveShops = [...updatedActiveShops, updatedSelectedShop];
          } else if (newStatus === 2) {
            updatedInactiveShops = [
              ...updatedInactiveShops,
              updatedSelectedShop,
            ];
          } else {
            updatedPendingShops = [...updatedPendingShops, updatedSelectedShop];
          }

          return {
            ...prevData,
            allShops: updatedShops,
            activeShops: updatedActiveShops,
            pendingShops: updatedPendingShops,
            inactiveShops: updatedInactiveShops,
          };
        });

        setEditModalOpen(false);
      } catch (error) {
        setIsSaving(false);
        toast.error(error.message);
      }
    }
  };

  const renderShopTable = (shops) => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="shops table">
        <TableHead>
          <TableRow>
            <TableCell>Shop</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Earnings</TableCell>
            <TableCell>Orders</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shops.map((shop) => (
            <TableRow key={shop.shopId}>
              <TableCell component="th" scope="row">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={shop.shopLogo} sx={{ mr: 2 }} />
                  <Typography variant="body1">{shop.shopName}</Typography>
                </Box>
              </TableCell>
              <TableCell>{shop.ownerName}</TableCell>

              <TableCell>
                <Typography
                  sx={{
                    maxWidth: "200px",
                    minWidth: "150px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    "&:hover": {
                      whiteSpace: "normal",
                      overflow: "visible",
                      position: "relative",
                      backgroundColor: "white",
                      zIndex: 1,
                      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                      borderRadius: "4px",
                      padding: "8px",
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  {shop.shopDescription}
                </Typography>
              </TableCell>
              <TableCell>$ {shop.totalEarnings}</TableCell>
              <TableCell>{shop.totalOrders}</TableCell>
              <TableCell>
                <Chip
                  label={`${shop.averageRating.toFixed(2)} - ${
                    shop.ratingScore
                  }`}
                  color={
                    shop.ratingScore === "Poor"
                      ? "error"
                      : shop.ratingScore === "Average"
                      ? "warning"
                      : "success"
                  }
                  size="small"
                />
              </TableCell>
              <TableCell>
                {shop.adminStatus === 1
                  ? "Active"
                  : shop.adminStatus === 2
                  ? "Inactive"
                  : "Pending"}
              </TableCell>
              <TableCell align="right">
                <Button
                  sx={{
                    color: "white",
                    backgroundColor: "#F38E58",
                    "&:hover": { backgroundColor: "#d9793e" },
                  }}
                  variant="text"
                  size="small"
                  onClick={() => handleEditClick(shop)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mb: 4, marginLeft: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#2c3e50",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: "60%",
              height: 4,
              backgroundColor: "#F38E58",
              borderRadius: 2,
            },
          }}
        >
          Shops
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}></Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
        <TextField
          sx={{
            mb: 2,
            width: "900px",
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
          label="Search Shops"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Tabs
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            mb: 2,
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
          value={tabValue}
          onChange={handleTabChange}
        >
          <Tab label="All Shops" />
          <Tab label="Active Shops" />
          <Tab label="Pending Shops" />
          <Tab label="Inactive Shops" />
        </Tabs>
        {tabValue === 0 && renderShopTable(filteredShops.allShops)}
        {tabValue === 1 && renderShopTable(filteredShops.activeShops)}
        {tabValue === 2 && renderShopTable(filteredShops.pendingShops)}
        {tabValue === 3 && renderShopTable(filteredShops.inactiveShops)}
      </Box>

      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Button
              sx={{
                backgroundColor: "#F38E58",
                color: "white",
                "&:hover": {
                  backgroundColor: "white",
                  color: "#F38E58",
                },
              }}
              variant="contained"
              fullWidth
              onClick={handleSaveStatus}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Dashboard;
