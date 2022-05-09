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
        console.log(arg);
        if (arg) {
          state[arg] = [...state[arg], ...payload];
        } else {
          // This code will break if inventorypagesize changes and it's here for testing purposes
          state["unreviewed"] = [
            ...state["unreviewed"],
            payload[0],
            payload[1],
          ];
          state["voting"] = [...state["voting"], payload[2], payload[3]];
          state["finished"] = [...state["finished"], payload[4]];
        }
        state.status = "succeeded";
      }
    );
    builder.addCase(loadInventoryAsync.pending, (state) => {
      state.status = "pending";
    });
  },
  reducers: {
    loadInventory(state, { payload }) {
      const records = getInvRecords();
      if (payload) {
        state[payload] = [...state[payload], ...records];
      } else {
        // This code will break if inventorypagesize changes and it's here for testing purposes
        state["unreviewed"] = [...state["unreviewed"], records[0], records[1]];
        state["voting"] = [...state["voting"], records[2], records[3]];
        state["finished"] = [...state["finished"], records[4]];
      }
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
