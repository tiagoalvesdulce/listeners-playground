import { configureStore } from "@reduxjs/toolkit";
import { listenerMiddleware } from "./listenerMiddleware";
import recordsReducer from "../packages/records/recordsSlice";
import inventoryReducer from "../packages/inventory/inventorySlice";
import recordsPolicyReducer from "../packages/records/recordsPolicySlice";
import inventoryPolicyReducer from "../packages/inventory/inventoryPolicySlice";

export const store = configureStore({
  reducer: {
    records: recordsReducer,
    inventory: inventoryReducer,
    recordsPolicy: recordsPolicyReducer,
    inventoryPolicy: inventoryPolicyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
