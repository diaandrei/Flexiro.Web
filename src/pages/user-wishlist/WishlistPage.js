import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    CircularProgress,
    Box,
    Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Favorite, ShoppingCart } from '@mui/icons-material';
import { getWishlistProducts, removeProductFromWishlist } from './wishlistApi';
import toast from 'react-hot-toast';

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.03)',
    },
}));

const StyledCardMedia = styled(CardMedia)({
    paddingTop: '56.25%',
});

const StyledCardContent = styled(CardContent)({
    flexGrow: 1,
});

const WishlistPage = () => {
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    throw new Error('User ID not found');
                }
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
            if (!userId) {
                throw new Error('User ID not found');
            }
            const response = await removeProductFromWishlist(productId, userId);
            if (response.success) {
                setWishlistProducts(prevProducts => prevProducts.filter(product => product.productId !== productId));
                toast.success("Product successfully removed from your wishlist")
            } else {
                throw new Error(response.description || 'Failed to remove product from wishlist');
            }
        } catch (err) {

        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography>{"No products in your wishlist"}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                Wishlist
            </Typography>
            {wishlistProducts.length === 0 ? (
                <Typography variant="h6" align="center">
                    Your wishlist is empty. Start adding some products now!
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {wishlistProducts.map((product) => (
                        <Grid item key={product.productId} xs={12} sm={6} md={4}>
                            <StyledCard>
                                <StyledCardMedia
                                    image={product.mainImage}
                                    title={product.productName}
                                />
                                <StyledCardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {product.productName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {product.productDescription}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: "#262C36" }}>
                                        ${product.price.toFixed(2)}
                                    </Typography>
                                    <Typography variant="caption" display="block" gutterBottom>
                                        Category: {product.category}
                                    </Typography>
                                </StyledCardContent>
                                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Favorite />}
                                        onClick={() => handleRemoveFromWishlist(product.productId)}
                                        sx={{ borderColor: '#F38E58', color: '#F38E58' }}
                                    >
                                        Remove
                                    </Button>

                                </Box>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
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