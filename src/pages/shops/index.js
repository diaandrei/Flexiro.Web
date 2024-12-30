'use client'

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getShopItems, selectShop } from '../../features/shop/shopSlice';
import { Typography, Box, Grid, Pagination, useMediaQuery, useTheme, Container } from '@mui/material';
import ShopCard from './ShopCard';
import ImageWithTextOverlay from "./ImageWithTextOverlay";
import ProductCardView from './ProductCardView';
import ImageCarousel from './ImageCarousel';
import bannerImage from './BannerImg.jpg';
import CustomLoader from '../../CustomLoader';
import GlobalNotification from '../../GlobalNotification';
import { useSearch } from '../../context/searchContext';
import { Link } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify';
const ITEMS_PER_PAGE = 12;

const Shops = () => {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const notificationRef = useRef();
  const { searchQuery } = useSearch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { items = [], status } = useSelector(selectShop);
  const shops = items.shops || [];
  const products = items.saleProducts || [];
  const topRated = items.topRatedAffordableProducts || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getShopItems()).unwrap();
      } catch (error) {
      }
    };

    fetchData();
  }, [dispatch]);

  const filteredItems = useMemo(() => {
    return searchQuery && searchQuery.trim()
      ? shops.filter(item => item.shopName && item.shopName.toLowerCase().includes(searchQuery.toLowerCase()))
      : shops;
  }, [searchQuery, shops]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Container maxWidth="xl">
      <GlobalNotification ref={notificationRef} />
      {!searchQuery && (
        <Box sx={{ mb: { xs: 2, sm: 4 } }}>
          <ImageWithTextOverlay imageSrc={bannerImage} text="10" alt="Banner" />
        </Box>
      )}

      {status === 'loading' ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CustomLoader circlesize={40} />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" width="100%" my={{ xs: 4, sm: 6, md: 8 }}>
          <Typography variant={isMobile ? "h4" : "h2"} sx={{ width: '100%', textAlign: 'center', fontWeight: 'bold', my: { xs: 2, sm: 3, md: 4 } }}>
            SHOPS
          </Typography>
          {currentItems.length > 0 ? (
            <Box sx={{ width: '100%' }}>
              <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                {currentItems.map((item) => (
                  <Grid item xs={6} sm={4} md={3} key={item.shopId}>
                    <Link to={`/shop/${item.shopId}`} style={{ textDecoration: 'none' }}>

                      <ShopCard image={item.shopLogo} brandName={item.shopName} rating={3} />
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Typography variant="body1" color="textSecondary" textAlign="center" width="100%">
              No Items
            </Typography>
          )}

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={{ xs: 2, sm: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                variant="outlined"
                shape="rounded"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Shops;