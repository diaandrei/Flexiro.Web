"use client";

import React, { useRef } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import ProductCard from "./ProductCard";

const ProductCardView = ({ products }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const scrollContainerRef = useRef(null);

  const maxDisplay = 4;

  return (
    <Container maxWidth="lg">
      <Box
        sx={{ padding: { xs: "10px", sm: "15px", md: "20px" }, width: "100%" }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={{ xs: 4, sm: 6, md: 8 }}
        >
          <Box
            sx={{
              flexGrow: 1,
              height: "1px",
              backgroundColor: "#F38E58",
              mx: { xs: 2, sm: 4, md: 8 },
            }}
          />
          <Typography
            variant={isMobile ? "h4" : isTablet ? "h3" : "h2"}
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              px: { xs: 1, sm: 2, md: 3 },
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            FLASH SALE TODAY
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              height: "1px",
              backgroundColor: "#F38E58",
              mx: { xs: 2, sm: 4, md: 8 },
            }}
          />
        </Box>

        <Box
          ref={scrollContainerRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            gap: { xs: 2, sm: 3, md: 4 },
            pb: 2,
          }}
        >
          {products.slice(0, maxDisplay).map((product, index) => (
            <Box
              key={index}
              sx={{
                flexShrink: 0,
                width: { xs: "85%", sm: "45%", md: "22%" },
                scrollSnapAlign: "center",
              }}
            >
              <ProductCard product={product} />
            </Box>
          ))}
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          my={{ xs: 3, sm: 4, md: 5 }}
        >
          <Button
            sx={{
              textDecoration: "none",
              color: "black",
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              padding: { xs: "6px 12px", sm: "8px 16px", md: "10px 20px" },
              border: "1px solid black",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            SEE MORE
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductCardView;
