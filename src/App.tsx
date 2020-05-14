import React from "react";
import Calendar from "./components/Calendar";
import { merge, generateNodeGroup, NodeGroup } from "./lib/index";
import "./App.css";

const defaultData = [
  {
    start: 30,
    end: 150,
  },
  {
    start: 540,
    end: 600,
  },
  {
    start: 560,
    end: 620,
  },
  {
    start: 610,
    end: 670,
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
