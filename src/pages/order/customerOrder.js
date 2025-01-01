import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Box,
    CircularProgress,
    Button,
    Card,
    CardContent,
    Grid,
    Collapse,
    IconButton,
    useTheme,
    useMediaQuery,
    TextField,
    InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExpandMore, ExpandLess, ShoppingBag, Search } from '@mui/icons-material';
import { getCustomerOrders } from './summaryApi';

const statusColors = {
    New: 'primary',
    Processing: 'secondary',
    Shipped: 'info',
    Delivered: 'success',
    Cancelled: 'error',
};

const StyledSearchContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2)
}));

const StyledSearchField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
        '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F38E58',
                borderWidth: '2px',
            },
        },
    },
}));

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
    },
}));

function CustomerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    navigate('/login');
                    return;
                }

                const fetchedOrders = await getCustomerOrders(userId);
                setOrders(fetchedOrders);
            } catch (err) {
                //setError('Failed to fetch active orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const handleExpandClick = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const filteredOrders = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    // Modify the error and empty state handling
    if (error) {
        return (
            <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
                <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    Something went wrong
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    {error}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/')}
                    sx={{
                        mt: 2,
                        bgcolor: "#F38E58",
                        '&:hover': {
                            bgcolor: "#D97C49",
                        },
                    }}
                >
                    Start Shopping
                </Button>
            </Container>
        );
    }

    if (orders.length === 0) {
        return (
            <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
                <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    There are no orders to show yet
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Your order history is currently empty. Start shopping now to see your orders here!
                </Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/')}
                    sx={{
                        mt: 2,
                        bgcolor: "transparent",
                        color: "#333333", 
                        border: "2px solid #333333", 
                        '&:hover': {
                            bgcolor: "#333333", 
                            color: "#FFFFFF", 
                            border: "2px solid #333333",
                        },
                        borderRadius: "8px", 
                        padding: "8px 16px", 
                        textTransform: "none", 
                        boxShadow: "none",     
                        fontWeight: "bold",   
                        transition: "all 0.3s ease-in-out",
                    }}
                >
                    Start Shopping
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#333' }}>
                My Orders
            </Typography>
            <StyledSearchContainer>
                <StyledSearchField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by order number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: '#F38E58' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </StyledSearchContainer>

            {filteredOrders.length === 0 ? (
                <Box textAlign="center" py={4}>
                    <Typography variant="h6" color="text.secondary">
                        No orders match your search criteria. Please try again with different keywords or filters.
                    </Typography>
                </Box>
            ) : (
                filteredOrders.map((order) => (
                    <StyledCard key={order.orderId}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Order #{order.orderNumber}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                <Chip
                                    label={`Status: ${order.status}`}
                                    color={statusColors[order.status] || 'default'}
                                    size="small"
                                />
                                <Chip
                                    label={`Total: £${order.totalAmount.toFixed(2)}`}
                                    color="secondary"
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    onClick={() => handleExpandClick(order.orderId)}
                                    endIcon={expandedOrder === order.orderId ? <ExpandLess /> : <ExpandMore />}
                                    sx={{ color: '#F38E58' }}
                                >
                                    {expandedOrder === order.orderId ? 'Hide Details' : 'Show Details'}
                                </Button>
                            </Box>
                            <Collapse in={expandedOrder === order.orderId}>
                                <Box sx={{ mt: 2 }}>
                                    <TableContainer component={Paper} elevation={0} variant="outlined">
                                        <Table size={isMobile ? "small" : "medium"}>
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell>Product</StyledTableCell>
                                                    <StyledTableCell align="right">Price</StyledTableCell>
                                                    <StyledTableCell align="right">Quantity</StyledTableCell>
                                                    <StyledTableCell align="right">Total</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {order.orderItems.map((item) => (
                                                    <TableRow key={item.productId}>
                                                        <StyledTableCell component="th" scope="row">
                                                            {item.productName}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right">£{item.pricePerUnit.toFixed(2)}</StyledTableCell>
                                                        <StyledTableCell align="right">{item.quantity}</StyledTableCell>
                                                        <StyledTableCell align="right">£{item.totalPrice.toFixed(2)}</StyledTableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <StyledTableCell colSpan={2} />
                                                    <StyledTableCell align="right">Subtotal</StyledTableCell>
                                                    <StyledTableCell align="right">£{order.itemsTotal.toFixed(2)}</StyledTableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <StyledTableCell colSpan={2} />
                                                    <StyledTableCell align="right">Shipping</StyledTableCell>
                                                    <StyledTableCell align="right">£{order.shippingCost.toFixed(2)}</StyledTableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <StyledTableCell colSpan={2} />
                                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}>Total</StyledTableCell>
                                                    <StyledTableCell align="right" sx={{ fontWeight: 'bold' }}>£{order.totalAmount.toFixed(2)}</StyledTableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            Shipping Address:
                                        </Typography>
                                        <Typography variant="body2">
                                            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            Payment Method:
                                        </Typography>
                                        <Typography variant="body2">
                                            {order.paymentMethod || "Not Available"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Collapse>
                        </CardContent>
                    </StyledCard>
                )
                ))}
        </Container>
    );
}

export default CustomerOrders;
