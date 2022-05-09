import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  unreviewed: [],
  voting: [],
  finished: [],
  status: "idle", // pending, succeeded, failed
};

let last = 0;

function getInvRecords() {
  const recordsArr = [];
  for (let i = 0; i < 5; i++) {
    recordsArr.push("record" + last);
    last++;
  }
  return recordsArr;
}

function asyncLoadMoreInventory() {
  return new Promise((res) => {
    setTimeout(() => {
      res(getInvRecords());
    }, 1000);
  });
}

export const loadInventoryAsync = createAsyncThunk(
  "inventory/loadInventoryAsync",
  async () => {
    const response = await asyncLoadMoreInventory();
    return response;
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(
      loadInventoryAsync.fulfilled,
      (state, { meta: { arg }, payload }) => {
        state[arg] = [...state[arg], ...payload];
        state.status = "succeeded";
      }
    );
    builder.addCase(loadInventoryAsync.pending, (state) => {
      state.status = "pending";
    });
  },
  reducers: {
    loadInventory(state, { payload }) {
      state[payload] = [...state[payload], ...getInvRecords()];
    },
    removeInventory(state, { payload }) {
      const { type, record } = payload;
      state[type] = state.filter((r) => r !== record);
    },
  },
});

export const { loadInventory, removeInventory } = inventorySlice.actions;

export const selectInventory = (state) => state.inventory;
export const selectInventoryStatus = (state) => state.inventory.status;
export const selectInventoryByType = (state, type) => state.inventory[type];

export default inventorySlice.reducer;
