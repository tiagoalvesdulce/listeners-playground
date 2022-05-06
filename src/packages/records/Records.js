import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeRecord,
  selectRecords,
  fetchMoreRecords,
  addRecord,
} from "./recordsSlice";

function Records() {
  const records = useSelector(selectRecords);
  const [newRecord, setNewRecord] = useState("");
  const dispatch = useDispatch();
  return (
    <div>
      {records.length === 0 ? (
        <h1>No records!</h1>
      ) : (
        <div>
          {Object.values(records).map((record) => (
            <div key={record.recordInfo}>
              <span>{record.recordInfo}</span>
              <button onClick={() => dispatch(removeRecord(record))}>❌</button>
            </div>
          ))}
          <button onClick={() => dispatch(fetchMoreRecords())}>
            Fetch more
          </button>
          <br></br>
          <br></br>
          <input
            placeholder="New record"
            value={newRecord}
            onChange={(e) => setNewRecord(e.target.value)}
          />
          <button onClick={() => dispatch(addRecord(newRecord))}>
            Add individual record
          </button>
        </div>
      )}
    </div>
  );
}

export default Records;
