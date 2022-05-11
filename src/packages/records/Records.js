import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeRecord,
  selectRecords,
  addRecord,
  selectRecordsStatus,
  addRecordAsync,
} from "./recordsSlice";

function Records({ fetchMoreRecords, statuses, inventory }) {
  const records = useSelector(selectRecords);
  const list = [];
  statuses.forEach((st) => list.push(...inventory[st]));
  const recordsInList = [];
  list.forEach((l) => {
    if (records[l]) recordsInList.push(l);
  });
  const status = useSelector(selectRecordsStatus);
  const [newRecord, setNewRecord] = useState("");
  const dispatch = useDispatch();
  return (
    <div>
      {recordsInList.length === 0 ? (
        <>
          <h1>No records!</h1>
          <button onClick={() => dispatch(fetchMoreRecords(statuses))}>
            Fetch more
          </button>
        </>
      ) : (
        <div>
          {recordsInList.map((record) => (
            <div key={records[record].recordInfo}>
              <span>{records[record].recordInfo}</span>
              <button onClick={() => dispatch(removeRecord(records[record]))}>
                ❌
              </button>
            </div>
          ))}
          <button onClick={() => dispatch(fetchMoreRecords(statuses))}>
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
          <button
            onClick={() => dispatch(addRecordAsync(newRecord))}
            disabled={status === "pending"}
          >
            {status === "pending" ? "Pending..." : "Add record async"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Records;
