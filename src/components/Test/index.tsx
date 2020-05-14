/* eslint-disable no-alert */
import React, { SetStateAction, Dispatch, useState } from "react";
import styles from "./index.module.css";

type SetData = Dispatch<
  SetStateAction<{ start: number; end: number; id: number }[]>
>;

type Data = { start: number; end: number; id: number }[];

interface propsType {
  setData: SetData;
  data: Data;
}

const addEvent = (data: Data, setData: SetData, start: string, end: string) => {
  const startNumber = +start;
  const endNumber = +end;
  if (Number.isNaN(startNumber)) return alert("start must be a number.");
  if (Number.isNaN(endNumber)) return alert("end must be a number.");
  if (startNumber < 0 || startNumber > 719)
    return alert("start must be with 0 ~ 719");
  if (endNumber < 1 || endNumber > 720)
    return alert("end must be with 1 ~ 720");
  if (endNumber <= startNumber) return alert("end must be large then start.");
  const newEvent = {
    start: startNumber,
    end: endNumber,
    id: data.length === 0 ? 0 : Math.max(...data.map((event) => event.id)) + 1,
  };

  setData([...data, newEvent]);

  return true;
};

const removeEvent = (data: Data, setData: SetData, id: number) => {
  const index = data.findIndex((event) => event.id === id);
  if (!index) return;
  const newData = [...data];
  newData.splice(index, 1);
  setData(newData);
};

const Test = ({ setData, data }: propsType) => {
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  const onChange = (type: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    if (type === "start") {
      setStart(value);
    } else {
      setEnd(value);
    }
  };

  const onAddClick = () => {
    addEvent(data, setData, start, end);
  };

  const onRemoveClick = (id: number) => () => {
    removeEvent(data, setData, id);
  };

  return (
    <div className={styles.test}>
      <h1 className={styles.title}>Test</h1>
      <div className={styles.block}>
        <h3 className={styles.blockTitle}>Current Data</h3>
        <div className={styles.blockContent}>
          <ul className={styles.dataList}>
            {data.map((event) => (
              <li key={event.id}>
                {`Start: ${event.start} End: ${event.end}`}
                <button
                  className={styles.remove}
                  type="submit"
                  onClick={onRemoveClick(event.id)}
                >
                  x
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.inputArea}>
            <label htmlFor="startInput">
              Start:
              <input
                id="startInput"
                type="text"
                value={start}
                onChange={onChange("start")}
              />
            </label>
            <label htmlFor="endInput">
              End:
              <input
                id="endInput"
                type="text"
                value={end}
                onChange={onChange("end")}
              />
            </label>
            <button className={styles.add} type="submit" onClick={onAddClick}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
