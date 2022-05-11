import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  records: {},
  status: "idle", // pending, succeeded, failed
};

function asyncAddRecord(record) {
  return new Promise((res) => {
    setTimeout(() => {
      res(record);
    }, 1000);
  });
}

export const addRecordAsync = createAsyncThunk(
  "records/addRecordAsync",
  async (record) => {
    console.log(record);
    const response = await asyncAddRecord(record);
    console.log(response);
    return response;
  }
);

export const recordsSlice = createSlice({
  name: "records",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(addRecordAsync.fulfilled, (state, { payload }) => {
      console.log(state, payload);
      state.records = {
        ...state.records,
        [payload]: { recordInfo: payload },
      };
      state.status = "succeeded";
    });
    builder.addCase(addRecordAsync.pending, (state) => {
      state.status = "pending";
    });
  },
  reducers: {
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

export const { saveLastToken, addRecord, removeRecord } = recordsSlice.actions;

export const selectRecords = (state) => state.records.records;
export const selectRecordsStatus = (state) => state.records.status;

export default recordsSlice.reducer;
