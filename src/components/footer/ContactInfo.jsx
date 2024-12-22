import React from "react";
import { Box, Typography, Link } from "@mui/material";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import EmailIcon from "@mui/icons-material/EmailOutlined";

const ContactInfo = ({ phone, email }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      textAlign: "center",
    }}
  >
    <Typography variant="h6" sx={{ marginBottom: "15px" }}>
      Contact Us
    </Typography>
    <Box display="flex" alignItems="center" mt={1} justifyContent="center">
      <PhoneIcon sx={{ color: "orange", marginRight: 1 }} />
      <Link
        href={`tel:${phone}`}
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        {phone}
      </Link>
    </Box>
    <Box display="flex" alignItems="center" mt={1} justifyContent="center">
      <EmailIcon sx={{ color: "orange", marginRight: 1 }} />
      <Link
        href={`mailto:${email}`}
        sx={{ color: "inherit", textDecoration: "none" }}
      >
        {email}
      </Link>
    </Box>
  </Box>
);

export default ContactInfo;
