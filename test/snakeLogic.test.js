import test from "node:test";
import assert from "node:assert/strict";

import {
  createInitialState,
  placeFood,
  queueDirection,
  stepGame
} from "../src/snakeLogic.js";

test("snake moves one cell in the current direction", () => {
  const state = createInitialState({
    width: 10,
    height: 10,
    start: [
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 1, y: 3 }
    ],
    direction: "right",
    food: { x: 9, y: 9 }
  });

  const next = stepGame(state);

  assert.deepEqual(next.snake, [
    { x: 4, y: 3 },
    { x: 3, y: 3 },
    { x: 2, y: 3 }
  ]);
});

test("snake grows and increments score after eating food", () => {
  const state = createInitialState({
    width: 10,
    height: 10,
    start: [
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 1, y: 3 }
    ],
    direction: "right",
    food: { x: 4, y: 3 }
  });

  const next = stepGame(state, () => 0);

  assert.equal(next.score, 1);
  assert.equal(next.snake.length, 4);
  assert.deepEqual(next.snake[0], { x: 4, y: 3 });
  assert.notDeepEqual(next.food, { x: 4, y: 3 });
});

test("snake cannot reverse directly into itself", () => {
  const state = createInitialState({
    width: 10,
    height: 10,
    direction: "right",
    food: { x: 8, y: 8 }
  });

  const queued = queueDirection(state, "left");

  assert.equal(queued.pendingDirection, "right");
});

test("collision with a wall ends the game", () => {
  const state = createInitialState({
    width: 4,
    height: 4,
    start: [
      { x: 3, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 1 }
    ],
    direction: "right",
    food: { x: 0, y: 0 }
  });

  const next = stepGame(state);

  assert.equal(next.isGameOver, true);
});

test("food placement avoids snake cells", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 }
  ];

  const food = placeFood(snake, 2, 2, () => 0);

  assert.deepEqual(food, { x: 1, y: 1 });
});
