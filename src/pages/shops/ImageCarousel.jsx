"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const ImageCarousel = ({ topRated = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const visibleProducts = isMobile ? 1 : 3;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0
        ? prevIndex - 1
        : Math.max(0, topRated.length - visibleProducts)
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, topRated.length - visibleProducts);
      return prevIndex < maxIndex ? prevIndex + 1 : 0;
    });
  };

  useEffect(() => {
    if (topRated.length <= visibleProducts) return;

    const intervalId = setInterval(() => {
      handleNext();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [topRated.length, visibleProducts]);

  // If no products, return null
  if (!topRated.length) return null;

  return (
    <Box
      sx={{
        my: 4,
        position: "relative",
        maxWidth: 1200,
        margin: "auto",
        px: { xs: 2, sm: 4 },
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          width: "100%",
          textAlign: "center",
          fontWeight: "bold",
          my: { xs: 2, sm: 3, md: 4 },
        }}
      >
        Hot Products
      </Typography>

      <Box
        sx={{
          display: "flex",
          transition: "transform 0.5s ease",
          padding: "12px",
          paddingLeft: "20px",
          transform: `translateX(-${currentIndex * (100 / visibleProducts)}%)`,
        }}
      >
        {topRated.map((product) => (
          <Card
            key={product.productId}
            sx={{
              minWidth: isMobile ? "100%" : `${100 / visibleProducts}%`,
              flexShrink: 0,
              mr: 2,
              boxShadow: 2,
              borderRadius: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={product.shopImage}
              alt={product.productName}
              sx={{
                objectFit: "cover",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            />
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 2,
              }}
            >
              <Box>
                <Typography
                  gutterBottom
                  variant="h6"
                  noWrap
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {product.productName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    mb: 2,
                    minHeight: 40,
                  }}
                >
                  {product.description}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Typography
                  variant="h6"
                  color="#262C36"
                  sx={{ fontWeight: "bold" }}
                >
                  £{product.pricePerItem}
                </Typography>
                <Button
                  component={Link}
                  to={`/product/${product.productId}`}
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: "black",
                    color: "white",
                    borderRadius: 1,
                  }}
                >
                  Shop Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {!isMobile && topRated.length > visibleProducts && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: -40,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: -40,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "background.paper",
              boxShadow: 2,
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default ImageCarousel;
