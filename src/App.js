import React, { useState } from "react";
import Records from "./packages/records/Records";
import Inventory from "./packages/inventory/Inventory";
import { fetchMoreRecords } from "./app/actions";
import { selectInventory } from "./packages/inventory/inventorySlice";
import { useSelector } from "react-redux";

function App() {
  const [tab, setTab] = useState(0);
  const inventory = useSelector(selectInventory);
  return (
    <div>
      <button disabled={tab === 0} onClick={() => setTab(0)}>
        Under review
      </button>
      <button disabled={tab === 1} onClick={() => setTab(1)}>
        Finished
      </button>
      {tab === 0 ? (
        <Records
          statuses={["unreviewed", "voting"]}
          inventory={inventory}
          fetchMoreRecords={fetchMoreRecords}
        />
      ) : (
        <Records
          statuses={["finished"]}
          inventory={inventory}
          fetchMoreRecords={fetchMoreRecords}
        />
      )}
      <Inventory />
    </div>
  );
}

export default App;
