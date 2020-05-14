import React from "react";
import { NodeGroup } from "../../lib/index";
import styles from "./index.module.css";

const Calendar = (props: { nodeGroups: NodeGroup[] }) => {
  const { nodeGroups } = props;
  const times = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8];
  const elements: React.ReactElement[] = [];
  nodeGroups.forEach((nodeGroup) => {
    nodeGroup.nodes.forEach((node) => {
      elements.push(
        <div
          key={node.id}
          className={styles.node}
          style={{
            width: 600 / nodeGroup.siblings,
            height: node.duration,
            top: node.start,
            left: (node.index * 600) / nodeGroup.siblings,
          }}
        >
          <h3>Sample Item</h3>
          <p>Sample Location</p>
        </div>
      );
    });
  });
  return (
    <div className={styles.calendar}>
      <h1 className={styles.title}>Calendar</h1>
      <div className={styles.wrap}>
        <div className={styles.timeLine}>
          {times.map((time, index) => (
            <div key={time} className={styles.timeGroup}>
              <div className={styles.time}>
                {time}
                :00
                <span>{index < 4 ? "AM" : "PM"}</span>
              </div>
              <div className={styles.timeHalf}>
                {time}
                :30
              </div>
            </div>
          ))}
          <div className={styles.timeGroup}>
            <div className={styles.time}>
              9:00
              <span>PM</span>
            </div>
          </div>
        </div>
        <div className={styles.container}>{elements}</div>
      </div>
    </div>
  );
};

export default Calendar;
