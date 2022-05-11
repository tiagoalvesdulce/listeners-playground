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
  selectRecords,
} from "../packages/records/recordsSlice";
import { selectRecordsPageSize } from "../packages/records/recordsPolicySlice";
// import { selectInventoryPageSize } from "../packages/inventory/inventoryPolicySlice";
import { fetchMoreRecords } from "./actions";

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

listenerMiddleware.startListening({
  // Notice we have to use type here because an AsyncThunk is not an ActionCreator. Both can be dispatched but they are different. An ActionCreator returns an object while a thunk returns a function that we can do async stuff within and then dispatch the "action object".
  type: "inventory/loadInventoryAsync/fulfilled",
  effect: (_, listenerApi) => {
    console.log(listenerApi);
    // Hardcoding statuses here so we can see how this would work passing params to the loadInventoryAsync thunk.
    // This is needed to test the fetchMoreRecords right after the loadAsyncInventory success and will break the finished tab if it's the first one to load records.
    listenerApi.dispatch(fetchMoreRecords(["unreviewed", "voting"]));
  },
});

// I am using the actionCreator here because it's easier.
// I can see lots of situations where predicate would be
// a better option.
listenerMiddleware.startListening({
  actionCreator: fetchMoreRecords,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();
    const dispatch = listenerApi.dispatch;
    const allRecords = selectRecords(state);
    const recordsPageSize = selectRecordsPageSize(state);
    // I am passing this array and mutating it because it's a controlled environment. This could also be done with pure functions with no side effects.
    const tempRecordsList = [];
    const statuses = action.payload;
    const isStatusDone = Array(statuses.length).fill(false);

    let i = 0;
    while (statuses[i]) {
      const isStatusIndexDone = fetchStatusList({
        status: statuses[i],
        state,
        allRecords,
        recordsPageSize,
        fetchList: tempRecordsList,
      });
      if (!isStatusIndexDone) {
        break;
      } else {
        isStatusDone[i] = true;
        i++;
      }
    }
    tempRecordsList.forEach((r) => dispatch(addRecordAsync(r)));

    // You will notice we are checking if every status is done before fetching another page of inventory. That's because we have an infinite inventory in this demo. In a real app we would go all the way through inventory pages for 1 status before jumping to the next one
    if (isStatusDone.every((st) => st)) {
      // here you can switch between loadInventory and loadInventoryAsync for the sync/async version.
      dispatch(loadInventoryAsync());
    }
  },
});
