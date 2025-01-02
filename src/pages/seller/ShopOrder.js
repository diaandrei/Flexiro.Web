import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography,
    Tab, Tabs, Container, Modal, FormControl, InputLabel, Select, MenuItem, TextField, CircularProgress,
    Chip, Card, CardContent, Grid, IconButton, Tooltip
} from '@mui/material';
import { Edit as EditIcon, Search as SearchIcon } from '@mui/icons-material';
import { fetchOrdersByShop, changeOrderStatus } from './sellerApi';
import toast from 'react-hot-toast';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const orderStatusLabels = {
    0: 'New',
    1: 'Pending',
    2: 'Processing',
    3: 'Shipped',
    4: 'Delivered',
    5: 'Canceled',
    6: 'Returned',
    7: 'Completed',
};

const orderStatusColors = {
    0: '#3498db',
    1: '#f39c12',
    2: '#9b59b6',
    3: '#2ecc71',
    4: '#27ae60',
    5: '#e74c3c',
    6: '#95a5a6',
    7: '#2c3e50',
};

export default function SellerOrders() {
    const [ordersData, setOrdersData] = useState({});
    const [filteredOrders, setFilteredOrders] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [status, setStatus] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const tabsRef = useRef(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const shopId = user?.shopId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchOrdersByShop(shopId);
                setOrdersData(response);
                setFilteredOrders(response);
            } catch (err) {
                toast.error(err.message || 'Failed to fetch orders. Please try again later.');
                setError('Failed to fetch orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [shopId]);

    useEffect(() => {
        const filterOrders = (orders) => {
            if (!Array.isArray(orders)) return [];
            return orders.filter(order =>
                order.orderNumber.toString().includes(searchQuery.toLowerCase()) ||
                order.shippingAddress.firstName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        };

        setFilteredOrders(Object.keys(ordersData).reduce((acc, key) => {
            acc[key] = filterOrders(ordersData[key]);
            return acc;
        }, {}));
    }, [searchQuery, ordersData]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        if (tabsRef.current) {
            tabsRef.current.scrollLeft = newValue * 100;
        }
    };

    const handleEditClick = (order) => {
        setSelectedOrder(order);
        setStatus(order.status.toString());
        setEditModalOpen(true);
    };

    const handleStatusChange = (event) => setStatus(event.target.value);

    const handleSaveStatus = async () => {
        setIsSaving(true);
        if (selectedOrder) {
            try {
                await changeOrderStatus(selectedOrder.orderId, parseInt(status));
                setOrdersData((prevData) => {
                    const newStatus = parseInt(status);
                    const oldStatus = selectedOrder.status;
                    const updatedOrder = { ...selectedOrder, status: newStatus };

                    const updateOrdersInCategory = (category) => {
                        if (category === 'allOrders') {
                            return prevData.allOrders?.map(order =>
                                order.orderId === selectedOrder.orderId ? updatedOrder : order
                            );
                        }
                        if (orderStatusLabels[newStatus].toLowerCase() + 'Orders' === category) {
                            return [...(prevData[category] || []), updatedOrder];
                        }
                        if (orderStatusLabels[oldStatus].toLowerCase() + 'Orders' === category) {
                            return (prevData[category] || []).filter(order => order.orderId !== selectedOrder.orderId);
                        }
                        return prevData[category];
                    };

                    const newData = Object.keys(prevData).reduce((acc, category) => {
                        acc[category] = updateOrdersInCategory(category);
                        return acc;
                    }, {});

                    return newData;
                });
                setEditModalOpen(false);

            } catch (error) {
                toast.error(error.message || 'Failed to update order status. Please try again.');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const renderOrderTable = (orders) => (
        <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 650 }} aria-label="orders table">
                <TableHead>
                    <TableRow>
                        <TableCell>Order Number</TableCell>
                        <TableCell>Products</TableCell>
                        <TableCell>Shipping Address</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders?.map((order) => (
                        <TableRow key={order.orderId} hover>
                            <TableCell component="th" scope="row">{order.orderNumber}</TableCell>
                            <TableCell>
                                <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                                    {order.orderItems?.map((item) => (
                                        <li key={item.orderDetailsId}>
                                            {item.productName} (Qty: {item.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </TableCell>
                            <TableCell>
                                {`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}, ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postcode}`}
                            </TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>£{order.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>
                                <Chip
                                    label={orderStatusLabels[order.status]}
                                    style={{
                                        backgroundColor: orderStatusColors[order.status],
                                        color: '#ffffff',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title="Edit Order Status">
                                    <IconButton onClick={() => handleEditClick(order)} size="small">
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Typography color="error">{error}</Typography>
        </Box>
    );

    const tabs = [
        { label: 'All Orders', key: 'allOrders' },
        { label: 'New Orders', key: 'newOrders' },
        { label: 'Processing Orders', key: 'processingOrders' },
        { label: 'Shipped Orders', key: 'shippedOrders' },
        { label: 'Delivered Orders', key: 'deliveredOrders' },
        { label: 'Canceled Orders', key: 'canceledOrders' },
        { label: 'Completed Orders', key: 'completedOrders' },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
            <Typography variant="h4" sx={{
                fontWeight: 700,
                color: '#2c3e50',
                mb: 4,
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '10%',
                    height: 4,
                    backgroundColor: '#F38E58',
                    borderRadius: 2,

                }
            }}>Orders Management</Typography>

            <Card elevation={3} sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Search orders by name or number"
                                variant="outlined"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon color="action" />,

                                    sx: {
                                        borderRadius: 2,
                                        backgroundColor: 'background.paper',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'divider'
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#F38E58'
                                        }
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Box sx={{ width: '100%', mb: 4 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="order status tabs"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 'medium',
                            color: 'text.secondary',
                        },
                        '& .Mui-selected': {
                            color: '#F38E58 !important',
                            fontWeight: 'bold'
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#F38E58'
                        }
                    }}
                >
                    {tabs.map((tab, index) => (
                        <Tab key={index} label={tab.label} />
                    ))}
                </Tabs>
            </Box>

            {tabs.map((tab, index) =>
                tabValue === index && (
                    <Box key={tab.key} sx={{ mt: 2 }}>
                        {renderOrderTable(filteredOrders[tab.key])}
                    </Box>
                )
            )}

            <Modal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                aria-labelledby="edit-order-status-modal"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        Edit Order Status
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            value={status}
                            label="Status"
                            onChange={handleStatusChange}
                        >
                            {Object.entries(orderStatusLabels).map(([value, label]) => (
                                <MenuItem key={value} value={value}>{label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSaveStatus}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
}