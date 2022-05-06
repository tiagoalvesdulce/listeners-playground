import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  records: {},
};

export const recordsSlice = createSlice({
  name: "records",
  initialState,
  reducers: {
    fetchMoreRecords(state) {},
    addBatchRecords(state, { payload }) {
      const newRecords = payload.reduce(
        (acc, cur) => ({ ...acc, [cur]: { recordInfo: cur } }),
        {}
      );
      state.records = {
        ...state.records,
        ...newRecords,
      };
    },
    addRecord(state, { payload }) {
      state.records = {
        ...state.records,
        [payload]: { recordInfo: payload },
      };
    },
    removeRecord(state, { payload }) {
      delete state.records[payload.recordInfo];
    },
  },
});

export const { fetchMoreRecords, saveLastToken, addRecord, removeRecord } =
  recordsSlice.actions;

export const selectRecords = (state) => state.records.records;

export default recordsSlice.reducer;
