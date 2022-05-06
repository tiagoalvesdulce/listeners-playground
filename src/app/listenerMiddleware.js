import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  loadInventory,
  selectInventoryByType,
} from "../packages/inventory/inventorySlice";
import {
  addRecord,
  fetchMoreRecords,
  selectRecords,
} from "../packages/records/recordsSlice";
import { selectRecordsPageSize } from "../packages/records/recordsPolicySlice";
import { selectInventoryPageSize } from "../packages/inventory/inventoryPolicySlice";

export const listenerMiddleware = createListenerMiddleware();

let fetched = 1;
// I am using the actionCreator here because it's easier.
// I can see lots of situations where predicate would be
// a better option.
listenerMiddleware.startListening({
  actionCreator: fetchMoreRecords,
  effect: (_, listenerApi) => {
    const state = listenerApi.getState();
    const unreviewedRecords = selectInventoryByType(state, "unreviewed");
    const allRecords = selectRecords(state);
    const recordsPageSize = selectRecordsPageSize(state);
    const inventoryPageSize = selectInventoryPageSize(state);
    const tempRecordsList = [];
    for (const record of unreviewedRecords) {
      if (tempRecordsList.length === recordsPageSize) break;
      if (!allRecords[record]) {
        tempRecordsList.push(record);
      }
    }
    tempRecordsList.forEach((r) => listenerApi.dispatch(addRecord(r)));
    if (
      unreviewedRecords.length === inventoryPageSize * fetched &&
      tempRecordsList[tempRecordsList.length - 1] ===
        unreviewedRecords[unreviewedRecords.length - 1]
    ) {
      listenerApi.dispatch(loadInventory("unreviewed"));
      fetched++;
    }
  },
});
