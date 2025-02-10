import React, { useState, useEffect } from 'react';
import { fetchWishlistProducts } from './sellerApi';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    useTheme,
    useMediaQuery,
} from '@mui/material';

const SellerWishlist = () => {
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const userData = localStorage.getItem('user');
    const parsedData = JSON.parse(userData);
    const shopId = parsedData.shopId;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchWishlistProducts(shopId);
                setWishlistProducts(response.content);
            } catch (error) {
                console.error('Failed to fetch wishlist products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [shopId]);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                sx={{
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                }}
            >
                <CircularProgress color="primary" size={60} thickness={4} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                padding: { xs: 2, sm: 3, md: 4 },
                minHeight: '100vh',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: '#2c3e50',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -8,
                            left: 0,
                            width: '50%',
                            height: 4,
                            backgroundColor: '#F38E58',
                            borderRadius: 2,
                        },
                    }}
                >
                    Wishlist
                </Typography>
            </Box>

            {wishlistProducts.length === 0 ? (
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        backgroundColor: '#ffffff',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" color="black">
                    No products in your wishlist yet
                    </Typography>
                </Paper>
            ) : (
                <TableContainer
                    component={Paper}
                    elevation={4}
                    sx={{
                        borderRadius: 3,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                >
                    <Table aria-label="wishlist products table">
                        <TableHead
                            sx={{
                                backgroundColor: '#f0f4f8',
                                borderBottom: '2px solid #F38E58',
                            }}
                        >
                            <TableRow>
                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color: '#2c3e50',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                    }}
                                >
                                    Image
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color: '#2c3e50',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                    }}
                                >
                                    Product Name
                                </TableCell>
                                {!isMobile && (
                                    <TableCell
                                        sx={{
                                            fontWeight: 700,
                                            color: '#2c3e50',
                                            textTransform: 'uppercase',
                                            letterSpacing: 1,
                                        }}
                                    >
                                        Description
                                    </TableCell>
                                )}
                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color: '#2c3e50',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                    }}
                                >
                                    Category
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        fontWeight: 700,
                                        color: '#2c3e50',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                    }}
                                >
                                    Price
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        fontWeight: 700,
                                        color: '#2c3e50',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                    }}
                                >
                                    Added Date
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {wishlistProducts.map((product, index) => (
                                <TableRow
                                    key={product.productId}
                                    sx={{
                                        '&:nth-of-type(even)': {
                                            backgroundColor: '#f9fafc',
                                        },
                                        '&:hover': {
                                            backgroundColor: '#f0f4f8',
                                            transition: 'background-color 0.3s ease',
                                        },
                                        borderBottom:
                                            index === wishlistProducts.length - 1
                                                ? 'none'
                                                : '1px solid rgba(224, 224, 224, 1)',
                                    }}
                                >
                                    <TableCell>
                                        <img
                                            src={product.mainImage}
                                            alt={product.productName}
                                            style={{ width: '80px', height: 'auto', borderRadius: 4 }}
                                        />
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: 600,
                                            color: '#34495e',
                                            py: 2,
                                        }}
                                    >
                                        {product.productName}
                                    </TableCell>
                                    {!isMobile && (
                                        <TableCell
                                            sx={{
                                                color: '#7f8c8d',
                                                py: 2,
                                                maxWidth: '300px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            <span title={product.productDescription}>
                                                {product.productDescription.split(' ').length > 40
                                                    ? `${product.productDescription.split(' ').slice(0, 40).join(' ')}...`
                                                    : product.productDescription}
                                            </span>
                                        </TableCell>
                                    )}
                                    <TableCell
                                        sx={{
                                            fontWeight: 500,
                                            color: '#34495e',
                                        }}
                                    >
                                        {product.category}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            fontWeight: 700,
                                            color: '#2ecc71',
                                            py: 2,
                                        }}
                                    >
                                        £{product.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            fontWeight: 500,
                                            color: '#7f8c8d',
                                        }}
                                    >
                                        {new Date(product.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default SellerWishlist;
