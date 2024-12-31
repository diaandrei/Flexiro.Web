import React from "react";
import {
  Box,
  TextField,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Typography,
  Paper,
  Grid,
  Divider,
} from "@mui/material";

function ShippingDetail() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1200px", mx: "auto" }}>
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: "16px" }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontSize: { xs: "1.1rem", md: "1.25rem" } }}
            >
              My Orders
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={1}></Grid>
                <Grid item xs={8}></Grid>
                <Grid item xs={3} sx={{ textAlign: "right" }}></Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={1}></Grid>
                <Grid item xs={8}></Grid>
                <Grid item xs={3} sx={{ textAlign: "right" }}>
                  £0
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  Subtotal
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  £0
                </Grid>
                <Grid item xs={6}>
                  Shipping
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  £0
                </Grid>
                <Grid item xs={6}>
                  Tax
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  £4.00
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography fontWeight="bold">Order Total</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "right" }}>
                <Typography fontWeight="bold">£0</Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Payment
              </Typography>
              <RadioGroup defaultValue="direct">
                <FormControlLabel
                  value="direct"
                  control={<Radio />}
                  label="Direct Bank Transfer"
                />
                <FormControlLabel
                  value="paypal"
                  control={<Radio />}
                  label="Paypal"
                />
                <FormControlLabel
                  value="cash"
                  control={<Radio />}
                  label="Cash On Delivery"
                />
              </RadioGroup>
            </Box>

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                bgcolor: "black",
                color: "white",
                "&:hover": { bgcolor: "black" },
                py: 1.5,
                borderRadius: "8px",
              }}
            >
              SUBMIT ORDER
            </Button>

            <Typography
              variant="caption"
              sx={{ display: "block", mt: 2, color: "text.secondary" }}
            ></Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 3, fontSize: { xs: "1.25rem", md: "1.5rem" } }}
            >
              Shipping Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First Name" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email Address" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Address" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Country" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Postcode" variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="City" variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Add to address book"
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ShippingDetail;
