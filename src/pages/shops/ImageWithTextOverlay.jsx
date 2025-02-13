"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const headings = [
  "Discover Unique Products",
  "Connect with Local Sellers",
  "Shop with Confidence",
];

const ImageWithTextOverlay = ({ imageSrc, alt }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [currentHeading, setCurrentHeading] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeading((prev) => (prev + 1) % headings.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "50vh", sm: "55vh", md: "60vh" },
        overflow: "hidden",
      }}
    >
      <motion.img
        src={imageSrc}
        alt={alt}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.6)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: { xs: 2, sm: 4 },
        }}
      >
        <Box sx={{ height: isMobile ? 60 : 70, mb: 2, mt: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant={isMobile ? "h6" : isTablet ? "h4" : "h3"}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                {headings[currentHeading]}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <ChevronDown size={20} color="white" />
      </motion.div>
    </Box>
  );
};

export default ImageWithTextOverlay;
