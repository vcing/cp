import React from "react";
import { merge, generateNodes } from "./lib/index";
import logo from "./logo.svg";
import "./App.css";

(window as any).tt = () => {
  const data = [
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

  const dataWithId = data.map((event, index) => ({ id: index, ...event }));

  const eventGroups = merge(dataWithId);
  eventGroups.map(generateNodes);
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
