import React from "react";
import Calendar from "./components/Calendar";
import { merge, generateNodeGroup, NodeGroup } from "./lib/index";
import "./App.css";

// const defaultData = [
//   {
//     start: 30,
//     end: 150,
//   },
//   {
//     start: 540,
//     end: 600,
//   },
//   {
//     start: 560,
//     end: 620,
//   },
//   {
//     start: 610,
//     end: 670,
//   },
// ];

const defaultData = [
  {
    start: 0,
    end: 30,
    id: 0,
  },
  {
    start: 30,
    end: 60,
    id: 1,
  },
  {
    start: 0,
    end: 60,
    id: 3,
  },
  {
    start: 30,
    end: 90,
    id: 4,
  },
  {
    start: 60,
    end: 120,
    id: 5,
  },
  {
    start: 50,
    end: 180,
    id: 6,
  },
];

function App() {
  const data = defaultData;
  const dataWithId = data.map((event, index) => ({ id: index, ...event }));
  const eventGroups = merge(dataWithId);
  const nodeGroups: NodeGroup[] = eventGroups.map(generateNodeGroup);

  return (
    <div className="App">
      <Calendar nodeGroups={nodeGroups} />
    </div>
  );
}

export default App;
