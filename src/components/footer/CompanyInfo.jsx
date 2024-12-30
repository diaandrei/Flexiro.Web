import React from "react";
import { Box, Typography, Link } from "@mui/material";

const CompanyInfo = () => (
  <Box>
    <Typography variant="h6" sx={{ marginBottom: "15px" }}>
      Company
    </Typography>
    <Link
      href="/"
      sx={{ color: "white", textDecoration: "none", display: "block", mt: 1 }}
    >
      Flash Sales
    </Link>
  </Box>
);

export default CompanyInfo;
