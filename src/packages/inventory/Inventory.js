import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadInventory,
  selectInventory,
  selectInventoryStatus,
  loadInventoryAsync,
} from "./inventorySlice";

function Inventory() {
  const dispatch = useDispatch();
  const inventory = useSelector(selectInventory);
  const status = useSelector(selectInventoryStatus);
  // const [newInventoryType, setNewInventoryType] = useState("unreviewed");
  return (
    <div>
      <h1>Inventory</h1>
      {JSON.stringify(inventory, null, 2)}
      {/* <select
        value={newInventoryType}
        onChange={(e) => setNewInventoryType(e.target.value)}
      >
        <option>unreviewed</option>
        <option>voting</option>
        <option>finished</option>
      </select> */}
      <button onClick={() => dispatch(loadInventory())}>Load More</button>
      <button
        onClick={() => dispatch(loadInventoryAsync())}
        disabled={status === "pending"}
      >
        {status === "pending" ? "Pending ..." : "Load More Async"}
      </button>
    </div>
  );
}

export default Inventory;
