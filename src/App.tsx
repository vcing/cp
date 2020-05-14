import React, { useState } from "react";
import Calendar from "./components/Calendar";
import Test from "./components/Test";
import { merge, generateNodeGroup, NodeGroup } from "./lib/index";
import "./App.css";

const defaultData = [
  {
    start: 30,
    end: 150,
    id: 0,
  },
  {
    start: 540,
    end: 600,
    id: 1,
  },
  {
    start: 560,
    end: 620,
    id: 2,
  },
  {
    start: 610,
    end: 670,
    id: 3,
  },
];

function App() {
  const [data, setData] = useState(defaultData);
  // const data = defaultData;
  const eventGroups = merge(data);
  const nodeGroups: NodeGroup[] = eventGroups.map(generateNodeGroup);

  return (
    <div className="App">
      <Calendar nodeGroups={nodeGroups} />
      <Test setData={setData} data={data} />
    </div>
  );
}

export default App;
