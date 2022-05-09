import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  // uncomment line below to test sync actions
  // loadInventory,
  loadInventoryAsync,
  selectInventoryByType,
} from "../packages/inventory/inventorySlice";
import {
  // uncomment line below to test sync actions
  // addRecord,
  addRecordAsync,
  fetchMoreRecords,
  selectRecords,
} from "../packages/records/recordsSlice";
import { selectRecordsPageSize } from "../packages/records/recordsPolicySlice";
// import { selectInventoryPageSize } from "../packages/inventory/inventoryPolicySlice";

export const listenerMiddleware = createListenerMiddleware();

function fetchStatusList({
  status,
  state,
  recordsPageSize,
  allRecords,
  fetchList,
}) {
  const inventoryList = selectInventoryByType(state, status);
  for (const record of inventoryList) {
    if (fetchList.length === recordsPageSize) break;
    if (!allRecords[record]) {
      fetchList.push(record);
    }
  }
  if (
    fetchList[fetchList.length - 1] ===
      inventoryList[inventoryList.length - 1] ||
    fetchList.length === 0
  ) {
    // We know this list is done, we can move to the next
    return true;
  }
  return false;
}

// I am using the actionCreator here because it's easier.
// I can see lots of situations where predicate would be
// a better option.
listenerMiddleware.startListening({
  actionCreator: fetchMoreRecords,
  effect: (_, listenerApi) => {
    const state = listenerApi.getState();
    const dispatch = listenerApi.dispatch;
    const allRecords = selectRecords(state);
    const recordsPageSize = selectRecordsPageSize(state);
    // I am passing this array and mutating it because it's a controlled environment. This could also be done functionally with pure functions with no side effects.
    const tempRecordsList = [];
    let isUnreviewedDone = false;
    let isVotingDone = false;
    isUnreviewedDone = fetchStatusList({
      status: "unreviewed",
      state,
      allRecords,
      recordsPageSize,
      fetchList: tempRecordsList,
    });
    if (isUnreviewedDone) {
      isVotingDone = fetchStatusList({
        status: "voting",
        state,
        allRecords,
        recordsPageSize,
        fetchList: tempRecordsList,
      });
    }
    // here you can switch between addRecord and addRecordAsync for the sync/async version.
    tempRecordsList.forEach((r) => dispatch(addRecordAsync(r)));
    if (isVotingDone && isUnreviewedDone) {
      // here you can switch between loadInventory and loadInventoryAsync for the sync/async version.
      dispatch(loadInventoryAsync());
    }
  },
});
