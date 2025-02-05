import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Favorite } from '@mui/icons-material';
import { getWishlistProducts, removeProductFromWishlist } from './wishlistApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProductImage = styled('img')({
    width: '100px',
    height: '100px',
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: 'cover',
    borderRadius: '8px',
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: '16px',
    '&.image-cell': {
        width: '120px',
    },
    '&.action-cell': {
        width: '150px',
    },
    cursor: "pointer"
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderColor: '#F38E58',
    color: '#F38E58',
    '&:hover': {
        borderColor: '#F38E58',
        backgroundColor: 'rgba(243, 142, 88, 0.04)',
    },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    '& .MuiTableRow-root:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
}));

const WishlistPage = () => {
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const navigate = useNavigate();
    useEffect(() => {
        const fetchWishlistProducts = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) throw new Error('User ID not found');
                const response = await getWishlistProducts(userId);
                if (response.success) {
                    setWishlistProducts(response.content);
                } else {
                    throw new Error(response.description || 'Failed to fetch wishlist products');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistProducts();
    }, []);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('User ID not found');
            const response = await removeProductFromWishlist(productId, userId);
            if (response.success) {
                setWishlistProducts(prevProducts =>
                    prevProducts.filter(product => product.productId !== productId)
                );
                toast.success("Product successfully removed from your wishlist");
            } else {
                throw new Error(response.description || 'Failed to remove product from wishlist');
            }
        } catch (err) {
            throw new Error(err.message);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const handleNavigateToProduct = (productId, event) => {
        if (event.target.closest('button')) {
            return;
        }
        navigate(`/product/${productId}`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress size={40} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography color="error" variant="h6">{"No products in your wishlist"}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    mb: 4,
                    fontWeight: 600,
                    color: '#262C36'
                }}
            >
                Wishlist ({wishlistProducts.length} items)
            </Typography>

            {wishlistProducts.length === 0 ? (
                <Typography
                    variant="h6"
                    align="center"
                    sx={{ color: 'text.secondary', my: 4 }}
                >
                    Your wishlist is empty. Start adding some products now!
                </Typography>
            ) : (
                <StyledTableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell className="image-cell">Product</StyledTableCell>
                                <StyledTableCell>Details</StyledTableCell>
                                <StyledTableCell align="left">Price</StyledTableCell>
                                <StyledTableCell className="action-cell" align="center">Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {wishlistProducts.map((product) => (
                                <TableRow key={product.productId}>
                                    <StyledTableCell className="image-cell" onClick={(e) => handleNavigateToProduct(product.productId, e)}>
                                        <ProductImage
                                            src={product.mainImage}
                                            alt={product.productName}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell className="details-cell"
                                        onClick={(e) => handleNavigateToProduct(product.productId, e)}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                            {product.productName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {product.productDescription}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Category: {product.category}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="left"
                                        onClick={(e) => handleNavigateToProduct(product.productId, e)}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        £{product.price.toFixed(2)}
                                        </Typography>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <StyledButton
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Favorite />}
                                            onClick={() => handleRemoveFromWishlist(product.productId)}
                                        >
                                            Remove
                                        </StyledButton>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            )}

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            />
        </Container>
    );
};

export default WishlistPage;