import React from "react";
import { Box, Link } from "@mui/material";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

const socialIconStyle = {
  fontSize: "20px",
  color: "#666",
  margin: "0 5px",
};

const iconMap = {
  facebook: <Facebook style={socialIconStyle} />,
  instagram: <Instagram style={socialIconStyle} />,
  twitter: <Twitter style={socialIconStyle} />,
};

const SocialLinks = ({ links }) => (
  <Box sx={{ display: "flex" }}>
    {links.map((link, index) => (
      <Link
        href={link.url}
        key={index}
        target="_blank"
        rel="noopener noreferrer"
      >
        {iconMap[link.platform]}
      </Link>
    ))}
  </Box>
);

export default SocialLinks;
