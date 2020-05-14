import React from "react";
import { NodeGroup } from "../../lib/index";

const Calendar = (props: { nodeGroups: NodeGroup[] }) => {
  const { nodeGroups } = props;
  console.log(nodeGroups);
  return <div>calendar</div>;
};

export default Calendar;
