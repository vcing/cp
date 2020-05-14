/* eslint-disable no-alert */
import React, { SetStateAction, Dispatch, useState } from "react";
import styles from "./index.module.css";
import { merge, generateNodeGroup } from "../../lib";

type SetData = Dispatch<
  SetStateAction<{ start: number; end: number; id: number }[]>
>;

type Data = { start: number; end: number; id: number }[];

interface propsType {
  setData: SetData;
  data: Data;
}

/**
 * 根据规则生成新事件
 *
 * @param {number} eventCount
 * @param {number} minHeight
 * @param {number} maxHeight
 * @returns
 */
const generateEvents = (
  eventCount: number,
  minHeight: number,
  maxHeight: number
) => {
  const events: Data = [];
  for (let i = 0; i < eventCount; i += 1) {
    const start = Math.floor(Math.random() * (719 - minHeight));
    const end = Math.floor(
      start +
        minHeight +
        Math.random() * Math.min(720 - start - minHeight, maxHeight)
    );
    events.push({
      start,
      end,
      id: i,
    });
  }

  return events;
};

/**
 *  随机测试函数
 * 根据指定条件进行渲染或者单纯运行布局计算
 *
 * @param {(message: string) => void} addMessage
 * @param {SetData} setData hooks 设置数据
 * @param {number} eventCount 单次运行事件总数量
 * @param {number} times 运行次数 如果不为1 则只进行运算(因为react会合并多次数据变动结果)
 * @param {number} [minHeight=30]
 * @param {number} [maxHeight=720]
 * @param {boolean} [computeOnly=false]
 * @returns
 */
const randomTest = (
  addMessage: (message: string) => void,
  setData: SetData,
  eventCount: number,
  times: number,
  minHeight: number = 30,
  maxHeight: number = 720,
  computeOnly: boolean = false
) => {
  const testData: Data[] = [];
  for (let i = 0; i < times; i += 1) {
    testData.push(generateEvents(eventCount, minHeight, maxHeight));
  }

  const startTime = +new Date();
  console.time(computeOnly ? "compute" : "render");
  testData.forEach((events) => {
    if (computeOnly) {
      const eventGroups = merge(events);
      eventGroups.map(generateNodeGroup);
    } else {
      setData(events);
    }
  });
  console.timeEnd(computeOnly ? "compute" : "render");
  addMessage(
    `${
      computeOnly ? "Compute" : "Render"
    } ${eventCount} events layout ${times} times in ${
      +new Date() - startTime
    }ms`
  );

  return true;
};

/**
 *
 * 插入新事件
 * @param {Data} data
 * @param {SetData} setData
 * @param {string} start
 * @param {string} end
 * @returns
 */
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

/**
 * 根据ID删除事件
 *
 * @param {Data} data
 * @param {SetData} setData
 * @param {number} id
 * @returns
 */
const removeEvent = (data: Data, setData: SetData, id: number) => {
  const index = data.findIndex((event) => event.id === id);
  if (!index && index !== 0) return;
  const newData = [...data];
  newData.splice(index, 1);
  setData(newData);
};

const Test = ({ setData, data }: propsType) => {
  const [start, setStart] = useState<string>("0");
  const [end, setEnd] = useState<string>("120");
  const [count, setCount] = useState<string>("10");
  const [times, setTimes] = useState<string>("1");
  const [minHeight, setMinHeight] = useState<string>("30");
  const [maxHeight, setMaxHeight] = useState<string>("720");

  const [messages, setMessages] = useState<string[]>(["Render finished."]);

  const addMessage = (message: string) => {
    setMessages([...messages, message]);
  };

  const set = {
    start: setStart,
    end: setEnd,
    count: setCount,
    times: setTimes,
    minHeight: setMinHeight,
    maxHeight: setMaxHeight,
  };

  const onChange = (
    type: "start" | "end" | "count" | "times" | "minHeight" | "maxHeight"
  ) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    set[type](value);
  };

  const onAddClick = () => {
    addEvent(data, setData, start, end);
  };

  const onRemoveClick = (id: number) => () => {
    removeEvent(data, setData, id);
  };

  const invalidAlert = (type: string) =>
    alert(`${type} must be a positive number.`);
  const isSettingValid = () => {
    if (Number.isNaN(+count) || +count <= 0) {
      invalidAlert("max events count");
      return false;
    }
    if (Number.isNaN(+times) || +times <= 0) {
      invalidAlert("times");
      return false;
    }
    if (Number.isNaN(+minHeight) || +minHeight <= 0) {
      invalidAlert("min height");
      return false;
    }
    if (Number.isNaN(+maxHeight) || +maxHeight <= 0) {
      invalidAlert("max height");
      return false;
    }
    if (+maxHeight <= +minHeight) {
      alert("max height must be larger than min height.");
      return false;
    }
    return true;
  };

  const renderClick = () => {
    if (!isSettingValid()) return;
    if (+times > 1) return;
    randomTest(
      addMessage,
      setData,
      +count,
      +times,
      +minHeight,
      +maxHeight,
      false
    );
  };

  const computeClick = () => {
    if (!isSettingValid()) return;
    randomTest(
      addMessage,
      setData,
      +count,
      +times,
      +minHeight,
      +maxHeight,
      true
    );
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
      <div className={styles.block}>
        <h3 className={styles.blockTitle}>Random Test</h3>
        <div className={styles.blockContent}>
          <div className={styles.dialog}>
            {[...messages].reverse().map((message) => (
              <p key={Math.random()} className={styles.message}>
                {message}
              </p>
            ))}
          </div>
          <div className={styles.setting}>
            <label htmlFor="maxEventCount">
              Events count:
              <input
                id="maxEventCount"
                type="text"
                value={count}
                onChange={onChange("count")}
              />
            </label>
            <label htmlFor="times">
              Times:
              <input
                id="times"
                type="text"
                value={times}
                onChange={onChange("times")}
              />
            </label>
            <label htmlFor="minHeight">
              Min height:
              <input
                id="minHeight"
                type="text"
                value={minHeight}
                onChange={onChange("minHeight")}
              />
            </label>
            <label htmlFor="maxHeight">
              Max height:
              <input
                id="maxHeight"
                type="text"
                value={maxHeight}
                onChange={onChange("maxHeight")}
              />
            </label>
            <button
              className={+times === 1 ? "" : styles.disabled}
              type="submit"
              onClick={renderClick}
            >
              Render
            </button>
            <button type="submit" onClick={computeClick}>
              Compute only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
