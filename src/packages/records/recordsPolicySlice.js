import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recordspagesize: 2,
};

const recordsPolicySlice = createSlice({
  name: "recordsPolicy",
  initialState,
});

export const selectRecordsPageSize = (state) =>
  state.recordsPolicy.recordspagesize;

export default recordsPolicySlice.reducer;
