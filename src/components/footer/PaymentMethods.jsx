import React from "react";
import { Box, Link } from "@mui/material";

const PaymentMethods = ({ methods }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 2,
      flexWrap: "wrap",
      width: "100%",
      paddingRight: "40px",
    }}
  >
    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
      {methods.map((method, index) => (
        <Link
          href={method.url}
          target="_blank"
          rel="noopener noreferrer"
          key={index}
          sx={{
            color: "inherit",
            textDecoration: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={method.src}
            alt={method.alt}
            sx={{
              width: { xs: "20px", sm: "30px", md: "40px" },
              height: "auto",
              border: "none",
              outline: "none",
              boxShadow: "none",
            }}
          />
        </Link>
      ))}
    </div>
  </Box>
);

export default PaymentMethods;
