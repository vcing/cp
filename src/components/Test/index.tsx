import React, { SetStateAction, Dispatch } from "react";
import styles from "./index.module.css";

interface propsType {
  setData: Dispatch<SetStateAction<{ start: number; end: number }[]>>;
}

const generateEvent = () => {};

const Test = ({ setData }: propsType) => {
  return (
    <div className={styles.test}>
      <h2>Test</h2>
    </div>
  );
};

export default Test;
