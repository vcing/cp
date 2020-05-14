/**
 *
 * 事件结构
 * 由于无论是react列表，还是新增删除操作
 * 都需要对每一个事件有一个唯一标识
 * 所以在读取数据时默认会将该事件在数组中的序号作为ID
 * @export
 * @interface Event
 */
export interface Event {
  id: number;
  start: number;
  end: number;
}

/**
 * 事件组
 * 表示一系列相互影响的数据
 * 由于任意两个数据如果在事件时间上有重合，则他们就应该一样宽
 * 所以以一组互相存在区间交集的事件为单位进行布局运算
 * 保存开始结束时间方便之后插入新时间事直接插入对应组而不影响其他组
 *
 * @export
 * @interface EventGroup
 */
export interface EventGroup {
  id: number;
  events: Event[];
  start: number;
  end: number;
}

/**
 * 可渲染节点
 * 节点信息加上节点组中的兄弟数量信息就可以直接渲染出一个事件的位置
 *
 * @export
 * @interface Node
 */
export interface Node {
  id: number;
  start: number;
  index: number;
  duration: number;
}

/**
 * 节点组
 * 由事件组进过计算而来
 * 包含渲染所需要的兄弟数量(列数)信息
 *
 * @export
 * @interface NodeGroup
 */
export interface NodeGroup {
  id: number;
  nodes: Node[];
  siblings: number;
}

export const isValidEvent = (event: Event) => {
  if (event.start >= event.end || event.start < 0 || event.end > 720)
    return false;
  return true;
};

export /**
 * 合并相互存在的交集的事件为一个事件组
 *
 * @param {Event[]} events
 * @returns {EventGroup[]}
 */
const merge = (events: Event[]) => {
  if (events.length === 0) return [];
  if (!events.every(isValidEvent)) {
    throw new Error("invalid events");
  }
  // 先按开始事件进行排序
  events.sort((a, b) => {
    if (a.start !== b.start) {
      return a.start - b.start;
    }
    return a.end - b.end;
  });
  const result: EventGroup[] = [];
  // 用前后两个滑动指针来统计该组范围
  let startPointer = events[0].start;
  let endPointer = events[0].end;
  let currentEventGroup: EventGroup = {
    id: result.length,
    events: [events[0]],
    start: startPointer,
    end: endPointer,
  };

  for (let i = 1; i < events.length; i += 1) {
    const currentEvent = events[i];
    if (currentEvent.start >= endPointer) {
      currentEventGroup.end = endPointer;
      result.push(currentEventGroup);
      startPointer = currentEvent.start;
      endPointer = currentEvent.end;
      currentEventGroup = {
        id: result.length,
        events: [currentEvent],
        start: startPointer,
        end: endPointer,
      };
    } else {
      endPointer = Math.max(currentEvent.end, endPointer);
      currentEventGroup.events.push(currentEvent);
    }
  }
  currentEventGroup.end = endPointer;
  result.push(currentEventGroup);

  return result;
};

//
export /**
 *
 * 将EventGroup转化成可以直接渲染的节点组NodeGroup形式
 *
 * @param {EventGroup} eventGroup
 * @returns {NodeGroup}
 */
const generateNodeGroup = (eventGroup: EventGroup) => {
  // 如果该组只有一个事件 则为独占模式
  if (eventGroup.events.length === 1) {
    const currentEvent = eventGroup.events[0];
    return {
      id: eventGroup.id,
      nodes: [
        {
          id: currentEvent.id,
          start: currentEvent.start,
          duration: currentEvent.end - currentEvent.start,
          index: 0,
        },
      ],
      siblings: 1,
    } as NodeGroup;
  }

  const nodeGroup: NodeGroup = {
    id: eventGroup.id,
    nodes: [],
    siblings: 0,
  };

  // 以时间点为key来记录每个时间点上的事件
  const eventStack: { [key: number]: Event[] } = {};

  eventGroup.events.forEach((event) => {
    // 如果一个时间点有多个开始结束时间，则应先处理结束事件，让出空位
    // 所以结束事件往数组头部插入,开始事件往数组尾部插入
    if (eventStack[event.start]) {
      eventStack[event.start].push(event);
    } else {
      eventStack[event.start] = [event];
    }

    if (eventStack[event.end]) {
      eventStack[event.end].unshift(event);
    } else {
      eventStack[event.end] = [event];
    }
  });

  // 按事件排序 然后进行遍历
  const sortedKeys = Object.keys(eventStack)
    .map((key) => parseInt(key, 10))
    .sort((a, b) => a - b);
  // 记录经过上一个节点后的兄弟节点数量
  let currentSiblings = 0;
  // 当前事件组的最大兄弟数量
  let maxSiblings = 0;
  // 统计列的占用情况
  const occupied: number[] = [];
  sortedKeys.forEach((key) => {
    const events = eventStack[key];
    // 处理同一时间节点上的多个进出栈事件
    events.forEach((event) => {
      if (key === event.start) {
        currentSiblings += 1;
        // 如果occupied为空直接占第一个位置，否则进行查找
        let index =
          occupied.length === 0
            ? 0
            : occupied.findIndex((i) => i === undefined || i === -1);
        // 如果查找不到空位，则往后追加
        index = index === -1 ? occupied.length : index;
        occupied[index] = event.id; // 占位
        nodeGroup.nodes.push({
          id: event.id,
          start: event.start,
          duration: event.end - event.start,
          index,
        });
      } else {
        currentSiblings -= 1;
        const index = occupied.findIndex((i) => i === event.id);
        // 清除占位
        occupied[index] = -1;
      }
    });
    maxSiblings = Math.max(maxSiblings, currentSiblings);
  });

  nodeGroup.siblings = maxSiblings;

  return nodeGroup;
};
