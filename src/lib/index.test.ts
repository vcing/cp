import { Event, merge, generateNodes } from "./index";

test("generate nodes for 3 events", () => {
  const data: Event[] = [
    {
      start: 1,
      end: 2,
      id: 0,
    },
    {
      start: 2,
      end: 3,
      id: 1,
    },
    {
      start: 1,
      end: 3,
      id: 3,
    },
  ];

  const eventGroups = merge(data);
  expect(eventGroups).toStrictEqual([
    {
      events: data,
      start: 1,
      end: 3,
    },
  ]);

  const nodes = eventGroups.map(generateNodes);
  expect(nodes).toStrictEqual([
    [
      {
        id: 0,
        start: 1,
        duration: 1,
        siblings: 2,
        index: 0,
      },
      {
        id: 3,
        start: 1,
        duration: 2,
        siblings: 2,
        index: 1,
      },
      {
        id: 1,
        start: 2,
        duration: 1,
        siblings: 2,
        index: 0,
      },
    ],
  ]);
});

test("generate node for calendar puzzle", () => {
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
  const result = eventGroups.map(generateNodes);
  expect(result).toStrictEqual([
    [{ top: 30, duration: 120, sibling: 1, index: 1 }],
    [
      { id: 1, start: 540, duration: 60, siblings: 2, index: 0 },
      { id: 2, start: 560, duration: 60, siblings: 2, index: 1 },
      { id: 3, start: 610, duration: 60, siblings: 2, index: 0 },
    ],
  ]);
});
