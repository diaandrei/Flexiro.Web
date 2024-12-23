import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFooterData } from "./footerApi";

export const getFooterData = createAsyncThunk(
  "footerdata/getData",
  async () => {
    const response = await fetchFooterData();

    return response.data;
  }
);

// Redux slice to handle contact data and status
const FooterDataSlice = createSlice({
  name: "footerdata",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFooterData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFooterData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getFooterData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectFooterData = (state) => state.footerdata.data;
export default FooterDataSlice.reducer;
