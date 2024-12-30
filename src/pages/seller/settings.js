'use client'

import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
    Box,
    Button,
    Container,
    Divider,
    Paper,
    Tab,
    Tabs,
    Typography,
    Grid,
    CircularProgress,
    TextField,
    Snackbar,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    Avatar,
    Card,
    CardContent,
    IconButton,
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import {
    fetchShopDetails,
    updateSellerContactInfo,
    updateShopInfo,
    changeShopStatus
} from './sellerApi';

export default function SellerSettings() {
    const [tabValue, setTabValue] = useState(0);
    const [shopData, setShopData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [isEditingStore, setIsEditingStore] = useState(false);
    const [isEditingHeader, setIsEditingHeader] = useState(false);
    const [editedEmail, setEditedEmail] = useState('');
    const userId = JSON.parse(localStorage.getItem('user'));
    const seller = userId?.sellerId;
    const [editedPhone, setEditedPhone] = useState('');
    const [editedStoreName, setEditedStoreName] = useState('');
    const [editedSlogan, setEditedSlogan] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedStoreStatus, setEditedStoreStatus] = useState(false);
    const [editedOpeningDay, setEditedOpeningDay] = useState('');
    const [editedClosingDay, setEditedClosingDay] = useState('');
    const [editedOpeningTime, setEditedOpeningTime] = useState('');
    const [editedClosingTime, setEditedClosingTime] = useState('');
    const [editedShopLogo, setEditedShopLogo] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const fileInputRef = useRef(null);
    const [validationErrors, setValidationErrors] = useState({
        email: '',
        phone: '',
        slogan: '',
        description: ''
    });

    const validateWordCount = (text, maxWords, fieldName) => {
        if (!text) return '';

        // Split by whitespace and filter out empty strings
        const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

        if (wordCount > maxWords) {
            return `${fieldName} should not be more than ${maxWords} words. Current: ${wordCount} words`;
        }
        return '';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const ownerId = user?.sellerId;
                const response = await fetchShopDetails(ownerId);
                if (response.success) {
                    setShopData(response.content);
                    setEditedEmail(response.content.email);
                    setEditedPhone(response.content.phoneNumber);
                    setEditedStoreName(response.content.shopName);
                    setEditedSlogan(response.content.slogan);
                    setEditedDescription(response.content.shopDescription);
                    setEditedStoreStatus(response.content.sellerStatus === 0);
                    setEditedOpeningDay(response.content.openingDay);
                    setEditedClosingDay(response.content.closingDay);
                    setEditedOpeningTime(response.content.openingTime);
                    setEditedClosingTime(response.content.closingTime);
                } else {
                    toast.error(response.description);
                }
            } catch (err) {
                setError('An error occurred while fetching shop details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return 'Email is required';
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    // Phone validation function
    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        if (!phone) {
            return 'Phone number is required';
        }
        if (!phoneRegex.test(phone)) {
            return 'Please enter a 10-digit phone number.';
        }
        return '';
    };

    const handleEdit = (section) => {
        switch (section) {
            case 'contact':
                setIsEditingContact(true);
                break;
            case 'store':
                setIsEditingStore(true);
                break;
            case 'status':
                setIsEditingStatus(true);
                break;
            case 'header':
                setIsEditingHeader(true);
                break;
            default:
                break;
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setEditedShopLogo(file);
            const previewURL = URL.createObjectURL(file);
            setShopData((prevData) => ({
                ...prevData,
                shopLogo: previewURL,
            }));
        }
    };

    const handleSave = async (section) => {
        try {
            let response;
            switch (section) {
                case 'contact':
                    const emailError = validateEmail(editedEmail);
                    const phoneError = validatePhone(editedPhone);
                    // Update validation errors
                    setValidationErrors({
                        email: emailError,
                        phone: phoneError
                    });

                    if (emailError || phoneError) {
                        return;
                    }
                    response = await updateSellerContactInfo(seller, editedEmail, editedPhone);
                    if (response.success) {
                        setShopData({ ...shopData, email: editedEmail, phoneNumber: editedPhone });
                        setIsEditingContact(false);

                    }
                    break;
                case 'status':
                    response = await changeShopStatus(shopData.shopId, editedStoreStatus ? 0 : 1, editedOpeningDay, editedClosingDay, editedOpeningTime, editedClosingTime);
                    if (response.success) {
                        setShopData({
                            ...shopData,
                            sellerStatus: editedStoreStatus ? 0 : 1,
                            openingDay: editedOpeningDay,
                            closingDay: editedClosingDay,
                            openingTime: editedOpeningTime,
                            closingTime: editedClosingTime,
                        });
                        setIsEditingStatus(false);

                    }
                    break;
                case 'store':
                case 'header':
                    const sloganError = validateWordCount(editedSlogan, 8, 'Slogan');
                    const descriptionError = validateWordCount(editedDescription, 20, 'Description');
                    const shopNameError = validateWordCount(editedStoreName, 4, 'StoreName');
                    setValidationErrors({
                        ...validationErrors,
                        slogan: sloganError,
                        description: descriptionError,
                        shopName: shopNameError
                    });

                    if (sloganError || descriptionError || shopNameError) {
                        return;
                    }

                    response = await updateShopInfo(shopData.shopId, editedStoreName, editedSlogan, editedDescription, editedShopLogo);
                    if (response.data.success) {
                        setShopData({
                            ...shopData,
                            shopName: editedStoreName,
                            slogan: editedSlogan,
                            shopDescription: editedDescription
                        });
                        setIsEditingStore(false);
                        setIsEditingHeader(false);
                        setValidationErrors({
                            ...validationErrors,
                            slogan: '',
                            description: ''
                        });
                        toast.success('Store information updated successfully!');
                    }
                    break;
                default:
                    break;
            }
        } catch (err) {
            toast.error('Something went wrong while updating. Please try again.');
        }
    };

    const handleCancel = (section) => {
        switch (section) {
            case 'contact':
                setEditedEmail(shopData.email);
                setEditedPhone(shopData.phoneNumber);
                setIsEditingContact(false);

                setValidationErrors({ email: '', phone: '' });
                break;
            case 'store':
                setEditedStoreName(shopData.shopName);
                setEditedSlogan(shopData.slogan);
                setEditedDescription(shopData.shopDescription);
                setIsEditingStore(false);
                break;
            case 'status':
                setEditedStoreStatus(shopData.sellerStatus === 0);
                setEditedOpeningDay(shopData.openingDay);
                setEditedClosingDay(shopData.closingDay);
                setEditedOpeningTime(parseInt(shopData.openingTime.split(':')[0]) || 1);
                setEditedClosingTime(parseInt(shopData.closingTime.split(':')[0]) || 1);
                setIsEditingStatus(false);
                break;
            case 'header':
                setEditedShopLogo(null);
                setIsEditingHeader(false);
                break;
            default:
                break;
        }
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Typography color="error">No details found</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Typography variant="h4" component="h1" sx={{
                fontWeight: 700,
                color: '#2c3e50',
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '5%',
                    height: 4,
                    backgroundColor: '#F38E58',
                    borderRadius: 2,

                }
            }}>
                Settings
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4, mt: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{
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
                }}>
                    <Tab label="Information" />
                </Tabs>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Store Header</Typography>
                                {isEditingHeader ? (
                                    <Box>
                                        <IconButton onClick={() => handleSave('header')} color="primary">
                                            <Save />
                                        </IconButton>
                                        <IconButton onClick={() => handleCancel('header')} color="secondary">
                                            <Cancel />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <IconButton onClick={() => handleEdit('header')} sx={{ color: "#f38e58" }} >
                                        <Edit />
                                    </IconButton>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: 2 }}>
                                {isEditingHeader ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                            ref={fileInputRef}
                                        />
                                        <Button sx={{ color: "white", backgroundColor: "#f38e58" }} variant="contained" onClick={() => fileInputRef.current.click()}>
                                            Choose Image
                                        </Button>
                                        {editedShopLogo && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                {editedShopLogo.name}
                                            </Typography>
                                        )}
                                    </Box>
                                ) : (
                                    <img
                                        src={shopData.shopLogo}
                                        alt="Shop Logo"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', height: "200", width: 200 }}
                                    />
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Store Information</Typography>
                                {isEditingStore ? (
                                    <Box>
                                        <IconButton onClick={() => handleSave('store')} color="primary">
                                            <Save />
                                        </IconButton>
                                        <IconButton onClick={() => handleCancel('store')} color="secondary">
                                            <Cancel />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <IconButton onClick={() => handleEdit('store')} sx={{ color: "#f38e58" }}>
                                        <Edit />
                                    </IconButton>
                                )}
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Store Name
                                </Typography>
                                {isEditingStore ? (
                                    <TextField
                                        fullWidth
                                        value={editedStoreName}

                                        onChange={(e) => {
                                            setEditedStoreName(e.target.value);
                                            setValidationErrors({
                                                ...validationErrors,
                                                shopName: validateWordCount(e.target.value, 4, 'StoreName')
                                            });
                                        }}
                                        size="small"
                                        error={!!validationErrors.shopName}
                                        helperText={validationErrors.shopName}
                                    />
                                ) : (
                                    <Typography variant="body1">{shopData.shopName}</Typography>
                                )}
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Slogan
                                </Typography>
                                {isEditingStore ? (
                                    <TextField
                                        fullWidth
                                        value={editedSlogan}
                                        onChange={(e) => {
                                            setEditedSlogan(e.target.value);
                                            setValidationErrors({
                                                ...validationErrors,
                                                slogan: validateWordCount(e.target.value, 8, 'Slogan')
                                            });
                                        }}
                                        size="small"

                                        multiline
                                        rows={2}

                                        error={!!validationErrors.slogan}
                                        helperText={validationErrors.slogan}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        whiteSpace: 'pre-wrap'
                                    }}>{shopData.slogan}</Typography>
                                )}
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Description
                                </Typography>
                                {isEditingStore ? (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={editedDescription}
                                        onChange={(e) => {
                                            setEditedDescription(e.target.value);
                                            setValidationErrors({
                                                ...validationErrors,
                                                description: validateWordCount(e.target.value, 20, 'Description')
                                            });
                                        }}
                                        size="small"
                                        error={!!validationErrors.description}
                                        helperText={validationErrors.description}
                                    />
                                ) : (
                                    <Typography variant="body1" sx={{
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        whiteSpace: 'pre-wrap',
                                        maxHeight: '200px',
                                        overflowY: 'auto'
                                    }}>
                                        {shopData.shopDescription}
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Verification</Typography>
                                {isEditingContact ? (
                                    <Box>
                                        <IconButton onClick={() => handleSave('contact')} color="primary">
                                            <Save />
                                        </IconButton>
                                        <IconButton onClick={() => handleCancel('contact')} color="secondary">
                                            <Cancel />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <IconButton onClick={() => handleEdit('contact')} sx={{ color: "#f38e58" }}>
                                        <Edit />
                                    </IconButton>
                                )}
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Email Address
                                </Typography>
                                {isEditingContact ? (
                                    <TextField
                                        fullWidth
                                        value={editedEmail}
                                        onChange={(e) => {
                                            setEditedEmail(e.target.value);
                                            setValidationErrors({
                                                ...validationErrors,
                                                email: validateEmail(e.target.value)
                                            });
                                        }}
                                        size="small"
                                        error={!!validationErrors.email}
                                        helperText={validationErrors.email}
                                    />
                                ) : (
                                    <Typography variant="body1">{shopData.email}</Typography>
                                )}
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Phone
                                </Typography>
                                {isEditingContact ? (
                                    <TextField
                                        fullWidth
                                        value={editedPhone}
                                        onChange={(e) => {
                                            // Only allow numeric input
                                            const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                            setEditedPhone(numericValue);
                                            setValidationErrors({
                                                ...validationErrors,
                                                phone: validatePhone(numericValue)
                                            });
                                        }}
                                        size="small"
                                        error={!!validationErrors.phone}
                                        helperText={validationErrors.phone}
                                        inputProps={{ maxLength: 10 }}
                                    />
                                ) : (
                                    <Typography variant="body1">{shopData.phoneNumber}</Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Store Status</Typography>
                                {isEditingStatus ? (
                                    <Box>
                                        <IconButton onClick={() => handleSave('status')} color="primary">
                                            <Save />
                                        </IconButton>
                                        <IconButton onClick={() => handleCancel('status')} color="secondary">
                                            <Cancel />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <IconButton onClick={() => handleEdit('status')} sx={{ color: "#f38e58" }}>
                                        <Edit />
                                    </IconButton>
                                )}
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Store Status
                                </Typography>
                                {isEditingStatus ? (
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={editedStoreStatus}
                                                onChange={(e) => setEditedStoreStatus(e.target.checked)}
                                                color="primary"
                                            />
                                        }
                                        label={editedStoreStatus ? "Store Open" : "Store Closed"}
                                    />
                                ) : (
                                    <Typography variant="body1" color={shopData.sellerStatus === 0 ? "success.main" : "error.main"}>
                                        {shopData.sellerStatus === 0 ? 'Store Open' : 'Store Closed'}
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Open Days
                                </Typography>
                                {isEditingStatus ? (
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Select
                                            value={editedOpeningDay}
                                            onChange={(e) => setEditedOpeningDay(e.target.value)}
                                            size="small"
                                        >
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                                <MenuItem key={day} value={day}>{day}</MenuItem>
                                            ))}
                                        </Select>
                                        <Typography variant="body1">to</Typography>
                                        <Select
                                            value={editedClosingDay}
                                            onChange={(e) => setEditedClosingDay(e.target.value)}
                                            size="small"
                                        >
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                                <MenuItem key={day} value={day}>{day}</MenuItem>
                                            ))}
                                        </Select>
                                    </Box>
                                ) : (
                                    <Typography variant="body1">
                                        {shopData.openingDay} - {shopData.closingDay}
                                    </Typography>
                                )}
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Open Hours
                                </Typography>
                                {isEditingStatus ? (
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField
                                            type="number"
                                            value={editedOpeningTime}
                                            onChange={(e) => {
                                                const value = Math.max(1, Math.min(24, parseInt(e.target.value) || 1));
                                                setEditedOpeningTime(value);
                                            }}
                                            size="small"
                                            inputProps={{ min: 1, max: 24 }}
                                        />
                                        <Typography variant="body1">to</Typography>
                                        <TextField
                                            type="number"
                                            value={editedClosingTime}
                                            onChange={(e) => {
                                                const value = Math.max(1, Math.min(24, parseInt(e.target.value) || 1));
                                                setEditedClosingTime(value);
                                            }}
                                            size="small"
                                            inputProps={{ min: 1, max: 24 }}
                                        />
                                    </Box>
                                ) : (
                                    <Typography variant="body1">
                                        {shopData.openingTime} - {shopData.closingTime}
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Container>
    );
}