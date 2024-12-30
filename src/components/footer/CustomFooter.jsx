import React from "react";
import { Box, Container, IconButton, Stack, Link } from "@mui/material";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import logoImage from "../images/flexirowhitelogo.png";
import contactData from "../footer/ContactData";

const styles = {
  footer: {
    backgroundColor: "#0F172A",
    padding: "20px 0",
    color: "#fff",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  topSection: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    height: "24px",
    filter: "brightness(0) invert(1)",
  },
  nav: {
    display: "flex",
    gap: "32px",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "14px",
    "&:hover": {
      color: "#94A3B8",
    },
  },
  socialIcons: {
    display: "flex",
    gap: "16px",
  },
  iconButton: {
    color: "#94A3B8",
    padding: "8px",
    "&:hover": {
      color: "#fff",
    },
  },
  copyright: {
    color: "#94A3B8",
    fontSize: "14px",
    borderTop: "1px solid #1E293B",
    paddingTop: "20px",
    width: "100%",
    textAlign: "center",
  },
};

const CustomFooter = () => {
  const { socialMediaLinks = [] } = contactData || {};

  return (
    <Box sx={styles.footer}>
      <Container maxWidth="lg" sx={styles.container}>
        <Box sx={styles.topSection}>
          <img src={logoImage} alt="Logo" style={styles.logo} />
          <Box sx={styles.socialIcons}>
            {socialMediaLinks.map((link, index) => (
              <IconButton
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={styles.iconButton}
                size="small"
              >
                {link.platform === "facebook" && (
                  <Facebook sx={{ fontSize: 20 }} />
                )}
                {link.platform === "instagram" && (
                  <Instagram sx={{ fontSize: 20 }} />
                )}
                {link.platform === "twitter" && (
                  <Twitter sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CustomFooter;
