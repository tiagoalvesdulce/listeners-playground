import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  inventorypagesize: 5,
};

const inventoryPolicySlice = createSlice({
  name: "inventoryPolicy",
  initialState,
});

export const selectInventoryPageSize = (state) =>
  state.inventoryPolicy.inventorypagesize;

export default inventoryPolicySlice.reducer;
