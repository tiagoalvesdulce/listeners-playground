import React from "react";
import Records from "./packages/records/Records";
import Inventory from "./packages/inventory/Inventory";

function App() {
  return (
    <div>
      <header>
        <Records />
        <Inventory />
      </header>
    </div>
  );
}

export default App;
