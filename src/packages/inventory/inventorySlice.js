import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unreviewed: [],
  voting: [],
  finished: [],
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

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
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

export const selectInventoryByType = (state, type) => state.inventory[type];

export default inventorySlice.reducer;
